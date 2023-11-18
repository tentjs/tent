import { One } from '../dist/one'
import { getItems } from './services/get-items'

const Test1 = new One(function () {
  return {
    scope: 'scope1',
    onmount: async () => {
      this.state = {
        list: await getItems()
      }
    },
    state: {
      msg: 'Hello, World!',
      count: 0,
      list: []
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
    scope: 'scope2',
    state: {
      msg: 'Hello, World #2!'
    }
  }
})

Test2.mount()
