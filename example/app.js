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
      count: 0
    }
  },
  view ({ data }) {
    return o('div', [
      o('h1', 'If'),
      o('p', 'Paragraph inside If'),
      o('button', data.count ? `Clicked ${data.count} times` : 'Click', {
        onclick () {
          console.log('clicked')
          data.count = data.count + 1
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
      o('input', [], {
        value: data.name,
        name: 'input',
        type: 'text',
        oninput (e) {
          data.name = e.target.value
        }
      }),
      data.show
        ? o(If, null, { redraw: true })
        : o(Else, { name: data.name }, { redraw: true }),
      o('button', 'Click to toggle', {
        onclick () {
          data.show = !data.show
        }
      })
    ])
  }
}

mount(View, document.body)
