/**
 * @typedef {Object} Cache
 * @property {Object} context
 * @property {Function} cb
 */

/**
 * Cache for storing router callbacks.
 * @type {Map<String, Cache>}
 */
const cache = new Map()

export {cache}
