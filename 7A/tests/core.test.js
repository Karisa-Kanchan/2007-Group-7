import test from 'node:test'
import assert from 'node:assert/strict'
import { config } from '../src/config.js'

import {
  acceptLaunch,
  runFullFlow
} from '../src/adapter.js'

import {
  normalizeLaunch
} from '../src/normalizeLaunch.js'

import {
  clearLaunches,
  saveLaunch
} from '../src/launchStore.js'

import {
  processResult
} from '../src/resultService.js'

const validLaunch = {
  iss:
    'https://platform.example',

  sub:
    'student-1',

  name:
    'Student One',

  context: {
    id: 'course-1',
    label: 'ECNG2007'
  },

  resourceLink: {
    id: 'resource-1',
    title: 'Demo'
  },

  custom: {
    activity_id:
      'activity-1'
  }
}

test.beforeEach(() => {
  clearLaunches()
})

test(
  'normalizes a valid launch',
  () => {
    const result =
      normalizeLaunch(validLaunch)

    assert.equal(
      result.user.id,
      'student-1'
    )

    assert.equal(
      result.activityId,
      'activity-1'
    )

    assert.ok(result.launchId)
  }
)

test(
  'rejects launch without user id',
  () => {
    assert.throws(
      () =>
        normalizeLaunch({
          resourceLink: {
            id: 'resource-1'
          }
        }),
      /user identifier/
    )
  }
)

test(
  'rejects launch without resource link',
  () => {
    assert.throws(
      () =>
        normalizeLaunch({
          sub: 'student-1'
        }),
      /resource link identifier/
    )
  }
)

test(
  'accepts valid launch',
  () => {
    const result =
      acceptLaunch(validLaunch)

    assert.equal(
      result.ok,
      true
    )
  }
)

test(
  'rejects unknown result launch',
  () => {
    const result =
      processResult({
        contractVersion:
          'provisional-0',

        launchId:
          'missing',

        activityId:
          'activity-1',

        status:
          'completed'
      })

    assert.equal(
      result.error,
      'UNKNOWN_LAUNCH'
    )
  }
)

test(
  'rejects result for wrong activity',
  () => {
    saveLaunch({
      contractVersion:
        'provisional-0',

      launchId:
        'launch-1',

      activityId:
        'activity-1',

      user: {
        id: 'student-1'
      }
    })

    const result =
      processResult({
        contractVersion:
          'provisional-0',

        launchId:
          'launch-1',

        activityId:
          'wrong-activity',

        status:
          'completed'
      })

    assert.equal(
      result.error,
      'ACTIVITY_MISMATCH'
    )
  }
)

test(
  'runs the local 7A to fake 7B to 7A flow with LTI delivery blocked',
  async t => {
    const previousMode = config.brokerMode
    t.after(() => { config.brokerMode = previousMode })
    config.brokerMode = 'stub'

    const result =
      await runFullFlow(validLaunch)

    assert.equal(
      result.ok,
      true
    )

    assert.equal(
      result.normalizedResult.status,
      'completed'
    )

    assert.equal(
      result.ltiDelivery.status,
      'blocked'
    )
  }
)
