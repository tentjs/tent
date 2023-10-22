/**
 * @param {string} styles
 * @param {Map} cached
 * @returns {object|undefined}
 * @description Get styles from cache
 */
function getStyles(styles, cached) {
  for (const k in cached) {
    const v = cached[k]
    if (v.styles === styles) {
      return v
    }
  }
}

export {getStyles}
