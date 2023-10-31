import {e} from '../../dist/else'
import styles from './list.module.css'

function ListInput(context) {
  const label = 'What is up next?'

  return e('input', [], {
    onkeyup(event) {
      handleOnKeyup(event, context)
    },
    type: 'text',
    'aria-label': label,
    placeholder: label,
    disabled: context.isLoading,
    class: [styles.input],
  })
}

function handleOnKeyup(event, context) {
  if (event.keyCode !== 13) {
    return
  }

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

export {ListInput}
