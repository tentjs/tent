import {e} from '../../dist/else'
import {getItems} from '../services/get-items'
import {List, ListInput} from '../components'

function Home() {
  return e('div', ({context}) => [ListInput(context), List(context)], {
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
}

export {Home}
