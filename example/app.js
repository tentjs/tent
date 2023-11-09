import { t, mount } from '../dist/else'
import { getItems } from './services/get-items'

const AnotherComponent = {
  name: 'another-component',
  view({ props }) {
    return t('div', [
      t('p', `Hello ${props.name}`),
      t('p', 'This is another component'),
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
    return t('form', [
      ...['name', 'age'].map((prop) => {
        return t('div', t('input', '', {
          type: 'text',
          name: prop,
          placeholder: prop,
          oninput(e) {
            data[prop] = e.target.value
          },
        }))
      }),
      ...data.errors.map(error => t(
        'p',
        error,
        { style: 'color: red;' },
      )),
      t('button', 'Submit', {
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
  prepare() {
    return {
      items: getItems(),
    }
  },
  view({ data, errors }) {
    if (errors.length) {
      return t('ul', errors.map(error => t('li', error)))
    }

    if (!data.items.length) {
      return t('div', [
        t('p', 'Loading...'),
        t('p', 'Some awesome items...'),
      ])
    }

    return t('div', [
      t('p', `This is ${data.foo}`),
      t('div', `Amount of items ${data.items.length}`),
      t('ul', data.items.map(item => t('li', `${item.name}`))),
      t(AnotherComponent, { name: data.name }),
      data.test ? t('p', 'Hey') : t('p', 'Hi'),
      t('div', [t('p', 'This is a paragraph in a nested div')]),
      t(Form),
      t('button', 'Click me', {
        onclick() {
          data.foo = 'something else'
          data.test = 'now i am set'
          data.name = 'Sebastian'
        },
      }),
    ])
  },
}

mount(Component, document.body)
