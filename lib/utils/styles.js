/**
 * @param {object} styles
 * @returns {string|undefined}
 */
function stylesToString(styles) {
  return JSON.stringify(styles)
}

/**
 * @param {string} styles
 * @param {Map} cached
 * @returns {object|undefined}
 */
function getStyles(styles, cached) {
  for (const k in cached) {
    const v = cached[k]
    if (v.styles === styles) {
      return v
    }
  }
}

export {stylesToString, getStyles}
