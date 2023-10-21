function replaceWith(el, target) {
  el.replaceWith(target)
  traverse(el)
}

function remove(el) {
  el.remove()
  traverse(el)
}

function cleanup(el) {
  if (el.attributes) {
    for (const attr of el.attributes) {
      const uuid = getUUID(el)
      if (uuid) {
        document.head.querySelector(`style#${uuid}`)?.remove()
      }
      if (attr.name.startsWith('on')) {
        el[attr.name] = null
      }
    }
  }
}

function traverse(el) {
  const {children} = el
  cleanup(el)
  if (children?.length) {
    for (const c of children) {
      traverse(c)
    }
  }
}

function uuid(uuids = []) {
  const u = Math.random().toString(36).substring(2, 15)
  if (uuids.includes(u)) {
    return uuid(uuids)
  }
  uuids.push(u)
  return u
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

export {replaceWith, remove, getUUID, uuid}
