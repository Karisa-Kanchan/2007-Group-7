
const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeResult } = require('../resultNormalizer');

const validLaunch = {
    contractVersion: 'provisional-0',
    launchId: 'launch-001',
    activityId: 'digital-logic-lesson',
    user: {
        id: 'student-123'
    }
};

test('normalises a successful activity result', () => {
    const targetResult = {
        status: 'completed',
        message: 'Activity completed successfully'
    };

    const result = normalizeResult(validLaunch, targetResult);

    assert.deepEqual(result, {
        contractVersion: 'provisional-0',
        launchId: 'launch-001',
        activityId: 'digital-logic-lesson',
        userId: 'student-123',
        status: 'completed',
        message: 'Activity completed successfully'
    });
});

test('rejects a result with an invalid status', () => {
    assert.throws(
        () => normalizeResult(validLaunch, {
            status: 'unknown'
        }),
        {
            message: 'Invalid target result status'
        }
    );
});

test('rejects a launch without its identifier', () => {
    const invalidLaunch = {
        ...validLaunch,
        launchId: ''
    };

    assert.throws(
        () => normalizeResult(invalidLaunch, {
            status: 'completed'
        }),
        {
            message: 'Missing required launch information'
        }
    );
});

test('rejects a missing target result', () => {
    assert.throws(
        () => normalizeResult(validLaunch, null),
        {
            message: 'Invalid target result'
        }
    );
});

test('rejects a target result with a mismatched launch ID', () => {
    const targetResult = {
        launchId: 'different-launch',
        status: 'completed',
        message: 'Activity completed'
    };

    assert.throws(
        () => normalizeResult(validLaunch, targetResult),
        {
            message: 'Target result launchId does not match originating launch'
        }
    );
});

test('rejects a target result with a mismatched activity ID', () => {
    const targetResult = {
        activityId: 'vhdl-simulation',
        status: 'completed',
        message: 'Activity completed'
    };

    assert.throws(
        () => normalizeResult(validLaunch, targetResult),
        {
            message: 'Target result activityId does not match originating activity'
        }
    );
});

test('rejects a target result with a mismatched user ID', () => {
    const targetResult = {
        userId: 'student-456',
        status: 'completed',
        message: 'Activity completed'
    };

    assert.throws(
        () => normalizeResult(validLaunch, targetResult),
        {
            message: 'Target result userId does not match originating user'
        }
    );
});
