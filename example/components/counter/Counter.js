import { html } from '../../../lib/one'

const Counter = {
  name: 'counter',
  template: html`
    <div>
      <button id="dec">-</button>
      <span o-text="count"></span>
      <button id="inc">+</button>
    </div>
  `,
  state: {
    count: 0,
  },
  setup({ query }) {
    query('#dec').on('click', ({ state }) => state.count--)
    query('#inc').on('click', ({ state }) => state.count++)
  }
}

export { Counter }
