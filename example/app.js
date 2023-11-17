import { One } from '../dist/one'

const Test1 = new One(function () {
  return {
    state: {
      msg: 'Hello, World!',
      count: 0,
      list: [
        { id: 1, name: 'One' },
        { id: 2, name: 'Two' },
        { id: 3, name: 'Three' },
        { id: 4, name: 'Four' },
        { id: 5, name: 'Five' }
      ]
    },
    methods: {
      handleClick: () => {
        this.state = {
          msg: 'Hello, Europe!',
          count: this.state.count + 1
        }
      }
    }
  }
})

Test1.mount()
