export function replaceWith(el, target) {
  el.replaceWith(target)
  traverse(el, cleanup)
}

export function remove(el) {
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
