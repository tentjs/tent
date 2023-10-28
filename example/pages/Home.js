import {e} from '../../dist/else'
import {getItems} from '../services/getItems'
import {List, ListInput} from '../components'

const Home = e('div', ({context}) => [ListInput(context), List(context)], {
  async onmount({context}) {
    context.items = await getItems()
    context.isLoading = false
  },
  data() {
    return {
      amount: 0,
      items: [],
      isLoading: true,
    }
  },
})

export {Home}
