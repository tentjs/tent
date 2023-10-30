import {e} from '../../dist/else'
import styles from './button.module.css'

/**
 * A Button
 * @param {object} options
 * @param {string} options.text
 * @param {function} options.onclick
 * @returns void
 */
function Button(options) {
  const {text, onclick} = options
  return e('button', text, {
    onclick,
    class: styles.button,
  })
}

export {Button}
