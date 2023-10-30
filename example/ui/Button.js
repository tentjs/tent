import {e} from '../../dist/else'
import styles from './button.module.css'

/**
 * A Button
 * @param {object} options
 * @param {string} options.text
 * @param {function} options.onclick
 * @param {string} [options.variant=primary]
 * @param {string} [options.className]
 * @returns void
 */
function Button(options) {
  const {text, onclick, className, variant = 'primary'} = options
  return e('button', text, {
    onclick,
    class: [
      styles.button,
      variant === 'primary' ? styles.primary : '',
      className ? className : '',
    ].join(' ')
  })
}

export {Button}
