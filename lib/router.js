import { L } from './else'
import { getChildren } from './utils'

const config = {
  routes: [],
  opts: {},
}

function createRouter(routes, opts = {}) {
  const app = opts.root ?? document.body
  if (!app) {
    throw new Error('No root element found')
  }

  config.routes = routes
  config.opts = opts

  window.onload = () => router(config)
  window.onpopstate = () => router(config)
}

function Link(
  opts = {
    href: '/',
    text: 'Link',
  }
) {
  return L('a', opts.text, {
    href: opts.href,
    onclick(ev) {
      ev.preventDefault()
      window.history.pushState(null, null, ev.target.href)
      router(config)
    },
  })
}

function router(config) {
  if (!config.routes.length) {
    throw new Error(
      'No routes found. You must specify at least one route with createRouter().'
    )
  }
  const path = window.location.pathname
  let route = config.routes.find((r) => r.path === path)
  if (!route) {
    const tokens = path.split('/').filter((t) => t)
    const params = {}
    for (let i = 0; i < config.routes.length; i++) {
      const r = config.routes[i]
      const rt = r.path.split('/').filter((t) => t)
      if (tokens.length === rt.length && rt[0] === tokens[0]) {
        route = r
        for (let j = 0; j < rt.length; j++) {
          const t = rt[j]
          if (t.startsWith(':')) {
            params[t.slice(1)] = tokens[j]
          }
        }
      }
    }

    route.component.$params = params
  }

  if (!route && config.opts.fallback) {
    window.history.pushState(null, null, config.opts.fallback)
    window.location.replace(config.opts.fallback)
    return
  }

  const layout = route.layout ?? config.opts.layout
  if (layout) {
    const mount = layout.querySelector('[view]')
    if (!mount) {
      throw new Error(
        `When using 'layout' it is required to specify 'view' in the targets options.`
      )
    }
    if (mount.children.length > 1) {
      throw new Error('Mount point must have only one child')
    }
    const component = getChildren(route.component)
    if (mount.children.length === 0) {
      mount.append(component)
    } else {
      mount.children[0].replaceWith(component)
    }
  }

  const el = getChildren(layout || route.component)
  const current = app.children?.[0]
  if (current && !current.isEqualNode(el)) {
    current.replaceWith(el)
  } else {
    app.append(el)
  }
}

export { createRouter, Link }
