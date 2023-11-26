import { one, createStore, html } from '../dist/one'
import { TodoList } from './components/todo/list'

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
      <h1>Hello world</h1>
      <todo-list></todo-list>
    </div>
  `,
})
