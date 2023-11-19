import { one, createStore } from '../dist/one'
import { getItems } from './services/get-items'

const store = createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'my-component',
  props: ['msg'],
  template: `
    <p o-text="msg">Text</p>
    <my-button text="My button"></my-button>
    <button>Click me</button>
  `,
  setup ({ query, click }) {
    const btn = query('button')

    click(btn, function ({ state }) {
      state.msg = 'Hello World #2'
    })
  }
})

one({
  store,
  name: 'my-button',
  props: ['text'],
  template: `
    <button o-text="$store.foo"></button>
  `,
  setup ({ click, query }) {
    const btn = query('button')

    click(btn, async function ({ store }) {
      const items = await getItems()

      store.set('foo', items[0].title)
    })
  }
})
