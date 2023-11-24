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
  state: {
    items: [
      { id: 1, title: 'List item #1' }
    ]
  },
  template: html`
    <div>
      <ul>
        <li>
          <span o-text="id"></span>: <span o-text="title"></span>
          <span o-text="$store.foo"></span>
        </li>
      </ul>
      <p>len: <span o-text="len"></span></p>
      <button>Click me</button>
    </div>
  `,
  setup ({ parent, query, computed, state }) {
    computed('len', ({ state }) => state.items.length)

    const li = query('li')
    const btn = query('button')

    btn.on('click', function ({ state }) {
      const id = state.items.length
        ? state.items[state.items.length - 1]?.id + 1
        : 1

      state.items = [...state.items, { id, title: `Foo #${id}` }]
    })

    li.for(['items', 'id'], function ({ el, item }) {
      if (item.id % 2 === 0) {
        el.style.fontWeight = 'bold'
        el.style.color = 'coral'
      }
    })
  }
}

one({
  name: 'my-component',
  components: [Test, List],
  props: ['msg', 'variant'],
  state: {
    msg: 'Initial msg',
    items: [
      { id: 1, title: 'List item #1' },
      { id: 2, title: 'List item #2' },
      { id: 3, title: 'List item #3' },
      { id: 4, title: 'List item #4' },
      { id: 5, title: 'List item #5' },
      { id: 6, title: 'List item #6' }
    ]
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

one({
  name: 'test',
  setup ({ query }) {
    const conditional1 = query('p')
    const conditional2 = query('div')
    const btn = query('button')
    const btn2 = query('button#show')

    const cond1 = conditional1.if()
    const cond2 = conditional2.if()

    btn.on('click', () => {
      cond1.hide()
      cond2.hide()
    })
    btn2.on('click', () => {
      cond1.show()
      cond2.show()
    })
  }
})
