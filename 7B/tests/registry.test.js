
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
