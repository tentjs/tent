import {e} from '../../dist/else'

function ListInput(context) {
  return e(
    'label',
    [
      e('input', [], {
        onmount({el}) {
          if (!el.disabled) {
            setTimeout(() => {
              el.focus()
            })
          }
        },
        onkeyup(event) {
          if (event.keyCode === 13) {
            const id = context.items.length
              ? context.items[context.items.length - 1].id + 1
              : 1
            context.items = [
              ...context.items,
              {
                id,
                name: event.target.value,
                description: `${event.target.value} description`,
              },
            ]
            event.target.value = ''
          }
        },
        type: 'text',
        'aria-label': 'What is up next?',
        placeholder: 'What is up next?',
        disabled: context.isLoading,
        styles: {
          'box-sizing': 'border-box',
          padding: '16px',
          width: '100%',
          'border-radius': '4px',
          'font-size': '1em',
          border: 'none',
        },
      }),
    ],
    {
      styles: {
        padding: '8px 0',
        display: 'block',
        'margin-bottom': '1em',
        width: '350px',
        span: {
          display: 'block',
          margin: '0 0 2px 0',
          'font-size': '12px',
          'text-transform': 'uppercase',
        },
      },
    }
  )
}
export {ListInput}
