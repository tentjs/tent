import {L} from '../l.js'
import {waitFor, fireEvent, getByText} from '@testing-library/dom'

test('that simple elements can be created', () => {
  const dom = document.createElement('div')
  dom.id = 'foo'
  const component = L('div', [L('h1', 'Hello World')], {id: 'bar'})
  dom.append(component)
  const h1 = dom.querySelector('h1')
  expect(h1.textContent).toEqual('Hello World')
  expect(h1.parentElement.id).toBe('bar')
  expect(h1.parentElement.parentElement.id).toBe('foo')
})

test('that simple elements can be created with attributes', () => {
  const dom = document.createElement('div')
  dom.id = 'dom'
  const component = L('div', [L('h1', 'Hello World')], {
    id: 'foo',
    class: 'bar',
  })
  dom.append(component)
  const h1 = dom.querySelector('h1')
  expect(h1.textContent).toEqual('Hello World')
  expect(h1.parentElement.id).toBe('foo')
  expect(h1.parentElement.className).toBe('bar')
})

test('elements with data', () => {
  const dom = document.createElement('div')
  dom.id = 'dom'
  const component = L('div', ({data}) => [L('h1', `Hello ${data.foo}`)], {
    data: {foo: 'bar'},
  })
  dom.append(component)
  expect(getByText(dom, 'Hello bar')).toBeTruthy()
})

test('elements with changing data', async () => {
  const dom = document.createElement('div')
  dom.id = 'dom'
  const component = L(
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
    }
  )
  dom.append(component)
  expect(getByText(dom, 'Hello bar')).toBeTruthy()
  fireEvent.click(getByText(dom, 'Click me!'))
  await waitFor(() => {
    expect(getByText(dom, 'Hello baz')).toBeTruthy()
  })
})

test('element with onmounted', () => {
  const dom = document.createElement('div')
  const fn = jest.fn()
  const fn2 = jest.fn()
  const fn3 = jest.fn()
  dom.id = 'dom'
  const component = L(
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
            onmounted() {
              fn2()
            },
          })
        : L('div', ['This is cool too'], {
            onmounted() {
              fn3()
            },
          }),
    ],
    {
      data: {count: 0},
      onmounted({el}) {
        fn(el)
      },
    }
  )
  dom.append(component)

  expect(getByText(dom, 'Hello World')).toBeTruthy()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(component)
  expect(fn2).toHaveBeenCalledTimes(1)

  fireEvent.click(getByText(dom, 'Click me!'))
  expect(fn3).toHaveBeenCalledTimes(1)
})
