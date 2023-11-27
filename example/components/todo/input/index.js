import { html } from '../../../../lib/one'

const TodoInput = {
  name: 'todo-input',
  template: html`
    <div>
      <div>
        <input type="text" />
        <button id="add-btn">Add</button>
      </div>
      <span o-text="error"></span>
    </div>
  `,
  state: {
    text: '',
    error: '',
  },
  setup({ query, state, parent }) {
    const input = query('input')
    const btn = query('#add-btn')
    const error = query('[o-text="error"]')

    const { show, hide } = error.if({ initial: false })

    input.on('input', function () {
      state.text = input.value
    })

    btn.on('click', function () {
      if (state.text === '') {
        state.error = 'Please enter a todo'
        show()

        return
      }

      hide()

      parent.events.add(state.text)

      state.text = ''
      input.value = ''
    })
  },
}

export { TodoInput }