
const express = require('express');
const { findActivity, getAllActivities } = require('./registry');

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

// Start the server.
app.listen(PORT, () => {
    console.log(`P7B server running at http://localhost:${PORT}`);
});

