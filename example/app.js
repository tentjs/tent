import { one, createStore } from '../dist/one'
import { getItems } from './services/get-items'

createStore(function () {
  return {
    foo: 'bar'
  }
})

one({
  name: 'my-component',
  props: ['msg'],
  state: { msg: 'Initial msg' },
  template: `
    <p o-text="$props.msg">Text</p>
    <p o-text="msg"></p>
    <my-button text="My button"></my-button>
    <button>Click me</button>
  `,
  setup ({ query }) {
    const btn = query('button')

    btn.on('click', function ({ state }) {
      state.msg = 'Hello World #3'
    })
  }
})

one({
  name: 'my-button',
  props: ['text'],
  template: `
    <button o-text="$store.foo"></button>
  `,
  setup ({ query }) {
    const btn = query('button')

    btn.on('click', async function ({ store }) {
      const items = await getItems()

      store.set('foo', items[0].title)
    })
  }
})
