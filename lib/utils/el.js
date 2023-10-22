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
  for (const prop in el) {
    if (prop.startsWith('on') && typeof el[prop] === 'function') {
      el[prop] = null
    }
  }
  if (children?.length) {
    for (const c of children) {
      cleanup(c)
    }
  }
}

export {replaceWith, remove}
