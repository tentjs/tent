/**
 * @param {HTMLElement|Function} child
 * @param {Object.<string, any>} context
 * @param {boolean} toArray
 * @returns {HTMLElement|Array.<HTMLElement>|String}
 */
function getChildren(child, context, toArray = false) {
  if (child == null) {
    return ''
  }

  const type = typeof child
  if (type === 'function') {
    return child({context})
  }

  if (toArray) {
    return type === 'string' || child instanceof HTMLElement
      ? [child]
      : Array.from(child)
  }

  return child
}

/**
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 * @returns {void}
 */
function replaceWith(a, b) {
  clearEvents(a)
  a.replaceWith(b)
}

/**
 * @param {HTMLElement} el
 * @returns {void}
 */
function remove(el) {
  clearEvents(el)
  el.remove()
}

/**
 * @param {HTMLElement} el
 * @returns {void}
 */
function clearEvents(el) {
  for (const prop in el) {
    if (prop.startsWith('on')) {
      el[prop] = null
    }
  }
  if (el.children.length) {
    for (const c of el.children) {
      clearEvents(c)
    }
  }
}

export {getChildren, remove, replaceWith}
