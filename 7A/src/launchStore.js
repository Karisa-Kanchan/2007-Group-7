const launches = new Map()

export function saveLaunch(launch) {
  launches.set(launch.launchId, {
    launch: structuredClone(launch),
    createdAt: new Date().toISOString(),
    trace: ['launch-normalized'],
    results: []
  })
}

export function getLaunch(launchId) {
  const record = launches.get(launchId)
  return record ? structuredClone(record) : null
}

export function saveResult(launchId, result, ltiDelivery) {
  const record = launches.get(launchId)
  if (record) {
    record.results.push(structuredClone({ result, ltiDelivery }))
  }
}

export function addTrace(launchId, message) {
  const record = launches.get(launchId)

  if (record) {
    record.trace.push(message)
  }
}

export function clearLaunches() {
  launches.clear()
}
