import {e} from '../../dist/else'
import {ListItem} from './ListItem'
import styles from './list.module.css'

function List(context) {
  if (context.items.length === 0 && !context.isLoading) {
    return e('div', [e('p', 'Yay! You rock 🎉')])
  }
  return e(
    'ul',
    context.isLoading
      ? [1, 2, 3].map((v) =>
          e('li', [], {
            key: v,
            class: styles.skeleton,
          })
        )
      : context.items.map((item) => ListItem(context, item)),
    {
      class: styles.list,
    }
  )
}

export {List}
