function createUUID(uuids = []) {
  const uuid = Math.random().toString(36).substring(2, 15)
  if (uuids.includes(uuid)) {
    return createUUID(uuids)
  }
  uuids.push(uuid)
  return uuid
}

function getUUID(el) {
  if (el?.attributes) {
    for (const attr of el.attributes) {
      if (attr.name.startsWith('l-')) {
        return attr.name
      }
    }
  }
}

export {createUUID, getUUID}
