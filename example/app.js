import { o, mount } from '../dist/one'
import { getItems } from './services/get-items'

const Form = {
  name: 'form',
  data () {
    return {
      name: '',
      age: '',
      errors: []
    }
  },
  view ({ data, props }) {
    return o('form', [
      div(['name', 'age'].map((prop) => {
        return div(
          input({
            type: 'text',
            name: prop,
            disabled: data[prop].length >= 3,
            placeholder: prop,
            oninput (e) {
              data[prop] = e.target.value
            }
          })
        )
      })),
      div(data.errors.map((error) => p(
        error,
        { style: 'color: red;' }
      ))),
      div(`Prop: ${props.name}`),
      button('Reset name', {
        onclick (e) {
          e.preventDefault()
          data.name = ''
        }
      }),
      button('Submit', {
        onclick (e) {
          e.preventDefault()
          console.log('submit form')
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
  data () {
    return {
      items: [],
      foo: 'bar',
      bar: 'baz',
      name: 'Torben Hunter'
    }
  },
  async onmount ({ data }) {
    data.items = await getItems()
  },
  view ({ data }) {
    return ifElse(
      data.items.length === 0,
      o(Loader),
      div([
        div(`Amount of items ${data.items.length}`),
        o('ul', data.items.map(item => o('li', `${item.name}`))),
        o(Form, { name: data.name }),
        button('Click me', {
          onclick () {
            data.name = 'Jane Doe'
          }
        }),
        button('Re-fetch items', {
          async onclick () {
            data.items = []
            data.items = await getItems()
          }
        })
      ])
    )
  }
}

const Loader = {
  view () {
    return div('Loading...')
  }
}

const View = {
  view () {
    return div([
      // o(SmallComponent),
      o(Component)
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

function ifElse (condition, ifChildren, elseChildren, attrs) {
  if (condition) {
    return o('div', ifChildren, { ...attrs, if: true })
  }

  return o('div', elseChildren, { ...attrs, else: true })
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

mount(View, document.body)
