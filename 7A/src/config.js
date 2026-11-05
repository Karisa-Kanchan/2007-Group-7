function parseActivityResourceMap(value) {
  if (!value) return {}

  let mapping
  try {
    mapping = JSON.parse(value)
  } catch {
    throw new Error('ACTIVITY_RESOURCE_MAP must contain valid JSON.')
  }

  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    throw new Error('ACTIVITY_RESOURCE_MAP must be a JSON object.')
  }

  const validated = Object.create(null)

  for (const [resourceId, activityId] of Object.entries(mapping)) {
    if (!resourceId.trim() || typeof activityId !== 'string' || !activityId.trim()) {
      throw new Error('ACTIVITY_RESOURCE_MAP must map resource IDs to non-empty activity IDs.')
    }

    validated[resourceId] = activityId.trim()
  }

  return validated
}

export const config = {
  port: Number(process.env.PORT || 3001),

  brokerMode: process.env.BROKER_MODE || 'stub',

  brokerUrl: process.env.BROKER_URL || 'http://localhost:3000',

  mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ecng2007_p7a',

  activityResourceMap: parseActivityResourceMap(process.env.ACTIVITY_RESOURCE_MAP)
}