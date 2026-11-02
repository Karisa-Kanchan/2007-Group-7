
const { findActivity } = require('./registry');

// Maximum time allowed for a target to respond.
const TARGET_TIMEOUT_MS = 10000;

// Dispatch a launch to the configured learning-tool target.
async function dispatchActivity(activityId, launchData) {
    const activity = findActivity(activityId);

    if (!activity) {
        throw new Error(`Activity not registered: ${activityId}`);
    }

    const response = await fetch(`${activity.targetUrl}/launch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(launchData),

        // Abort the request if the target takes too long.
        signal: AbortSignal.timeout(TARGET_TIMEOUT_MS)
    });

    if (!response.ok) {
        throw new Error(`Target returned HTTP ${response.status}`);
    }

    return response.json();
}

module.exports = { dispatchActivity };
