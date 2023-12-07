import { div, p, button, classNames } from '../lib/one'
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
    Button('Dec', () => state.count--),
    Button('Inc', () => state.count++),
  ])
}

function Button(text, onclick) {
  return button(text, { onclick, className: styles.button })
}

const state = { count: 0 }

const Counter = {
  selector: '.counter',
  state,
  view,
}

export { Counter }
