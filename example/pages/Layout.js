import {e, Link} from '../../dist/else'

import styles from './layout.module.css'

const Layout = e(
  'div',
  [
    e(
      'header',
      [
        e(
          'nav',
          [
            Link({href: '/', text: 'home'}),
            Link({href: '/about-us', text: 'about us'}),
            Link({href: '/form', text: 'form'}),
            Link({href: '/post/10', text: 'post'}),
          ],
          {
            class: styles.nav,
          }
        ),
      ],
      {
        class: styles.header,
      }
    ),
    e('main', [], {view: true, class: styles.main}),
    e('footer', '💛 else.js', {
      class: styles.footer,
    }),
  ],
  {
    class: styles.layout,
  }
)

export {Layout}
