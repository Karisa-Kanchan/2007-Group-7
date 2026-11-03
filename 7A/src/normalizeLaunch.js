
import { randomUUID } from 'node:crypto'
import { PROVISIONAL_VERSION } from './contract.js'
import { config } from './config.js'

function firstDefined(...values) {
  return values.find(
    value =>
      value !== undefined &&
      value !== null &&
      value !== ''
  ) ?? null
}

export function normalizeLaunch(rawLaunch) {
  if (!rawLaunch || typeof rawLaunch !== 'object' || Array.isArray(rawLaunch)) {
    throw new Error('Launch payload is missing or invalid.')
  }

  const userId = firstDefined(rawLaunch.sub, rawLaunch.user?.id)
  const resourceLinkId = firstDefined(rawLaunch.resourceLink?.id, rawLaunch.resource?.id)

  if (!userId) {
    throw new Error('Launch does not contain a user identifier.')
  }

  if (!resourceLinkId) {
    throw new Error('Launch does not contain a resource link identifier.')
  }

  const context = rawLaunch.context || {}
  const custom = rawLaunch.custom || {}

  if (custom.activity_id != null && typeof custom.activity_id !== 'string') {
    throw new Error('Launch custom activity identifier must be text.')
  }

  const customActivityId =
    typeof custom.activity_id === 'string'
      ? custom.activity_id.trim()
      : ''

  const mappedActivityId =
    typeof resourceLinkId === 'string' &&
    Object.hasOwn(config.activityResourceMap, resourceLinkId)
      ? config.activityResourceMap[resourceLinkId]
      : null

  const activityId = customActivityId || mappedActivityId

  if (!activityId) {
    throw new Error('Launch does not contain an activity identifier or a configured resource mapping.')
  }

  return {
    contractVersion: PROVISIONAL_VERSION,
    launchId: randomUUID(),
    activityId,
    user: {
      id: userId,
      name: firstDefined(rawLaunch.name, rawLaunch.user?.name, null)
    },
    course: {
      id: firstDefined(context.id, null),
      label: firstDefined(context.label, null),
      title: firstDefined(context.title, null)
    },
    resource: {
      id: resourceLinkId,
      title: firstDefined(rawLaunch.resourceLink?.title, rawLaunch.resource?.title, null)
    },
    lti: {
      issuer: firstDefined(rawLaunch.iss, null),
      roles: Array.isArray(rawLaunch.roles) ? rawLaunch.roles : []
    }
  }
}

export function rawLaunchFromLtijsContext(context) {
  // ltijs v7's validated IdToken; this function does not authenticate JSON.
  const token = context?.idToken
  return {
    iss: token?.platform?.url ?? null,
    sub: token?.user?.id ?? null,
    name: token?.user?.name ?? null,
    roles: token?.user?.roles ?? [],
    context: token?.launch?.context ?? {},
    resourceLink: token?.launch?.resource ?? {},
    custom: token?.launch?.custom ?? {}
  }
}
