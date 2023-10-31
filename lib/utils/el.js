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

export {getChildren}
