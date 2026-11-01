
/**
 * Converts a learning-tool result into the provisional
 * normalised result structure used by Project 7A.
 *
 * This implementation must be reviewed against the
 * final shared Launch/Result Contract.
 */
function normalizeResult(launch, targetResult) {
    if (!launch || typeof launch !== 'object' || Array.isArray(launch)) {
        throw new Error('Invalid launch data');
    }

    if (
        typeof launch.launchId !== 'string' ||
        launch.launchId.trim() === '' ||
        typeof launch.activityId !== 'string' ||
        launch.activityId.trim() === '' ||
        typeof launch.user?.id !== 'string' ||
        launch.user.id.trim() === ''
    ) {
        throw new Error('Missing required launch information');
    }

    if (!targetResult || typeof targetResult !== 'object' || Array.isArray(targetResult)) {
        throw new Error('Invalid target result');
    }

    // Reject a target result belonging to a different launch.
    if (
        targetResult.launchId !== undefined &&
        targetResult.launchId !== launch.launchId
    ) {
        throw new Error(
            'Target result launchId does not match originating launch'
        );
    }

    // Reject a result belonging to a different activity.
    if (
        targetResult.activityId !== undefined &&
        targetResult.activityId !== launch.activityId
    ) {
        throw new Error(
            'Target result activityId does not match originating activity'
        );
    }
    
    // Reject a result belonging to a different user.
    if (
        targetResult.userId !== undefined &&
        targetResult.userId !== launch.user.id
    ) {
        throw new Error(
            'Target result userId does not match originating user'
        );
    }


    const allowedStatuses = ['completed', 'incomplete', 'failed'];

    if (!allowedStatuses.includes(targetResult.status)) {
        throw new Error('Invalid target result status');
    }

    return {
        contractVersion: launch.contractVersion,
        launchId: launch.launchId,
        activityId: launch.activityId,
        userId: launch.user.id,
        status: targetResult.status,
        message: typeof targetResult.message === 'string'
            ? targetResult.message
            : ''
    };
}

module.exports = { normalizeResult };
