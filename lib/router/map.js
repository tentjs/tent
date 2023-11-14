/**
 * @typedef {Object} OnRouteChange
 * @property {Object} context
 * @property {Function} cb
 */

/**
 * Map of `onroutechange` callbacks.
 * @type {Map<String, OnRouteChange>}
 */
const map = new Map()

function getOnRouteChange (key = null) {
  if (!key) {
    return map.entries()
  }

  return map.get(key)
}

function setOnRouteChange ({ key, context, cb }) {
  return map.set(key, { context, cb })
}

function deleteOnRouteChange (key) {
  return map.delete(key)
}

export { getOnRouteChange, setOnRouteChange, deleteOnRouteChange }
