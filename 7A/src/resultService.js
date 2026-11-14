import { validateResult } from './contract.js'
import { addTrace, getLaunch, saveResult } from './launchStore.js'

// Local status only. No approved result operation or payload is known.
export function pendingLtiDelivery() {
  return {
    status: 'blocked',
    reason: 'Result successfully validated and associated with the originating launch. Separate result submission to the LMS was not performed.'
  }
}

export function processResult(result, expectedLaunchId) {
  const validation = validateResult(result)
  if (!validation.valid) {
    return {
      ok: false,
      statusCode: 400,
      error: 'INVALID_NORMALIZED_RESULT',
      details: validation.errors
    }
  }

  // An HTTP broker reply must belong to the launch sent in that request.
  if (expectedLaunchId && result.launchId !== expectedLaunchId) {
    addTrace(expectedLaunchId, 'result-rejected-launch-mismatch')
    return {
      ok: false,
      statusCode: 409,
      error: 'LAUNCH_MISMATCH',
      details: ['Broker result does not match the launch sent to it.']
    }
  }

  const record = getLaunch(result.launchId)
  if (!record) {
    return {
      ok: false,
      statusCode: 404,
      error: 'UNKNOWN_LAUNCH',
      details: ['No matching originating launch was found.']
    }
  }

  if (record.launch.activityId !== result.activityId) {
    addTrace(result.launchId, 'result-rejected-activity-mismatch')
    return {
      ok: false,
      statusCode: 409,
      error: 'ACTIVITY_MISMATCH',
      details: ['Result activityId does not match the originating launch.']
    }
  }

  if (result.userId !== undefined && result.userId !== record.launch.user.id) {
    addTrace(result.launchId, 'result-rejected-user-mismatch')
    return {
      ok: false,
      statusCode: 409,
      error: 'USER_MISMATCH',
      details: ['Result userId does not match the originating launch.']
    }
  }

  const ltiDelivery = pendingLtiDelivery()
  saveResult(result.launchId, result, ltiDelivery)
  addTrace(result.launchId, 'result-validated')
  addTrace(result.launchId, 'lti-result-path-blocked')

  // ok means accepted by this local prototype, not delivered to the consumer.
  return {
    ok: true,
    statusCode: 200,
    normalizedResult: result,
    ltiDelivery
  }
}
