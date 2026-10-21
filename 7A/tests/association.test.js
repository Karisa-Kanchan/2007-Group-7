// Developer regression tests using synthetic data, not SYS-7A execution.
import test from 'node:test'
import assert from 'node:assert/strict'
import { acceptLaunch } from '../src/adapter.js'
import { normalizeLaunch, rawLaunchFromLtijsContext } from '../src/normalizeLaunch.js'
import { PROVISIONAL_VERSION, createStubResult, validateResult } from '../src/contract.js'
import { clearLaunches, getLaunch } from '../src/launchStore.js'
import { processResult } from '../src/resultService.js'

// Shape taken from installed ltijs 7.0.7 IdToken types. Values are local examples.
const context = {
  idToken: {
    id: 'local-token-id',
    ltiVersion: '1.3.0',
    user: { id: 'student-1', name: 'Student One', roles: ['Learner'] },
    platform: { id: 'local-platform', url: 'https://platform.example', clientId: 'local-client', deploymentId: 'local-deployment' },
    launch: {
      type: 'LtiResourceLinkRequest',
      context: { id: 'course-1', label: 'ECNG2007', title: 'Course' },
      resource: { id: 'resource-1', title: 'Activity' },
      custom: { activity_id: 'activity-1' }
    }
  }
}

function newLaunch() {
  return acceptLaunch(rawLaunchFromLtijsContext(context)).normalizedLaunch
}

test.beforeEach(clearLaunches)

test('maps the ltijs v7 user, platform and launch fields', () => {
  const launch = newLaunch()
  assert.equal(launch.user.id, 'student-1')
  assert.equal(launch.user.name, 'Student One')
  assert.equal(launch.lti.issuer, 'https://platform.example')
  assert.deepEqual(launch.lti.roles, ['Learner'])
  assert.deepEqual(launch.course, context.idToken.launch.context)
  assert.deepEqual(launch.resource, context.idToken.launch.resource)
  assert.equal(launch.activityId, 'activity-1')
  assert.equal(launch.contractVersion, PROVISIONAL_VERSION)
})

test('minimal local launch falls back to resource and serializes absent optional values as null', () => {
  const launch = normalizeLaunch({ sub: 'student-1', resourceLink: { id: 'resource-1' } })
  assert.equal(launch.activityId, 'resource-1')
  assert.deepEqual(JSON.parse(JSON.stringify(launch.course)), { id: null, label: null, title: null })
  assert.equal(launch.user.name, null)
  assert.equal(launch.resource.title, null)
  assert.equal(launch.lti.issuer, null)
})

test('rejects malformed identifiers and missing v7 context', () => {
  for (const raw of [null, [], {}, { sub: 123, resourceLink: { id: 'r' } },
    { sub: 's', resourceLink: { id: {} }, custom: { activity_id: 'a' } },
    rawLaunchFromLtijsContext({})]) {
    assert.equal(acceptLaunch(raw).ok, false)
  }
})

test('accepts local statuses but rejects malformed and unsupported provisional results', () => {
  const result = createStubResult(newLaunch())
  for (const status of ['completed', 'incomplete', 'failed']) {
    assert.equal(validateResult({ ...result, status }).valid, true)
  }
  for (const invalid of [null, [], {}, { ...result, contractVersion: 'v1' },
    { ...result, status: 'passed' }, { ...result, userId: 7 }, { ...result, message: {} }]) {
    assert.equal(processResult(invalid).ok, false)
  }
})

test('rejects a result for another user and stores no accepted result', () => {
  const launch = newLaunch()
  assert.equal(processResult({ ...createStubResult(launch), userId: 'another-student' }).error, 'USER_MISMATCH')
  assert.equal(getLaunch(launch.launchId).results.length, 0)
})

test('keeps separate launches of the same activity distinct, even with results returned out of order', () => {
  const first = newLaunch()
  const second = newLaunch()
  assert.notEqual(first.launchId, second.launchId)
  assert.equal(processResult(createStubResult(second), first.launchId).error, 'LAUNCH_MISMATCH')
  assert.equal(getLaunch(second.launchId).results.length, 0)
  for (const launch of [second, first]) {
    const result = createStubResult(launch)
    const response = processResult(result)
    assert.equal(response.ok, true)
    assert.equal(response.ltiDelivery.status, 'blocked')
    assert.equal('ltiFacingResult' in response, false)
    const record = getLaunch(launch.launchId)
    assert.deepEqual(record.results[0].result, result)
    assert.equal(record.trace.includes('result-translated'), false)
    assert.ok(record.trace.includes('lti-result-path-blocked'))
  }
})

test('optional userId does not lose association with stored launch; evidence cannot be mutated by callers', () => {
  const launch = newLaunch()
  const result = createStubResult(launch)
  delete result.userId
  assert.equal(processResult(result).ok, true)
  result.activityId = 'mutated'
  launch.user.id = 'mutated'
  const record = getLaunch(launch.launchId)
  assert.equal(record.launch.user.id, 'student-1')
  assert.equal(record.results[0].result.activityId, 'activity-1')
  record.trace.push('invented')
  assert.equal(getLaunch(launch.launchId).trace.includes('invented'), false)
})
