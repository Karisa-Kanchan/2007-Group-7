
const { activities } = require('./config/activities.json');

// Find an activity in the registry using its ID.
function findActivity(activityId) {
    return activities.find(
        activity => activity.id === activityId
    ) || null;
}

// Return all registered activities.
function getAllActivities() {
    return activities;
}

module.exports = {
    findActivity,
    getAllActivities
};
