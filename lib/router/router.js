import {getChildren, replaceWith} from '../utils'
import {cache} from './cache'

const config = {
  routes: [],
  opts: {},
}

function createRouter(routes, opts = {}) {
  const root = opts.root ?? document.body
  if (!root) {
    throw new Error('No root element found')
  }

  config.routes = routes
  config.opts = opts

  window.onload = () => handle()
  window.onpopstate = () => handle()
}

function push(path) {
  window.history.pushState(null, null, path)
  handle(path)
}

function replace(path) {
  window.history.replaceState(null, null, path)
  handle(path)
}

function handle(path = window.location.pathname) {
  if (!config.routes.length) {
    throw new Error(
      `No routes found. You must specify at least one route with createRouter().`
    )
  }

  let route = config.routes.find((r) => r.path === path)
  let parsedRoute = ''
  let params = {}

  if (!route) {
    const tokens = path.split('/').filter((t) => t)
    for (let i = 0; i < config.routes.length; i++) {
      const r = config.routes[i]
      const rt = r.path.split('/').filter((t) => t)
      if (tokens.length === rt.length && rt[0] === tokens[0]) {
        route = r
        parsedRoute = r.path
        for (let j = 0; j < rt.length; j++) {
          const t = rt[j]
          if (t.startsWith(':')) {
            parsedRoute = parsedRoute.replace(t, tokens[j])
            params[t.slice(1)] = tokens[j]
          }
        }
      }
    }
  }

  if (!route) {
    if (config.opts.fallback) {
      window.location.replace(config.opts.fallback)
      return
    }
    throw new Error(
      `No route found for path: ${path}. You should specify as fallback route.`
    )
  }

  const component = getChildren(route.component)
  const layout = route.layout ?? config.opts.layout
  if (layout) {
    const mount = layout.querySelector('[view]')
    if (!mount) {
      throw new Error(`When using 'layout' it is required to set 'view'.`)
    }
    if (mount.children.length > 1) {
      throw new Error('Mount point must have only one child')
    }
    if (mount.children.length === 0) {
      mount.append(component)
    } else {
      replaceWith(mount.children[0], component)
    }
  }

  const el = getChildren(layout || component)
  const root = config.opts.root ?? document.body
  const current = root.children?.[0]
  if (current && !current.isEqualNode(el)) {
    replaceWith(current, el)
  } else {
    root.append(el)
  }

  cache.forEach(({context, cb}) => {
    cb({
      context,
      path: parsedRoute ? parsedRoute : route.path,
      params,
    })
  })
}

export {createRouter, push, replace}
