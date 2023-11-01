import {e} from '../e'
import {router} from './router'
import {config} from './config'

function Link(
  opts = {
    href: '/',
    text: 'Link',
  }
) {
  const {text, href, activeClass, ...rest} = opts

  return e('a', text, {
    href,
    onclick(ev) {
      ev.preventDefault()
      if (href === location.pathname) {
        return
      }
      window.history.pushState(null, null, ev.target.href)
      router(config)
    },
    ...rest,
  })
}

export {Link}
