import { one, createStore, html } from '../dist/one'
import { TodoList } from './components'

createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'app',
  components: [TodoList],
  template: html`
    <div>
      <todo-list></todo-list>
    </div>
  `,
})
