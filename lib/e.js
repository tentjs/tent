import {render} from './render'

function e(as, nodes = [], opts = {}) {
  const {mount, data, layout, ...attributes} = opts
  const el = document.createElement(as)

  el.$$else = {
    route: {
      params: null,
    },
    context: null,
  }

  const context = data == null ? {} : data()
  for (const prop in context) {
    if (prop.startsWith('$')) {
      throw new Error(`Cannot use reserved property name: ${prop}`)
    }
  }
  context.$route = context.$route ?? {params: null}

  const $context = new Proxy(context, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      const s = Reflect.set(target, key, value)
      render(el, nodes, $context)
      return s
    },
  })
  el.$$else.context = $context

  Object.defineProperty(el.$$else.route, 'params', {
    set(params) {
      $context.$route = {
        ...$context.$route,
        params,
      }
    },
  })

  for (const attr in attributes) {
    const a = attributes[attr]
    if (typeof a === 'function') {
      el[attr] = a
    } else if (typeof a === 'boolean') {
      if (a) {
        el.setAttribute(attr, '')
      } else {
        el.removeAttribute(attr)
      }
    } else {
      el.setAttribute(attr, a)
    }
  }

  render(el, nodes, $context)

  el.onmount?.({el, context: $context})

  if (mount) {
    mount.append(el)
  } else {
    return el
  }
}

export {e}
