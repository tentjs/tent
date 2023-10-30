import {e} from '../../dist/else'
import {Button} from '../ui/Button'
import styles from './form.module.css'

const inputNames = ['name', 'email']
const values = new Map(inputNames.map((x) => [x, '']))
const errors = new Map()

function Page() {
  return e('div', [
    e('h1', 'Form'),
    e('p', 'This is a simple example of building a form with validation.'),
    Form,
  ])
}

function Form() {
  const Inputs = inputNames.map((input) =>
    e(
      'label',
      [
        e('input', [], {
          type: 'text',
          placeholder: `Type ${input.toLowerCase()}...`,
          'aria-label': `Type ${input.toLowerCase()}...`,
          class: styles.input,
          oninput(ev) {
            values.set(input, ev.target.value)
          },
        }),
      ],
      {class: styles.label}
    )
  )

  return e(
    'form',
    ({context}) => [
      ...Inputs,
      Errors,
      Button({
        text: 'Submit',
        variant: 'secondary',
        onclick(ev) {
          ev.preventDefault()
          handleSubmit(context)
        },
      }),
    ],
    {
      data() {
        return {
          errors: new Map(),
        }
      },
    }
  )
}

function Errors() {
  if (!errors.size) {
    return e('ul', [])
  }
  return e(
    'ul',
    Array.from(errors).map(([key, value]) => e('li', `${key}: ${value}`)),
    {class: styles.errors}
  )
}

function handleSubmit(context) {
  values.forEach((value, key) => {
    // This is where you would do your validation
    if (value === '') {
      errors.set(key, 'This field is required')
    } else {
      errors.delete(key)
    }
  })
  // Triggers a re-render
  context.errors = errors
  if (errors.size) {
    return
  }
  console.info('do something with values', values)
}

export {Page as Form}
