
const test = require('node:test');
const assert = require('node:assert/strict');

const { dispatchActivity } = require('../broker');

test('rejects an activity that is not registered', async () => {
    await assert.rejects(
        dispatchActivity('unknown-activity', {
            activityId: 'unknown-activity'
        }),
        {
            message: 'Activity not registered: unknown-activity'
        }
    );
});

test('dispatches a launch to the Digital Tutor target', async (t) => {
    const originalFetch = global.fetch;

    t.after(() => {
        global.fetch = originalFetch;
    });

    let requestedUrl;
    let requestedOptions;

    global.fetch = async (url, options) => {
        requestedUrl = url;
        requestedOptions = options;

        return {
            ok: true,
            json: async () => ({
                message: 'Digital Tutor test double received launch'
            })
        };
    };

    const launch = {
        activityId: 'digital-logic-lesson'
    };

    const result = await dispatchActivity(
        'digital-logic-lesson',
        launch
    );

    assert.equal(
        requestedUrl,
        'http://localhost:4001/launch'
    );

    assert.equal(requestedOptions.method, 'POST');

    assert.equal(
        requestedOptions.headers['Content-Type'],
        'application/json'
    );

    assert.deepEqual(
        JSON.parse(requestedOptions.body),
        launch
    );

    assert.equal(
        result.message,
        'Digital Tutor test double received launch'
    );
});

test('dispatches a launch to the Web VHDL Lab target', async (t) => {
    const originalFetch = global.fetch;

    t.after(() => {
        global.fetch = originalFetch;
    });

    let requestedUrl;
    let requestedOptions;

    global.fetch = async (url, options) => {
        requestedUrl = url;
        requestedOptions = options;

        return {
            ok: true,
            json: async () => ({
                message: 'Web VHDL Lab test double received launch'
            })
        };
    };

    const launch = {
        activityId: 'vhdl-simulation'
    };

    const result = await dispatchActivity(
        'vhdl-simulation',
        launch
    );

    assert.equal(
        requestedUrl,
        'http://localhost:4002/launch'
    );

    assert.equal(requestedOptions.method, 'POST');

    assert.equal(
        requestedOptions.headers['Content-Type'],
        'application/json'
    );

    assert.deepEqual(
        JSON.parse(requestedOptions.body),
        launch
    );

    assert.equal(
        result.message,
        'Web VHDL Lab test double received launch'
    );
});

test('rejects a target response with an HTTP error', async (t) => {
    const originalFetch = global.fetch;

    t.after(() => {
        global.fetch = originalFetch;
    });

    global.fetch = async () => ({
        ok: false,
        status: 503
    });

    await assert.rejects(
        dispatchActivity('digital-logic-lesson', {
            activityId: 'digital-logic-lesson'
        }),
        {
            message: 'Target returned HTTP 503'
        }
    );
});
