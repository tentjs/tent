import {L} from '../../l'
import {getChildren} from '../../utils'

describe('getChildren', () => {
  test('function children', () => {
    const child = () => L('div', 'Hey')
    expect(getChildren(child)).toEqual(child())
  })

  test('non-function children', () => {
    const child = L('div', 'Hi.')
    expect(getChildren(child)).toEqual(child)
  })

  test('to array children', () => {
    const child = L('span', 'Yo!')
    const children = getChildren(child, null, true)
    expect(children).toEqual([child])
  })
})
