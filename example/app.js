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
  async created () {
    this.state.items = await getItems()
  },
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
  name: 'simple-list',
  state: {
    items: ['Item #1', 'Item #2', 'Item #3']
  },
  template: html`
    <div>
      <ul>
        <li o-text></li>
      </ul>
      <button id="add">Add item</button>
      <button id="reset">Reset</button>
    </div>
  `,
  setup ({ query, state }) {
    const li = query('li')
    const add = query('#add')
    const reset = query('#reset')

    add.on('click', function ({ state }) {
      state.items = [...state.items, `Item #${state.items.length + 1}`]
    })

    reset.on('click', function ({ state }) {
      state.items.splice(1, 1)
    })

    li.for(['items'], function ({ el, item }) {
      el.style.color = 'coral'
      el.style.fontWeight = 'bold'
    })
  }
})

one({
  name: 'my-component',
  components: [Test, List],
  props: ['msg', 'variant'],
  state: { msg: 'Initial msg' },
  template: html`
    <div>
      <p o-text="$props.msg">Text</p>
      <p o-text="msg"></p>
      <my-button text="My button"></my-button>
      <button id="change-msg">Click me</button>
      <my-list>
        <ul>
          <li>Loading</li>
        </ul>
      </my-list>
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
