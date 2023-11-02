import {e, Link} from '../../dist/else'
import {Button} from '../ui/Button'
import styles from './about.module.css'

function About() {
  return e(
    'div',
    ({context}) => [
      e('h1', 'About'),
      e('p', `Hello ${context.name} ${context.id ?? ''}`),
      e('p', [
        Link({
          href: '/about-us/10',
          text: 'about us sub',
          activeClass: styles.active,
        }),
      ]),
      context.show
        ? e('div', [e('p', 'test 1')], {class: styles.purple})
        : e(
            'div',
            [
              e('div', [
                e('p', 'test 2'),
                e('span', 'test 2.a'),
                e('span', 'test 2.b'),
              ]),
            ],
            {class: styles.green}
          ),
      Button({
        text: 'Toggle show',
        onclick() {
          context.show = !context.show
        },
        classes: styles.button,
      }),
      Button({
        text: 'Swap the name',
        onclick() {
          context.name = context.name === 'Seb' ? 'Sebastian' : 'Seb'
        },
        variant: 'secondary',
      }),
    ],
    {
      data() {
        return {
          name: 'Seb',
          show: false,
          id: null,
        }
      },
      onroutechange({context, params}) {
        context.id = params.id
      },
    }
  )
}

export {About}
