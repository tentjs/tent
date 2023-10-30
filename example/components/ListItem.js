import {e} from '../../dist/else'
import styles from './list.module.css'

function ListItem(context, item) {
  const Buttons = e(
    'div',
    [
      e('button', '✅', {
        onclick() {
          item.done = !item.done
          context.items = context.items
        },
      }),
      e('button', '🗑️', {
        onclick() {
          context.items = context.items.filter((x) => x.id !== item.id)
        },
      }),
    ],
    {class: styles.buttons}
  )

  return e(
    'li',
    [
      e('div', [
        e('div', `#${item.id}`, {class: styles.itemId}),
        e('strong', item.name, {class: styles.itemName}),
        !item.done
          ? e('div', [e('p', item.description), Buttons], {
              class: styles.itemDescription,
            })
          : Buttons,
      ]),
    ],
    {key: item.id, class: `${item.done ? styles.done : ''} ${styles.item}`}
  )
}

export {ListItem}
