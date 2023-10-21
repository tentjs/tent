function replaceWith(el, target, isFunction = false) {
  if (!isFunction) {
    const uuid = getUUID(el)
    if (uuid) {
      target.setAttribute(uuid, '')
    }
  }
  cleanup(el)
  el.replaceWith(target)
}

function remove(el) {
  cleanup(el, true)
  el.remove()
}

function cleanup(el, remove = false) {
  const {children} = el
  if (el.attributes) {
    for (const attr of el.attributes) {
      if (remove) {
        const uuid = getUUID(el)
        if (uuid) {
          document.head.querySelector(`style#${uuid}`)?.remove()
        }
      }
      if (attr.name.startsWith('on')) {
        el[attr.name] = null
      }
    }
  }
  if (children?.length) {
    for (const c of children) {
      cleanup(c, remove)
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

export {replaceWith, remove, uuid}
