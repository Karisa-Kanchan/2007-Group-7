import { randomUUID } from 'node:crypto'
import { PROVISIONAL_VERSION } from './contract.js'

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
    throw new Error(
      'Launch payload is missing or invalid.'
    )
  }

  const userId = firstDefined(
    rawLaunch.sub,
    rawLaunch.user?.id
  )

  const resourceLinkId = firstDefined(
    rawLaunch.resourceLink?.id,
    rawLaunch.resource?.id
  )

  if (!userId) {
    throw new Error(
      'Launch does not contain a user identifier.'
    )
  }

  if (!resourceLinkId) {
    throw new Error(
      'Launch does not contain a resource link identifier.'
    )
  }

  const context = rawLaunch.context || {}
  const custom = rawLaunch.custom || {}

  const activityId = firstDefined(
    custom.activity_id,
    rawLaunch.activityId,
    resourceLinkId
  )

  return {
    contractVersion: PROVISIONAL_VERSION,

    launchId: randomUUID(),

    activityId,

    user: {
      id: userId,
      name: firstDefined(
        rawLaunch.name,
        rawLaunch.user?.name,
        null
      )
    },

    course: {
      id: firstDefined(context.id, null),
      label: firstDefined(context.label, null),
      title: firstDefined(context.title, null)
    },

    resource: {
      id: resourceLinkId,
      title: firstDefined(
        rawLaunch.resourceLink?.title,
        rawLaunch.resource?.title,
        null
      )
    },

    lti: {
      issuer: firstDefined(
        rawLaunch.iss,
        null
      ),

      roles: Array.isArray(rawLaunch.roles)
        ? rawLaunch.roles
        : []
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
