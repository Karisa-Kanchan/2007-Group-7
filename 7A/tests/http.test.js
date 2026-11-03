
// Local transport regression tests. The endpoints/status codes are provisional.
import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import express from 'express'
import { app } from '../src/mockServer.js'
import { config } from '../src/config.js'
import { createStubResult } from '../src/contract.js'
import { clearLaunches } from '../src/launchStore.js'

const launch = { sub: 'student-1', resourceLink: { id: 'resource-1' }, custom: { activity_id: 'activity-1' } }

async function listen(app, t) {
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  return `http://127.0.0.1:${server.address().port}`
}

async function post(base, path, body) {
  const response = await fetch(base + path, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  })
  return { status: response.status, body: await response.json() }
}

test('local HTTP harness exposes launch, accepts a correlated result, and records blocked delivery', async t => {
  clearLaunches()
  const base = await listen(app, t)
  assert.equal((await (await fetch(base + '/health')).json()).status, 'ok')
  const accepted = await post(base, '/dev/launch', launch)
  assert.equal(accepted.status, 200)
  const normalized = accepted.body.normalizedLaunch
  const received = await post(base, '/api/results', createStubResult(normalized))
  assert.equal(received.status, 200)
  assert.equal(received.body.ltiDelivery.status, 'blocked')
  const trace = await (await fetch(base + '/trace/' + normalized.launchId)).json()
  assert.equal(trace.results[0].result.launchId, normalized.launchId)
  assert.equal((await post(base, '/dev/launch', {})).status, 400)
  assert.equal((await fetch(base + '/trace/missing')).status, 404)
})

test('HTTP broker consumes the normalized launch; failures and swapped replies are not successful results', async t => {
  clearLaunches()
  const previous = { brokerMode: config.brokerMode, brokerUrl: config.brokerUrl }
  t.after(() => Object.assign(config, previous))
  let mode = 'success'
  let received
  let previousResult
  const broker = express()
  broker.use(express.json())
  broker.post('/launch', (req, res) => {
    received = req.body
    if (mode === 'failure') return res.sendStatus(503)
    if (mode === 'bad-json') return res.send('not json')
    if (mode === 'swapped') return res.json(previousResult)
    previousResult = createStubResult(received)
    res.json(previousResult)
  })
  config.brokerMode = 'http'
  config.brokerUrl = await listen(broker, t)
  const base = await listen(app, t)
  const success = await post(base, '/dev/demo', launch)
  assert.equal(success.status, 200)
  assert.deepEqual(received, success.body.normalizedLaunch)
  assert.equal(success.body.ltiDelivery.status, 'blocked')
  for (const failure of ['failure', 'bad-json']) {
    mode = failure
    assert.equal((await post(base, '/dev/demo', launch)).status, 502)
    const trace = await (await fetch(base + '/trace/' + received.launchId)).json()
    assert.equal(trace.results.length, 0)
    assert.ok(trace.trace.includes('broker-request-failed'))
  }
  mode = 'swapped'
  const swapped = await post(base, '/dev/demo', launch)
  assert.equal(swapped.status, 409)
  assert.equal(swapped.body.error, 'LAUNCH_MISMATCH')
})

test('HTTP launch uses configured fallback and rejects missing mappings', async t => {
  clearLaunches()
  const old = config.activityResourceMap
  t.after(() => { config.activityResourceMap = old })
  const base = await listen(app, t)
  const noCustom = { ...launch, custom: {} }

  config.activityResourceMap = { 'resource-1': 'digital-logic-lesson' }
  const mapped = await post(base, '/dev/launch', noCustom)
  assert.equal(mapped.status, 200)
  assert.equal(mapped.body.normalizedLaunch.activityId, 'digital-logic-lesson')
  assert.equal(mapped.body.normalizedLaunch.resource.id, 'resource-1')

  config.activityResourceMap = {}
  const rejected = await post(base, '/dev/launch', noCustom)
  assert.equal(rejected.status, 400)
  assert.equal(rejected.body.error, 'INVALID_OR_UNSUPPORTED_LAUNCH')
})
