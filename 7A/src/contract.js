// Local prototype only: replace with staff Contract v1 when supplied.
export const PROVISIONAL_VERSION = 'provisional-0'

function hasText(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  )
}

export function validateLaunch(launch) {
  const errors = []

  if (!launch || typeof launch !== 'object' || Array.isArray(launch)) {
    return {
      valid: false,
      errors: ['Launch must be an object.']
    }
  }

  if (launch.contractVersion !== PROVISIONAL_VERSION) {
    errors.push(`contractVersion must be ${PROVISIONAL_VERSION}.`)
  }

  if (!hasText(launch.launchId)) {
    errors.push('launchId is required.')
  }

  if (!hasText(launch.activityId)) {
    errors.push('activityId is required.')
  }

  if (!launch.user || !hasText(launch.user.id)) {
    errors.push('user.id is required.')
  }

  if (!hasText(launch.resource?.id)) {
    errors.push('resource.id is required.')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateResult(result) {
  const errors = []

  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    return {
      valid: false,
      errors: ['Result must be an object.']
    }
  }

  if (result.contractVersion !== PROVISIONAL_VERSION) {
    errors.push(`contractVersion must be ${PROVISIONAL_VERSION}.`)
  }

  if (!hasText(result.launchId)) {
    errors.push('launchId is required.')
  }

  if (!hasText(result.activityId)) {
    errors.push('activityId is required.')
  }

  if (result.userId !== undefined && !hasText(result.userId)) {
    errors.push('userId must be non-empty text when supplied.')
  }

  if (result.message !== undefined && typeof result.message !== 'string') {
    errors.push('message must be text when supplied.')
  }

  const allowedStatuses = [
    'completed',
    'incomplete',
    'failed'
  ]

  if (!allowedStatuses.includes(result.status)) {
    errors.push(
      `status must be one of: ${allowedStatuses.join(', ')}.`
    )
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function createStubResult(launch) {
  return {
    contractVersion: PROVISIONAL_VERSION,
    launchId: launch.launchId,
    activityId: launch.activityId,
    userId: launch.user.id,
    status: 'completed',
    message: 'Completed by the Project 7B test double.'
  }
}
