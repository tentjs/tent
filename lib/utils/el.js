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

export {getChildren}
