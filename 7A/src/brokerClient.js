import { config } from './config.js'
import { createStubResult } from './contract.js'
import { addTrace } from './launchStore.js'

// POST /launch and synchronous JSON replies are provisional local transport.
export async function sendToBroker(launch) {
  if (config.brokerMode === 'stub') {
    addTrace(launch.launchId, 'launch-consumed-by-local-stub')
    return createStubResult(launch)
  }

  if (config.brokerMode !== 'http') {
    throw new Error(`Unsupported BROKER_MODE: ${config.brokerMode}`)
  }

  addTrace(launch.launchId, 'broker-request-started')
  try {
    const response = await fetch(`${config.brokerUrl.replace(/\/$/, '')}/launch`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(launch)
    })
    if (!response.ok) {
      throw new Error(`Project 7B returned HTTP ${response.status}.`)
    }
    const result = await response.json()
    addTrace(launch.launchId, 'broker-response-received')
    return result
  } catch (error) {
    addTrace(launch.launchId, 'broker-request-failed')
    throw error
  }
}
