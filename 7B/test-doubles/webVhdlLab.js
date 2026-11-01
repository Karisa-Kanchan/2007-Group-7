
const express = require('express');

const app = express();
const PORT = 4002;

app.use(express.json());

// Simulate receiving a Web VHDL Lab activity launch.
app.post('/launch', (req, res) => {
    console.log('Web VHDL Lab received:', req.body);

   
    res.status(200).json({
        launchId: req.body.launchId,
        activityId: req.body.activityId,
        userId: req.body.user?.id,
        status: 'completed',
        message: 'Web VHDL Lab activity completed successfully'
    });

});

app.listen(PORT, () => {
    console.log(`Web VHDL Lab running at http://localhost:${PORT}`);
});
