import {
  Provider
} from 'ltijs'

import {
  config
} from './config.js'

import {
  rawLaunchFromLtijsContext
} from './normalizeLaunch.js'

import {
  runFullFlow
} from './adapter.js'
import { getLaunch } from './launchStore.js'

export const provider =
  new Provider({
    server: { port: config.port },
    database: {
      url: config.mongoUrl
    }
  })

provider.onResourceLink(
  async (
    context,
    request,
    response
  ) => {
    try {
      const rawLaunch =
        rawLaunchFromLtijsContext(
          context
        )

      const result =
        await runFullFlow(
          rawLaunch
        )

      if (!result.ok) {
        return response.status(result.statusCode).html(`
          <h1>Project 7A Launch Rejected</h1>

          <pre>
${escapeHtml(
  JSON.stringify(
    result,
    null,
    2
  )
)}
          </pre>
        `)
      }

      return response.html(`
        <h1>ECNG2007 Project 7A</h1>

        <p>LTI launch accepted. The shared contract is provisional.</p>
        <p>LTI result return is blocked pending the approved course path. No result was sent.</p>

        <h2>Normalized Launch</h2>

        <pre>
${escapeHtml(
  JSON.stringify(
    result.normalizedLaunch,
    null,
    2
  )
)}
        </pre>

        <h2>Normalized Result</h2>

        <pre>
${escapeHtml(
  JSON.stringify(
    result.normalizedResult,
    null,
    2
  )
)}
        </pre>

        <h2>Local association evidence</h2>
        <pre>${escapeHtml(JSON.stringify(getLaunch(result.normalizedLaunch.launchId), null, 2))}</pre>
      `)
    } catch {
      return response.status(502).html(`
        <h1>Project 7A Error</h1>

        <pre>
The local broker flow failed. Check the configured broker and local trace.
        </pre>
      `)
    }
  }
)

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

if (import.meta.main) {
  console.log(
    'Starting Project 7A ltijs provider...'
  )

  console.log(
    'Platform registration and approved fixtures are required for a course launch.'
  )

  await provider.listen()
}
