function replaceWith(el, target) {
  el.replaceWith(target)
  traverse(el, cleanup)
}

function remove(el) {
  el.remove()
  traverse(el, cleanup)
}

function cleanup(el) {
  if (el.attributes) {
    for (const attr of el.attributes) {
      if (attr.name.startsWith('l-')) {
        document.head.querySelector(`#${attr.name}`)?.remove()
      }
      if (attr.name.startsWith('on')) {
        el[attr.name] = null
      }
    }
  }
}

function traverse(el, cb) {
  const {children} = el
  cb(el)
  if (children?.length) {
    for (const c of children) {
      traverse(c, cb)
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

export {replaceWith, remove, uuid}
