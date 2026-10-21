import {
  normalizeLaunch
} from './normalizeLaunch.js'

import {
  validateLaunch
} from './contract.js'

import {
  addTrace,
  saveLaunch
} from './launchStore.js'

import {
  sendToBroker
} from './brokerClient.js'

import {
  processResult
} from './resultService.js'

export function acceptLaunch(rawLaunch) {
  let normalizedLaunch

  try {
    normalizedLaunch =
      normalizeLaunch(rawLaunch)
  } catch (error) {
    return {
      ok: false,
      statusCode: 400,
      error:
        'INVALID_OR_UNSUPPORTED_LAUNCH',
      details: [
        error.message
      ]
    }
  }

  const validation =
    validateLaunch(normalizedLaunch)

  if (!validation.valid) {
    return {
      ok: false,
      statusCode: 400,
      error:
        'NORMALIZATION_FAILED',
      details:
        validation.errors
    }
  }

  saveLaunch(normalizedLaunch)

  addTrace(
    normalizedLaunch.launchId,
    'launch-accepted'
  )

  return {
    ok: true,
    statusCode: 200,
    normalizedLaunch
  }
}

export async function runFullFlow(rawLaunch) {
  const launchResult =
    acceptLaunch(rawLaunch)

  if (!launchResult.ok) {
    return launchResult
  }

  const normalizedResult =
    await sendToBroker(
      launchResult.normalizedLaunch
    )

  const resultResult =
    processResult(normalizedResult, launchResult.normalizedLaunch.launchId)

  if (!resultResult.ok) {
    return resultResult
  }

  return {
    ok: true,
    statusCode: 200,

    normalizedLaunch:
      launchResult.normalizedLaunch,

    normalizedResult,

    ltiDelivery:
      resultResult.ltiDelivery
  }
}
