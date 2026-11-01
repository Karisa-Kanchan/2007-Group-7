
const express = require('express');
const { findActivity, getAllActivities } = require('./registry');
const { dispatchActivity } = require('./broker');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Check whether the server is running.
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'P7B Activity Registry & Target Broker'
    });
});

// Retrieve all registered activities.
app.get('/activities', (req, res) => {
    res.status(200).json({
        activities: getAllActivities()
    });
});

// Retrieve a specific registered activity.
app.get('/activities/:activityId', (req, res) => {
    const activity = findActivity(req.params.activityId);

    if (!activity) {
        return res.status(404).json({
            error: 'Activity not found'
        });
    }

    res.status(200).json(activity);
});

 // Provisional launch interface for Project 7A.
 // The shared Launch/Result Contract is awaiting team approval.
app.post('/launch', async (req, res) => {
    const launch = req.body;

    // Check for a valid launch object and activity identifier.
    if (
        !launch ||
        typeof launch !== 'object' ||
        Array.isArray(launch) ||
        typeof launch.activityId !== 'string' ||
        launch.activityId.trim() === ''
    ) {
        return res.status(400).json({
            error: 'Invalid launch: activityId is required'
        });
    }

    // Resolve the requested activity.
    const activity = findActivity(launch.activityId);

    if (!activity) {
        return res.status(404).json({
            error: 'Activity not found'
        });
    }

    try {
        // Dispatch the launch to its configured target.
        const result = await dispatchActivity(
            launch.activityId,
            launch
        );

        // Return the target's provisional response.
        return res.status(200).json(result);
    } catch (error) {
        console.error('Launch dispatch failed:', error.message);

        return res.status(502).json({
            error: 'Target dispatch failed'
        });
    }
});

// Start the server.
app.listen(PORT, () => {
    console.log(`P7B server running at http://localhost:${PORT}`);
});

