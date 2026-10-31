
const { findActivity } = require('./registry');

// Dispatch an activity launch to its registered target.
async function dispatchActivity(activityId, launchData) {
    const activity = findActivity(activityId);

    if (!activity) {
        throw new Error(`Activity not registered: ${activityId}`);
    }

    const targetUrl = `${activity.targetUrl}/launch`;

    const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(launchData)
    });

    if (!response.ok) {
        throw new Error(
            `Target returned HTTP ${response.status}`
        );
    }

    return await response.json();
}

module.exports = {
    dispatchActivity
};
