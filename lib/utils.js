import {cache} from './router'

/**
 * @param {HTMLElement|Function} child
 * @param {Object.<string, any>} context
 * @param {boolean} toArray
 * @returns {HTMLElement|Array.<HTMLElement>|String}
 */
function getChildren(child, context, toArray = false) {
  if (child == null || typeof child === 'boolean') {
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
  cleanup(a)
  a.replaceWith(b)
}

/**
 * @param {HTMLElement} el
 * @returns {void}
 */
function remove(el) {
  cleanup(el)
  el.remove()
}

/**
 * @param {HTMLElement} el
 * @returns {void}
 */
function cleanup(el) {
  for (const prop in el) {
    if (prop.startsWith('on')) {
      el[prop] = null
    }
  }
  if (cache.has(el.$else.id)) {
    cache.delete(el.$else.id)
  }
  if (el.children.length) {
    for (const c of el.children) {
      cleanup(c)
    }
  }
}

/**
 * @type {Set<string>}
 */
const ids = new Set()
/**
 * @returns {string}
 */
function createUniqueId() {
  const id = Math.random().toString(36).slice(2, 8)
  if (ids.has(id)) {
    return createUniqueId()
  }
  ids.add(id)
  return id
}

export {getChildren, remove, replaceWith, createUniqueId}
