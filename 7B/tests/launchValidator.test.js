
const test = require('node:test');
const assert = require('node:assert/strict');

const { validateLaunch } = require('../launchValidator');

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

test('accepts a valid provisional launch', () => {
    const result = validateLaunch(validLaunch);

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test('rejects a missing contract version', () => {
    const { contractVersion, ...launch } = validLaunch;

    const result = validateLaunch(launch);

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.includes('contractVersion must be provisional-0.')
    );
});

test('rejects an invalid contract version', () => {
    const result = validateLaunch({
        ...validLaunch,
        contractVersion: 'unknown-version'
    });

    assert.equal(result.valid, false);
});

test('rejects a missing launch ID', () => {
    const result = validateLaunch({
        ...validLaunch,
        launchId: ''
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes('launchId is required.'));
});

test('rejects a missing activity ID', () => {
    const result = validateLaunch({
        ...validLaunch,
        activityId: ''
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes('activityId is required.'));
});

test('rejects a missing user ID', () => {
    const result = validateLaunch({
        ...validLaunch,
        user: {}
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes('user.id is required.'));
});

test('rejects a missing resource ID', () => {
    const result = validateLaunch({
        ...validLaunch,
        resource: {}
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes('resource.id is required.'));
});

test('rejects a non-object launch', () => {
    const result = validateLaunch(null);

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes('Launch must be an object.'));
});

test('accepts a launch without an optional user name', () => {
    const result = validateLaunch({
        ...validLaunch,
        user: {
            id: 'student-123'
        }
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test('accepts a launch with a null user name', () => {
    const result = validateLaunch({
        ...validLaunch,
        user: {
            id: 'student-123',
            name: null
        }
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test('accepts a launch with a string user name', () => {
    const result = validateLaunch({
        ...validLaunch,
        user: {
            id: 'student-123',
            name: 'Demo Student'
        }
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test('rejects a numeric optional user name', () => {
    const result = validateLaunch({
        ...validLaunch,
        user: {
            id: 'student-123',
            name: 12345
        }
    });

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.includes(
            'user.name must be a string or null when supplied.'
        )
    );
});

test('rejects an object as the optional user name', () => {
    const result = validateLaunch({
        ...validLaunch,
        user: {
            id: 'student-123',
            name: { first: 'Demo' }
        }
    });

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.includes(
            'user.name must be a string or null when supplied.'
        )
    );
});
