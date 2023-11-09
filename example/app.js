import { o, mount } from '../dist/else'
import { getItems } from './services/get-items'

const AnotherComponent = {
  name: 'another-component',
  view({ props }) {
    return o('div', [
      o('p', `Hello ${props.name}`),
      o('p', 'This is another component'),
    ], { style: 'background: #333; padding: 10px;' })
  },
}

const Form = {
  name: 'my-form',
  data() {
    return {
      name: '',
      age: '',
      errors: [],
    }
  },
  view({ data }) {
    return o('form', [
      o('div', ['name', 'age'].map((prop) => {
        return o('div', o('input', '', {
          type: 'text',
          name: prop,
          placeholder: prop,
          oninput(e) {
            data[prop] = e.target.value
          },
        }))
      })),
      o('div', data.errors.map(error => o(
        'p',
        error,
        { style: 'color: red;' },
      ))),
      o('button', 'Submit', {
        onclick(e) {
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
        },
      }),
    ])
  },
}

const Component = {
  name: 'my-component',
  data() {
    return {
      items: [],
      foo: 'bar',
      bar: 'baz',
      name: 'John Doe',
    }
  },
  async onmount({data}) {
    console.log('mounted')
    data.items = await getItems()
  },
  view({ data }) {
    if (!data.items.length) {
      return o('div', [
        o('p', 'Loading...'),
        o('p', 'Some awesome items...'),
      ])
    }

    return o('div', [
      o('p', `This is ${data.foo}`),
      o('div', `Amount of items ${data.items.length}`),
      o('ul', data.items.map(item => o('li', `${item.name}`))),
      o(AnotherComponent, { name: data.name }),
      data.test ? o('p', 'Hey') : o('p', 'Hi'),
      o('div', [o('p', 'This is a paragraph in a nested div')]),
      o(Form),
      o('button', 'Click me', {
        onclick() {
          data.foo = 'something else'
          data.test = 'now i am set'
          data.name = 'Sebastian'
          data.items = [...data.items, { name: 'New item' }]
        },
      }),
    ])
  },
}

mount(Component, document.body)
