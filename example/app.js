import { o, mount } from '../dist/one'
import { getItems } from './services/get-items'

const Component = {
  data () {
    return {
      items: []
    }
  },
  async onmount ({ data }) {
    data.items = await getItems()
  },
  view ({ data }) {
    return o('div', [
      o('h1', 'Items'),
      o(List, { items: data.items })
    ])
  }
}

const List = {
  view ({ props }) {
    return o('div', [
      o('ul',
        props.items.length
          ? props.items.map(item => o('li', `${item.name}`))
          : o('li', 'Loading')
      )
    ])
  }
}

const View = {
  view () {
    return o('div', [
      o(Component)
    ])
  }
}

mount(View, document.body)
