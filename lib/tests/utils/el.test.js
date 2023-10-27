import {e} from '../../else'
import {getChildren} from '../../utils'

describe('getChildren', () => {
  test('function children', () => {
    const child = () => e('div', 'Hey')
    expect(getChildren(child)).toEqual(child())
  })

  test('non-function children', () => {
    const child = e('div', 'Hi.')
    expect(getChildren(child)).toEqual(child)
  })

  test('to array children', () => {
    const child = e('span', 'Yo!')
    const children = getChildren(child, null, true)
    expect(children).toEqual([child])
  })
})
