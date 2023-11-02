import {e, Link} from '../../dist/else'

import styles from './layout.module.css'

const routes = [
  {href: '/', text: 'home', activeClass: styles.active},
  {href: '/about-us', text: 'about us', activeClass: styles.active},
  {href: '/form', text: 'form', activeClass: styles.active},
  {href: '/post/10', text: 'post', activeClass: styles.active},
]

const Layout = e(
  'div',
  [
    e(
      'header',
      [
        e(
          'nav',
          routes.map((route) => Link(route)),
          {class: styles.nav}
        ),
      ],
      {class: styles.header}
    ),
    e('main', [], {view: true, class: styles.main}),
    e('footer', '💛 else.js', {class: styles.footer}),
  ],
  {class: styles.layout}
)

export {Layout}
