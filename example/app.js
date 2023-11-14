import { o, mount } from '../dist/one'
import { getItems } from './services/get-items'

const Component = {
  name: 'component',
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
  name: 'list',
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

const If = {
  name: 'if',
  data () {
    return {
      name: 'John Doe'
    }
  },
  view ({ data }) {
    return o('div', [
      o('h1', 'If'),
      o('p', 'Paragraph inside If'),
      o('button', `Click ${data.name}`, {
        onclick () {
          console.log('clicked')
          data.name = 'Jane Doe'
        }
      })
    ])
  }
}

const Else = {
  name: 'else',
  view ({ props }) {
    return o('div', [
      o('h1', 'Else'),
      o('p', `Paragraph inside Else, with prop "name": ${props.name}`),
      o('p', 'Another one')
    ])
  }
}

const View = {
  name: 'view',
  data () {
    return {
      name: 'Sebastian',
      show: true
    }
  },
  view ({ data }) {
    return o('div', [
      o(Component),
      o('p', `Hello ${data.name}`),
      data.show
        ? o(If, null)
        : o(Else, { name: data.name }),
      o('button', 'Click to toggle', {
        onclick () {
          data.show = !data.show
        }
      })
    ])
  }
}

mount(View, document.body)
