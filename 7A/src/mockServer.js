import express from 'express'

import { config } from './config.js'

import {
  acceptLaunch,
  runFullFlow
} from './adapter.js'

import {
  processResult
} from './resultService.js'

import {
  getLaunch
} from './launchStore.js'

export const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    project:
      'ECNG2007 Project 7A',

    component:
      'LTI Protocol Adapter',

    mode:
      'mock/development'
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    component: '7A',
    brokerMode:
      config.brokerMode
  })
})

app.post('/dev/launch', (req, res) => {
  const result =
    acceptLaunch(req.body)

  res
    .status(result.statusCode)
    .json(result)
})

app.post('/dev/demo', async (req, res) => {
  try {
    const result =
      await runFullFlow(req.body)

    res
      .status(result.statusCode)
      .json(result)
  } catch (error) {
    res.status(502).json({
      ok: false,
      error: 'BROKER_ERROR',
      details: [
        error.message
      ]
    })
  }
})

app.post('/api/results', (req, res) => {
  const result =
    processResult(req.body)

  res
    .status(result.statusCode)
    .json(result)
})

app.get('/trace/:launchId', (req, res) => {
  const record =
    getLaunch(req.params.launchId)

  if (!record) {
    return res
      .status(404)
      .json({
        error:
          'Launch not found.'
      })
  }

  return res.json(record)
})

app.use((req, res) => {
  res
    .status(404)
    .json({
      error:
        'Route not found.'
    })
})

// This unauthenticated JSON harness is local development only.
if (import.meta.main) app.listen(
  config.port,
  '127.0.0.1',
  () => {
    console.log(
      `Project 7A running at http://localhost:${config.port}`
    )

    console.log(
      `Broker mode: ${config.brokerMode}`
    )
  }
)
