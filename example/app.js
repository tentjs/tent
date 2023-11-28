import { createStore, html, one } from '../dist/one'
import { Counter, HelloWorld, Navbar, TodoList } from './components'
import * as styles from './app.module.css'

createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'app',
  components: [
    TodoList,
    Counter,
    HelloWorld,
    Navbar,
  ],
  template: html`
    <div class="${styles.page}">
      <navbar></navbar>
      <main class="${styles.main}">
        <hello-world></hello-world>
        <todo-list></todo-list>
        <counter></counter>
      </main>
    </div>
  `,
})
