import { readFile } from 'node:fs/promises'
import { Provider } from 'ltijs'
import { config } from '../src/config.js'

// These are ltijs registration settings, not Learning Tool Contract v1 fields.
const file = process.env.LTI_PLATFORM_FILE
if (!file) {
  console.error('Set LTI_PLATFORM_FILE to a local JSON file containing staff-supplied registration settings.')
  process.exitCode = 1
} else {
  const provider = new Provider({ database: { url: config.mongoUrl } })
  try {
    const settings = JSON.parse(await readFile(file, 'utf8'))
    await provider.databaseManager.listen()
    const existing = await provider.platformManager.getPlatformByUrlAndClientId(
      settings.url, settings.clientId
    )
    if (existing) {
      await provider.platformManager.updatePlatform(existing, { ...settings, active: existing.active })
      console.log('Existing platform registration updated; activation state preserved.')
    } else {
      await provider.platformManager.registerPlatform(settings)
      console.log('Platform registered with ltijs.')
    }
  } catch {
    console.error('Registration failed. Check the local file, ltijs registration format, and MongoDB connectivity. Settings and keys are not printed.')
    process.exitCode = 1
  } finally {
    await provider.databaseManager.close()
  }
}
