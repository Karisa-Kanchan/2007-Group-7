
const { activities } = require('./config/activities.json');

const SUPPORTED_TARGET_TYPES = new Set([
    'digital-tutor',
    'web-vhdl-lab'
]);

function validateRegistry(entries) {
    if (!Array.isArray(entries)) {
        throw new Error('Activity registry must be an array.');
    }

    const seenIds = new Set();

    for (const [index, activity] of entries.entries()) {
        if (!activity || typeof activity !== 'object' ||
            Array.isArray(activity)) {
            throw new Error(`Invalid activity at index ${index}.`);
        }

        if (typeof activity.id !== 'string' ||
            !activity.id.trim()) {
            throw new Error(`Missing activity ID at index ${index}.`);
        }

        if (seenIds.has(activity.id)) {
            throw new Error(`Duplicate activity ID: ${activity.id}`);
        }

        seenIds.add(activity.id);

        if (!SUPPORTED_TARGET_TYPES.has(activity.targetType)) {
            throw new Error(
                `Unsupported target type for activity ${activity.id}.`
            );
        }

        if (typeof activity.targetUrl !== 'string') {
            throw new Error(
                `Invalid target URL for activity ${activity.id}.`
            );
        }

        let url;

        try {
            url = new URL(activity.targetUrl);
        } catch {
            throw new Error(
                `Invalid target URL for activity ${activity.id}.`
            );
        }

        if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error(
                `Unsupported target URL protocol for activity ${activity.id}.`
            );
        }
    }

    return true;
}

// Validate configuration immediately when the module loads.
validateRegistry(activities);

function findActivity(activityId) {
    return activities.find(
        activity => activity.id === activityId
    ) || null;
}

function getAllActivities() {
    return activities;
}

module.exports = {
    findActivity,
    getAllActivities,
    validateRegistry
};
