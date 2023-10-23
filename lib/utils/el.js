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

/**
 * @param {HTMLElement|Function} child
 * @param {Object} data
 * @param {boolean} toArray
 * @returns {HTMLElement|Array|String}
 */
function getChildren(child, data, toArray = false) {
  const type = typeof child
  if (type === 'function') {
    return data != null ? child({data}) : child()
  }

  if (toArray) {
    return type === 'string' || child instanceof HTMLElement
      ? [child]
      : Array.from(child)
  }

  return child
}

export {replaceWith, remove, getChildren}
