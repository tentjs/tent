import { one, createStore, html } from '../dist/one'
import { SimpleList } from './components'

createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'app',
  components: [SimpleList],
  template: html`
    <div>
      <h1>Hello world</h1>
      <simple-list></simple-list>
    </div>
  `,
})
