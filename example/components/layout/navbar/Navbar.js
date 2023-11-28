import { html } from '../../../../lib/one'

import * as styles from './nav.module.css'

const Navbar = {
  name: 'navbar',
  template: html`
    <div>
      <nav class="${styles.nav}">
        <a href="#">Hello World!</a>
        <span>Essentials</span>
        <a href="#">Home</a>
        <a href="#">Home</a>
        <a href="#">Home</a>
        <span>Functions</span>
        <a href="#">on</a>
        <a href="#">for</a>
        <a href="#">if</a>
        <span>Directives</span>
        <a href="#">o-text</a>
      </nav>
    </div>
  `,
  setup({ query }) {
    const nav = query('nav')

    nav.on('click', function ({ event }) {
      if (event.target.tagName === 'A') {
        event.preventDefault()
        event.stopPropagation()

        console.log(event.target)
      }
    })
  }
}

export { Navbar }
