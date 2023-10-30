import {e} from '../e'
import {router} from './router'
import {config} from './config'

function Link(
  opts = {
    href: '/',
    text: 'Link',
  }
) {
  return e('a', opts.text, {
    href: opts.href,
    onclick(ev) {
      ev.preventDefault()
      window.history.pushState(null, null, ev.target.href)
      router(config)
    },
  })
}

export {Link}
