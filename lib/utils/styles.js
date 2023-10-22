/**
 * @param {string} styles
 * @param {Map<string, string>} cached
 * @returns {object|undefined}
 * @description Get styles from cache
 */
function getStyles(styles, cached) {
  for (const [k, v] of cached) {
    if (v === styles) {
      return k
    }
  }
}

export {getStyles}
