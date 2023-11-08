import {t, mount} from '../dist/else'
import {getItems} from './services/get-items'

const AnotherComponent = {
  name: 'another-component',
  data: {
    name: 'Poul',
  },
  view({props}) {
    return t('p', `My name is ${props.prop1}`)
  },
}

const Component = {
  name: 'my-component',
  data: {
    items: [],
    foo: 'bar',
    bar: 'baz',
  },
  before() {
    return {
      items: getItems(),
    }
  },
  view({data}) {
    // this won't "persist" on re-renders
    // but can be used to process data or props
    const reverse = data.bar.split('').reverse().join('')

    return t('div', [
      t('p', `This is ${data.foo} and ${reverse}`),
      t('div', `Amount of items ${data.items.length}`),
      t(AnotherComponent, {prop1: data.bar}),
      data.test ? t('p', 'Hey') : t('p', 'Hi'),
      t('div', [t('p', 'This is a paragraph in a nested div')]),
      t('button', 'Click me', {
        onclick() {
          bar = 'boo'
          data.foo = 'something else'
          data.test = 'now i am set'
        },
      }),
    ])
  },
}

mount(Component, document.body)
