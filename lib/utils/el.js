function replaceWith(el, target) {
  cleanup(el)
  el.replaceWith(target)
}

function remove(el) {
  cleanup(el)
  el.remove()
}

function cleanup(el) {
  const {children} = el
  if (el.attributes) {
    for (const attr of el.attributes) {
      if (attr.name.startsWith('on')) {
        el[attr.name] = null
      }
    }
  }
  if (children?.length) {
    for (const c of children) {
      cleanup(c)
    }
  }
}

export {replaceWith, remove}
