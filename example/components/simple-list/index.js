import { template } from './template'

const SimpleList = {
  name: 'simple-list',
  state: {
    items: ['Item #1', 'Item #2', 'Item #3']
  },
  template,
  setup({ query, state }) {
    const initialState = state.items
    
    const li = query('li')
    const add = query('#add')
    const reset = query('#reset')

    add.on('click', function ({ state }) {
      state.items = [...state.items, `Item #${state.items.length + 1}`]
    })

    reset.on('click', function ({ state }) {
      state.items = initialState
    })

    li.for(['items'], function ({ el, item }) {
      el.style.color = 'coral'
      el.style.fontWeight = 'bold'
    })
  }
}

export { SimpleList }