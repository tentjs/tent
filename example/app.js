import { one, createStore, html } from '../dist/one'
import { TodoList, Counter } from './components'

createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'app',
  components: [TodoList, Counter],
  template: html`
    <div>
      <todo-list></todo-list>
      <counter></counter>
    </div>
  `,
})
