
const test = require('node:test');
const assert = require('node:assert/strict');

const {
    findActivity,
    getAllActivities
} = require('../registry');

test('finds a registered Digital Tutor activity', () => {
    const activity = findActivity('digital-logic-lesson');

    assert.ok(activity);
    assert.equal(activity.id, 'digital-logic-lesson');
    assert.equal(activity.targetType, 'digital-tutor');
});

test('finds a registered Web VHDL Lab activity', () => {
    const activity = findActivity('vhdl-simulation');

    assert.ok(activity);
    assert.equal(activity.id, 'vhdl-simulation');
    assert.equal(activity.targetType, 'web-vhdl-lab');
});

test('returns null for an unknown activity', () => {
    const activity = findActivity('unknown-activity');

    assert.equal(activity, null);
});

test('returns all configured activities', () => {
    const activities = getAllActivities();

    assert.ok(Array.isArray(activities));
    assert.ok(activities.length >= 2);

    const targetTypes = activities.map(activity => activity.targetType);

    assert.ok(targetTypes.includes('digital-tutor'));
    assert.ok(targetTypes.includes('web-vhdl-lab'));
});

const { validateRegistry } = require('../registry');

const validActivity = {
    id: 'test-activity',
    targetType: 'digital-tutor',
    targetUrl: 'http://localhost:4001'
};

test('accepts a valid activity registry', () => {
    assert.equal(validateRegistry([validActivity]), true);
});

test('rejects a registry that is not an array', () => {
    assert.throws(
        () => validateRegistry(null),
        /Activity registry must be an array/
    );
});

test('rejects an activity without an ID', () => {
    assert.throws(
        () => validateRegistry([{ ...validActivity, id: '' }]),
        /Missing activity ID/
    );
});

test('rejects duplicate activity IDs', () => {
    assert.throws(
        () => validateRegistry([validActivity, { ...validActivity }]),
        /Duplicate activity ID/
    );
});

test('rejects an unsupported target type', () => {
    assert.throws(
        () => validateRegistry([
            { ...validActivity, targetType: 'unknown-tool' }
        ]),
        /Unsupported target type/
    );
});

test('rejects a malformed target URL', () => {
    assert.throws(
        () => validateRegistry([
            { ...validActivity, targetUrl: 'not-a-url' }
        ]),
        /Invalid target URL/
    );
});

test('rejects an unsupported URL protocol', () => {
    assert.throws(
        () => validateRegistry([
            { ...validActivity, targetUrl: 'ftp://localhost:4001' }
        ]),
        /Unsupported target URL protocol/
    );
});

test('rejects a non-object activity entry', () => {
    assert.throws(
        () => validateRegistry([null]),
        /Invalid activity/
    );
});
