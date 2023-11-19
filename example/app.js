import { One } from '../dist/one'
import { getItems } from './services/get-items'

const Test1 = new One(function () {
  return {
    name: 'instance1',
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
      },
      classNames: () => {
        return this.state.count > 2 ? 'text-blue-500' : 'text-red-500'
      },
      disabled: () => {
        return this.state.count > 5
      }
    },
    methods: {
      handleClick: () => {
        this.state = {
          msg: 'Hello, Europe!',
          count: this.state.count + 1,
          list: this.state.list.filter((item) => item.id !== 1)
        }
      }
    }
  }
})

Test1.mount()

const Test2 = new One(function () {
  return {
    name: 'instance2',
    state: {
      msg: 'Hello, World #2!'
    }
  }
})

Test2.mount()
