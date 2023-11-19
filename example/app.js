import { one } from '../dist/one'

one({
  name: 'my-component',
  props: ['msg'],
  template: `
    <p o-text="msg">Text</p>
    <button>Click me</button>
  `,
  setup ({ query, click }) {
    const btn = query('button')

    click(btn, function ({ state }) {
      state.msg = 'Hello World #2'
    })
  }
})
