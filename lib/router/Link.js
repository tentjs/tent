import { e } from '../e'
import { push } from './router'

function Link (
  opts = {
    href: '/',
    text: 'Link'
  }
) {
  const { text, href, activeClass, ...rest } = opts

  return e('a', text, {
    href,
    class ({ context }) {
      return context.active ? activeClass ?? 'active' : ''
    },
    onroutechange ({ path, context }) {
      context.active = path === href
    },
    onclick (ev) {
      ev.preventDefault()
      if (href === window.location.pathname) {
        return
      }
      push(href)
    },
    data () {
      return {
        active: window.location.pathname === href
      }
    },
    ...rest
  })
}

export { Link }
