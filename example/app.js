import { One } from '../dist/one'

const Test1 = new One(function () {
  return {
    scope: 'app',
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
    computed: {
      uppercaseMsg: () => {
        return this.state.msg.toUpperCase()
      },
      show: () => {
        return this.state.count > 2
      }
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

const Test2 = new One(function () {
  return {
    scope: 'app2',
    state: {
      msg: 'Hello, World #2!'
    }
  }
})

Test2.mount()
