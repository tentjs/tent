import { html } from '../../../../lib/one'

const TodoItem = {
  name: 'todo-item',
  template: html`
    <li>
      <span o-text="text"></span>
      <button>Remove</button>
    </li>
  `,
  setup({ query, state, parent }) {
    const remove = query('button')

    remove.on('click', function () {
      parent.events.delete(state.id)
    })
  }
}

export { TodoItem }