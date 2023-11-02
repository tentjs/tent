import {e} from '../e'
import {handleRoute} from './router'

function Link(
  opts = {
    href: '/',
    text: 'Link',
  }
) {
  const {text, href, activeClass, ...rest} = opts

  return e('a', text, {
    href,
    class({context}) {
      return context.active ? activeClass ?? 'active' : ''
    },
    onroutechange({path, context}) {
      context.active = path === href
    },
    onclick(ev) {
      ev.preventDefault()
      if (href === location.pathname) {
        return
      }
      window.history.pushState(null, null, ev.target.href)
      handleRoute()
    },
    data() {
      return {
        active: false,
      }
    },
    ...rest,
  })
}

export {Link}
