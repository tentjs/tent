import { html } from '../../../../lib/one'

const TodoItem = {
  name: 'todo-item',
  template: html`
    <li>
      <span o-text="text"></span>
      <button>Remove</button>
    </li>
  `,
  setup({ query, state }) {
    const remove = query('button')

    console.log('setup todo-item', state)

    remove.on('click', function ({ state }) {
      console.log('remove', state)
    })
  }
}

export { TodoItem }