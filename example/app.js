import { mount, button, p, div, classNames } from '../lib/one'
import styles from './styles.module.css'

function view({ state }) {
  return div([
    p(`Count: ${state.count}`, {
      className: classNames(
        styles.paragraph,
        state.count < 0 && styles.low,
        state.count > 3 && styles.high,
      ),
    }),
    button('Dec', { onclick() { state.count-- }, className: styles.button }),
    button('Inc', { onclick() { state.count++ }, className: styles.button }),
  ])
}

const state = { count: 0 }

document.querySelectorAll('.counter').forEach(el => {
  mount({ el, view, state })
})

