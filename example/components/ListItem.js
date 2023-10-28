import {e} from '../../dist/else'

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
    {
      styles: {
        display: 'flex',
        gap: '6px',
        margin: '12px 0 0 0',
        button: {
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
        },
      },
    }
  )

  return e(
    'li',
    [
      e('div', `#${item.id}`, {
        styles: {'font-size': '0.8em', margin: '0 0 4px 0'},
      }),
      e('strong', item.name, {
        styles: {'font-size': '1.2em', margin: '0 0 4px 0', display: 'block'},
      }),
      !item.done
        ? e(
            'div',
            [
              item.subtitle && e('p', item.subtitle),
              e('p', item.description),
              Buttons,
            ],
            {styles: {p: {'font-size': '0.85em'}}}
          )
        : Buttons,
    ],
    {
      key: item.id,
      class: `${item.done ? 'done' : ''}`,
      styles: {
        p: {margin: 0},
      },
    }
  )
}

export {ListItem}
