
const express = require('express');

const app = express();
const PORT = 4001;

app.use(express.json());

// Simulate receiving an activity launch.
app.post('/launch', (req, res) => {
    console.log('Digital Tutor received:', req.body);

    res.status(200).json({
        launchId: req.body.launchId,
        activityId: req.body.activityId,
        userId: req.body.user?.id,
        status: 'completed',
        message: 'Digital Tutor activity completed successfully'
    });
});

app.listen(PORT, () => {
    console.log(`Digital Tutor running at http://localhost:${PORT}`);
});
