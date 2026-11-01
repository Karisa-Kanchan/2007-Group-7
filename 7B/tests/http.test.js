
const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('../server');

const validLaunch = {
    contractVersion: 'provisional-0',
    launchId: 'launch-001',
    activityId: 'digital-logic-lesson',
    user: {
        id: 'student-123'
    },
    resource: {
        id: 'resource-link-demo-01'
    }
};

// Start a temporary HTTP server for each test.
async function startServer(t) {
    const server = app.listen(0, '127.0.0.1');

    await new Promise((resolve, reject) => {
        if (server.listening) {
            resolve();
        } else {
            server.once('listening', resolve);
            server.once('error', reject);
        }
    });

    t.after(() => {
        server.close();
    });

    return `http://127.0.0.1:${server.address().port}`;
}

// Send a JSON request to the temporary P7B server.
async function postLaunch(baseUrl, launch) {
    const response = await fetch(`${baseUrl}/launch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(launch)
    });

    return {
        status: response.status,
        body: await response.json()
    };
}

// Mock outgoing target requests without intercepting
// requests sent to the actual P7B HTTP server.
function mockTargetFetch(t, handler) {
    const originalFetch = global.fetch;

    global.fetch = async (url, options) => {
        const targetUrl = String(url);

        if (
            targetUrl.startsWith('http://localhost:4001/') ||
            targetUrl.startsWith('http://localhost:4002/')
        ) {
            return handler(targetUrl, options);
        }

        return originalFetch(url, options);
    };

    t.after(() => {
        global.fetch = originalFetch;
    });
}

// --------------------------------------------------
// HEALTH ENDPOINT
// --------------------------------------------------

test('GET /health returns the P7B service status', async (t) => {
    const baseUrl = await startServer(t);

    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(
        body.service,
        'P7B Activity Registry & Target Broker'
    );
});

// --------------------------------------------------
// ACTIVITY REGISTRY ENDPOINTS
// --------------------------------------------------

test('GET /activities returns registered activities', async (t) => {
    const baseUrl = await startServer(t);

    const response = await fetch(`${baseUrl}/activities`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.activities));

    assert.ok(
        body.activities.some(
            activity => activity.id === 'digital-logic-lesson'
        )
    );

    assert.ok(
        body.activities.some(
            activity => activity.id === 'vhdl-simulation'
        )
    );
});

test('GET /activities/:activityId resolves a registered activity', async (t) => {
    const baseUrl = await startServer(t);

    const response = await fetch(
        `${baseUrl}/activities/digital-logic-lesson`
    );

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.id, 'digital-logic-lesson');
    assert.equal(body.targetType, 'digital-tutor');
});

test('GET /activities/:activityId rejects an unknown activity', async (t) => {
    const baseUrl = await startServer(t);

    const response = await fetch(
        `${baseUrl}/activities/unknown-activity`
    );

    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error, 'Activity not found');
});

// --------------------------------------------------
// INCOMING LAUNCH VALIDATION
// --------------------------------------------------

test('POST /launch rejects a missing activity ID', async (t) => {
    const baseUrl = await startServer(t);

    const result = await postLaunch(baseUrl, {
        contractVersion: 'provisional-0',
        launchId: 'launch-002',
        user: {
            id: 'student-123'
        },
        resource: {
            id: 'resource-link-demo-01'
        }
    });

    assert.equal(result.status, 400);
    assert.equal(result.body.error, 'Invalid launch');
    assert.ok(
        result.body.details.includes('activityId is required.')
    );
});

test('POST /launch rejects an empty activity ID', async (t) => {
    const baseUrl = await startServer(t);

    const result = await postLaunch(baseUrl, {
        ...validLaunch,
        activityId: '   '
    });

    assert.equal(result.status, 400);
    assert.equal(result.body.error, 'Invalid launch');
    assert.ok(
        result.body.details.includes('activityId is required.')
    );
});

test('POST /launch rejects a non-object launch', async (t) => {
    const baseUrl = await startServer(t);

    const result = await postLaunch(baseUrl, []);

    assert.equal(result.status, 400);
    assert.equal(result.body.error, 'Invalid launch');
    assert.ok(
        result.body.details.includes('Launch must be an object.')
    );
});

test('POST /launch rejects an unknown activity', async (t) => {
    const baseUrl = await startServer(t);

    const result = await postLaunch(baseUrl, {
        ...validLaunch,
        activityId: 'unknown-activity'
    });

    assert.equal(result.status, 404);
    assert.equal(result.body.error, 'Activity not found');
});

// --------------------------------------------------
// SUCCESSFUL LAUNCH-TO-RESULT WORKFLOWS
// --------------------------------------------------

test('POST /launch completes a Digital Tutor activity', async (t) => {
    const baseUrl = await startServer(t);

    let requestedUrl;
    let forwardedLaunch;

    mockTargetFetch(t, async (url, options) => {
        requestedUrl = url;
        forwardedLaunch = JSON.parse(options.body);

        return Response.json({
            launchId: forwardedLaunch.launchId,
            activityId: forwardedLaunch.activityId,
            userId: forwardedLaunch.user.id,
            status: 'completed',
            message: 'Digital Tutor activity completed successfully'
        });
    });

    const result = await postLaunch(baseUrl, validLaunch);

    assert.equal(result.status, 200);
    assert.equal(requestedUrl, 'http://localhost:4001/launch');

    assert.deepEqual(forwardedLaunch, validLaunch);

    assert.deepEqual(result.body, {
        contractVersion: 'provisional-0',
        launchId: 'launch-001',
        activityId: 'digital-logic-lesson',
        userId: 'student-123',
        status: 'completed',
        message: 'Digital Tutor activity completed successfully'
    });
});

test('POST /launch completes a Web VHDL Lab activity', async (t) => {
    const baseUrl = await startServer(t);

    const launch = {
        ...validLaunch,
        launchId: 'launch-003',
        activityId: 'vhdl-simulation',
        resource: {
            id: 'resource-link-demo-02'
        }
    };

    let requestedUrl;
    let forwardedLaunch;

    mockTargetFetch(t, async (url, options) => {
        requestedUrl = url;
        forwardedLaunch = JSON.parse(options.body);

        return Response.json({
            launchId: forwardedLaunch.launchId,
            activityId: forwardedLaunch.activityId,
            userId: forwardedLaunch.user.id,
            status: 'completed',
            message: 'Web VHDL Lab activity completed successfully'
        });
    });

    const result = await postLaunch(baseUrl, launch);

    assert.equal(result.status, 200);
    assert.equal(requestedUrl, 'http://localhost:4002/launch');

    assert.deepEqual(forwardedLaunch, launch);

    assert.deepEqual(result.body, {
        contractVersion: 'provisional-0',
        launchId: 'launch-003',
        activityId: 'vhdl-simulation',
        userId: 'student-123',
        status: 'completed',
        message: 'Web VHDL Lab activity completed successfully'
    });
});

// --------------------------------------------------
// RESULT ASSOCIATION VALIDATION
// --------------------------------------------------

test('POST /launch rejects a mismatched target launch ID', async (t) => {
    const baseUrl = await startServer(t);

    mockTargetFetch(t, async () => Response.json({
        launchId: 'wrong-launch',
        status: 'completed'
    }));

    const result = await postLaunch(baseUrl, validLaunch);

    // The provisional server maps normalisation errors to HTTP 502.
    assert.equal(result.status, 502);
    assert.equal(result.body.error, 'Target dispatch failed');
});

test('POST /launch rejects a mismatched target activity ID', async (t) => {
    const baseUrl = await startServer(t);

    mockTargetFetch(t, async () => Response.json({
        activityId: 'vhdl-simulation',
        status: 'completed'
    }));

    const result = await postLaunch(baseUrl, validLaunch);

    assert.equal(result.status, 502);
    assert.equal(result.body.error, 'Target dispatch failed');
});

test('POST /launch rejects a mismatched target user ID', async (t) => {
    const baseUrl = await startServer(t);

    mockTargetFetch(t, async () => Response.json({
        userId: 'another-student',
        status: 'completed'
    }));

    const result = await postLaunch(baseUrl, validLaunch);

    assert.equal(result.status, 502);
    assert.equal(result.body.error, 'Target dispatch failed');
});

// --------------------------------------------------
// TARGET RESPONSE AND NETWORK ERRORS
// --------------------------------------------------

test('POST /launch handles a target HTTP 503 response', async (t) => {
    const baseUrl = await startServer(t);

    mockTargetFetch(t, async () => new Response(
        JSON.stringify({ error: 'Unavailable' }),
        {
            status: 503,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ));

    const result = await postLaunch(baseUrl, validLaunch);

    assert.equal(result.status, 502);
    assert.equal(result.body.error, 'Target dispatch failed');
});

test('POST /launch rejects an invalid target result status', async (t) => {
    const baseUrl = await startServer(t);

    mockTargetFetch(t, async () => Response.json({
        status: 'unsupported-status'
    }));

    const result = await postLaunch(baseUrl, validLaunch);

    assert.equal(result.status, 502);
    assert.equal(result.body.error, 'Target dispatch failed');
});

test('POST /launch handles a target network failure', async (t) => {
    const baseUrl = await startServer(t);

    mockTargetFetch(t, async () => {
        throw new Error('Simulated connection failure');
    });

    const result = await postLaunch(baseUrl, validLaunch);

    assert.equal(result.status, 502);
    assert.equal(result.body.error, 'Target dispatch failed');
});
