
/**
 * Validates incoming normalised launches from Project 7A.
 *
 * Enforces the shared Launch/Result Interface Contract v0.0.1.
 * The supported wire version remains provisional-0.
 */

const PROVISIONAL_VERSION = 'provisional-0';

function hasText(value) {
    return typeof value === 'string' &&
        value.trim().length > 0;
}

function validateLaunch(launch) {
    const errors = [];

    if (
        !launch ||
        typeof launch !== 'object' ||
        Array.isArray(launch)
    ) {
        return {
            valid: false,
            errors: ['Launch must be an object.']
        };
    }

    if (launch.contractVersion !== PROVISIONAL_VERSION) {
        errors.push('contractVersion must be provisional-0.');
    }

    if (!hasText(launch.launchId)) {
        errors.push('launchId is required.');
    }

    if (!hasText(launch.activityId)) {
        errors.push('activityId is required.');
    }

    if (!hasText(launch.user?.id)) {
        errors.push('user.id is required.');
    }

    // user.name is optional, but must be a string or null when supplied.
    if (
        launch.user &&
        typeof launch.user === 'object' &&
        !Array.isArray(launch.user) &&
        launch.user.name !== undefined &&
        launch.user.name !== null &&
        typeof launch.user.name !== 'string'
    ) {
        errors.push('user.name must be a string or null when supplied.');
    }

    if (!hasText(launch.resource?.id)) {
        errors.push('resource.id is required.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { validateLaunch };
