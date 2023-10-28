import {e} from '../../dist/else'
import {ListItem} from './ListItem'

function List(context) {
  if (context.items.length === 0 && !context.isLoading) {
    return e('div', [e('p', 'Yay! You rock 🎉')])
  }
  return e(
    'ul',
    context.isLoading
      ? [1, 2, 3, 4, 5].map((v) => e('li', [], {key: v, class: 'skeleton'}))
      : context.items.map((item) => ListItem(context, item)),
    {
      styles: {
        margin: '0 auto',
        padding: 0,
        'list-style': 'none',
        display: 'flex',
        'flex-direction': 'column',
        gap: '6px',
        li: {
          padding: '8px',
          color: '#eee',
          background: '#444',
          'border-radius': '4px',
          opacity: 1,
        },
        'li.done': {
          opacity: 0.5,
          background: 'seagreen',
        },
        'li.skeleton': {
          height: '92px',
        },
      },
    }
  )
}

export {List}
