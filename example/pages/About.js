import {e} from '../../dist/else'
import {Button} from '../ui/Button'
import styles from './about.module.css'

function About() {
  return e(
    'div',
    ({context}) => [
      e('h1', 'About'),
      e(
        'p',
        `Hello ${context.name} ${
          context.$route.params?.id ? context.$route.params.id : ''
        }`
      ),
      context.name === 'Seb'
        ? e('div', [e('p', 'test 1')], {
            key: 'test1',
            class: styles.purple,
          })
        : e(
            'div',
            [
              e('div', [
                e('p', 'test 2'),
                e('span', 'test 2.a'),
                e('span', 'test 2.b'),
              ]),
            ],
            {
              key: 'test2',
              class: styles.green,
            }
          ),
      e('button', 'Swap name', {
        onclick() {
          context.name = context.name === 'Seb' ? 'Sebastian' : 'Seb'
        },
      }),
      Button({
        text: 'Button',
        onclick() {
          console.log('clicked', context)
        },
      }),
    ],
    {
      data() {
        return {
          name: 'Seb',
        }
      },
    }
  )
}

export {About}
