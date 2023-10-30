import {e} from '../../dist/else'
import styles from './button.module.css'

function Button(context, options) {
  const {text, onclick} = options
  return e('button', text, {
    onclick,
    class: styles.button,
  })
}

export {Button}
