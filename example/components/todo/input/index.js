import { html } from '../../../../lib/one'

const TodoInput = {
  name: 'todo-input',
  template: html`
    <div>
      <input type="text" />
      <button id="add-btn">Add</button>
    </div>
  `,
  state: {
    text: '',
  },
  setup({ query, state, parent }) {
    const input = query('input')
    const btn = query('#add-btn')

    input.on('input', function () {
      state.text = input.value
    })

    btn.on('click', function () {
      parent.events.add(state.text)
      state.text = ''
    })
  },
}

export { TodoInput }