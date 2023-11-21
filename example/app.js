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

const List = {
  name: 'my-list',
  props: ['items', 'msg'],
  state: { items: [], msg: 'List msg' },
  template: html`
    <ul>
      <li o-text="msg"></li>
    </ul>
  `,
  setup ({ parent, state }) {
    state.items = parent.state.items
    state.msg = state.items[0].title
  }
}

one({
  name: 'my-component',
  components: [Test, List],
  props: ['msg', 'variant'],
  state: {
    msg: 'Initial msg',
    items: [{ id: 1, title: 'List item #1' }]
  },
  template: html`
    <div>
      <p o-text="$props.msg">Text</p>
      <p o-text="msg"></p>
      <my-button text="My button"></my-button>
      <button id="change-msg">Click me</button>
      <my-list></my-list>
    </div>
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
