import { createStore, html, one } from '../dist/one'
import { Counter, HelloWorld, TodoList } from './components'

createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'app',
  components: [TodoList, Counter, HelloWorld],
  template: html`
    <div>
      <hello-world></hello-world>
      <todo-list></todo-list>
      <counter></counter>
    </div>
  `,
})
