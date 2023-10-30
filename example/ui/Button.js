import {e} from '../../dist/else'
import styles from './button.module.css'

/**
 * A Button
 * @param {object} options
 * @param {string} options.text
 * @param {function} options.onclick
 * @param {string} [options.variant=primary]
 * @param {string} [options.className]
 * @param {boolean} [options.disabled=false]
 * @returns void
 */
function Button(options) {
  const {
    text,
    onclick,
    className,
    disabled = false,
    variant = 'primary',
  } = options
  return e('button', text, {
    onclick,
    disabled,
    class: [
      styles.button,
      variant === 'primary' ? styles.primary : styles.secondary,
      className ? className : '',
      disabled ? styles.disabled : '',
    ].join(' '),
  })
}

export {Button}
