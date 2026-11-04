
/**
 * Validates incoming normalised launches from Project 7A.
 *
 * Uses the provisional-0 format currently implemented by 7A.
 * These rules must be reviewed when the teams approve Contract v1.
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

    if (!hasText(launch.resource?.id)) {
        errors.push('resource.id is required.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { validateLaunch };
