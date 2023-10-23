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
 * @returns {HTMLElement|Array}
 */
function getChildren(child, data, toArray = false) {
  const type = typeof child
  if (type === 'function') {
    return data != null ? child({data}) : child()
  } else {
    return toArray && typeof child !== 'string' ? Array.from(child) : child
  }
}

export {replaceWith, remove, getChildren}
