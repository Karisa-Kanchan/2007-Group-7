import fs from 'node:fs/promises'

import {
  runFullFlow
} from '../src/adapter.js'

const text =
  await fs.readFile(
    new URL(
      '../fixtures/valid-lti-launch.json',
      import.meta.url
    ),
    'utf8'
  )

const launch =
  JSON.parse(text)

const result =
  await runFullFlow(launch)

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
)

if (!result.ok) process.exitCode = 1
