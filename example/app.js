import { o, mount } from '../dist/else'
import { getItems } from './services/get-items'

const AnotherComponent = {
  name: 'another-component',
  onmount({data, props}) {
    console.log('mounted another-component', data, props)
  },
  view ({ props }) {
    return div([
      p(`Hello ${props.name}`),
      p('This is another component')
    ], { style: 'background: #333; padding: 10px;' })
  }
}

const Form = {
  name: 'my-form',
  data () {
    return {
      name: '',
      age: '',
      errors: []
    }
  },
  view ({ data }) {
    return o('form', [
      div(['name', 'age'].map((prop) => {
        return div(
          input({
            type: 'text',
            name: prop,
            placeholder: prop,
            oninput (e) {
              data[prop] = e.target.value
            }
          })
        )
      })),
      div(data.errors.map(error => p(
        error,
        { style: 'color: red;' }
      ))),
      button('Submit', {
        onclick (e) {
          e.preventDefault()
          const errors = []
          if (!data.name) {
            errors.push('Please fill out the name field')
          }
          if (!data.age) {
            errors.push('Please fill out the age field')
          }
          data.errors = errors
          if (!errors.length) {
            console.log(data)
          }
        }
      })
    ])
  }
}

const Component = {
  name: 'my-component',
  data () {
    return {
      items: [],
      foo: 'bar',
      bar: 'baz',
      name: 'John Doe'
    }
  },
  async onmount ({ data, props }) {
    console.log('mounted', data, props)
    data.items = await getItems()
  },
  view ({ data }) {
    if (!data.items.length) {
      return div([
        p('Loading...'),
        p('Some awesome items...')
      ])
    }

    return div([
      p(`This is ${data.foo}`),
      div(`Amount of items ${data.items.length}`),
      o('ul', data.items.map(item => o('li', `${item.name}`))),
      o(AnotherComponent, { name: data.name }),
      data.test ? p('Hey') : p('Hi'),
      div(p('This is a paragraph in a nested div')),
      o(Form),
      button('Click me', {
        onclick () {
          data.foo = 'something else'
          data.test = 'now i am set'
          data.name = 'Sebastian'
          data.items = [...data.items, { name: 'New item' }]
        }
      })
    ])
  }
}

// TODO: Is this cool, or is it just clutter?
// Maybe it should be moved to a separate @one/components package or something
// This way it would be possible to create Flutter-like widgets
// and use them in the same way as the built in elements
function div (children, attrs) {
  return o('div', children, attrs)
}

function p (children, attrs) {
  return o('p', children, attrs)
}

function button (children, attrs) {
  return o('button', children, attrs)
}

function input (attrs) {
  return o('input', '', attrs)
}

mount(Component, document.body)
