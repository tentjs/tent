import { one, createStore, html } from '../dist/one'
import { getItems } from './services/get-items'

createStore(function () {
  return {
    foo: 'bar'
  }
})

const Test = {
  name: 'my-button',
  props: ['text'],
  template: html`
    <button o-text="$store.foo"></button>
  `,
  setup ({ query }) {
    const btn = query('button')

    btn.on('click', async function ({ store }) {
      const items = await getItems()

      store.set('foo', items[0].title)
    })
  }
}

one({
  name: 'my-component',
  components: [Test],
  props: ['msg', 'variant'],
  state: { msg: 'Initial msg' },
  template: html`
    <p o-text="$props.msg">Text</p>
    <p o-text="msg"></p>
    <my-button text="My button"></my-button>
    <button id="change-msg">Click me</button>
  `,
  setup ({ query, state, props }) {
    const btn = query('#change-msg')

    state.msg = props.variant === 'sec'
      ? 'Hello World #1'
      : 'Hello World #2'

    btn.on('click', function ({ state }) {
      state.msg = 'Hello World #3'
    })
  }
})
