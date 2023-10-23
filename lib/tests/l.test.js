import {L} from '../l.js'
import {fireEvent, getByText, screen} from '@testing-library/dom'

test('that simple elements can be created', () => {
  L('div', [L('h1', 'Hello World')], {mount: document.body})

  const h1 = screen.queryByText('Hello World')
  expect(h1).toBeTruthy()
})

test('that simple elements can be created with attributes', () => {
  document.body.innerHTML = ''

  L('div', [L('h1', 'Hello World')], {
    id: 'foo',
    class: 'bar',
    mount: document.body,
  })

  const h1 = screen.queryByText('Hello World')
  expect(h1).toBeTruthy()
  expect(h1.parentElement.id).toBe('foo')
  expect(h1.parentElement.className).toBe('bar')
})

test('elements with data', () => {
  const dom = document.createElement('div')
  dom.id = 'dom'
  const Component = L('div', ({data}) => [L('h1', `Hello ${data.foo}`)], {
    data: {foo: 'bar'},
  })
  dom.append(Component)
  expect(getByText(dom, 'Hello bar')).toBeTruthy()
})

test('elements with changing data', async () => {
  document.body.innerHTML = ''

  L(
    'div',
    ({data}) => [
      L('h1', `Hello ${data.foo}`),
      L('button', ['Click me!'], {
        onclick() {
          data.foo = 'baz'
        },
      }),
    ],
    {
      data: {foo: 'bar'},
      mount: document.body,
    }
  )

  expect(screen.getByText('Hello bar')).toBeTruthy()
  fireEvent.click(screen.getByText('Click me!'))
  expect(screen.getByText('Hello baz')).toBeTruthy()
})

test('element with onmount', () => {
  document.body.innerHTML = ''

  const fn = jest.fn()
  const fn2 = jest.fn()
  const fn3 = jest.fn()

  L(
    'div',
    ({data}) => [
      L('h1', 'Hello World'),
      L('button', 'Click me!', {
        onclick() {
          data.count = data.count + 1
        },
      }),
      data.count <= 0
        ? L('div', ['This is cool'], {
            onmount() {
              fn2()
            },
          })
        : L('div', ['This is cool too'], {
            onmount() {
              fn3()
            },
          }),
    ],
    {
      data: {count: 0},
      onmount({el}) {
        fn(el)
      },
      mount: document.body,
      'data-testid': 'root',
    }
  )

  expect(screen.getByText('Hello World')).toBeTruthy()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(screen.getByTestId('root'))
  expect(fn2).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByText('Click me!'))
  expect(fn3).toHaveBeenCalledTimes(1)
})

test('element with styles', () => {
  document.body.innerHTML = ''

  L(
    'div',
    [
      L('h1', 'Hello World', {
        styles: {
          color: 'red',
        },
      }),
    ],
    {
      mount: document.body,
    }
  )

  const h1 = screen.queryByText('Hello World')
  expect(h1).toBeTruthy()
  expect(window.getComputedStyle(h1).color).toBe('red')
})

test('element with props', () => {
  document.body.innerHTML = ''

  const Test = L(
    'div',
    ({data}) => (data.props.name ? `Hello ${data.props.name}` : 'Hello'),
    {
      props: ['name'],
    }
  )

  L(
    'div',
    [
      Test,
      L('button', 'Click me!', {
        onclick() {
          Test.props.name = 'Joe'
        },
      }),
    ],
    {mount: document.body}
  )

  expect(screen.queryByText('Hello')).toBeTruthy()
  fireEvent.click(screen.queryByText('Click me!'))
  expect(screen.queryByText('Hello Joe')).toBeTruthy()
})

test('that it is required to setup `props: []` to get access to props', () => {
  document.body.innerHTML = ''

  expect(
    () =>
      L('div', ({data}) =>
        data.props.name ? `Hello ${data.props.name}` : 'Hello'
      )
    // Accessing `data.props.name` will throw because `props` is not setup, and therefore `data.props.X` is undefined
  ).toThrow(`Cannot read properties of undefined (reading 'name')`)
})
