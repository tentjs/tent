import { TodoItem } from '../item'
import { html } from '../../../../lib/one'

const TodoList = {
  name: 'todo-list',
  state: {
    items: [
      { id: 1, text: 'Item #1', done: false },
      { id: 2, text: 'Item #2', done: false },
      { id: 3, text: 'Item #3', done: false },
    ]
  },
  components: [TodoItem],
  template: html`
    <ul>
      <todo-item></todo-item>
    </ul>
  `,
  events: {
    delete(id, { state }) {
      state.items = state.items.filter(item => item.id !== id)
    },
  },
  setup({ query, state }) {
    const item = query('todo-item')

    item.for(['items', 'id'], function ({ el, item }) {
      // console.log('item', item, el)
    })
  }
}

export { TodoList }