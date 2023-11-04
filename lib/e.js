import {render} from './render'
import {setOnRouteChange} from './router'
import {createUniqueId} from './utils'

function e(as, nodes = [], opts = {}) {
  const {mount, data, layout, onroutechange, ...attributes} = opts
  const el = document.createElement(as)

  el.$else = {
    id: createUniqueId(),
    attrs: null,
  }

  const context = data == null ? {} : data()
  for (const prop in context) {
    if (prop.startsWith('$')) {
      throw new Error(`Cannot use reserved property name: ${prop}`)
    }
  }

  const $context = new Proxy(context, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      if (!target.hasOwnProperty(key)) {
        throw new Error(`Cannot set non-existent property: ${key}`)
      }
      if (
        typeof value !== 'object' &&
        typeof value !== 'function' &&
        target[key] === value
      ) {
        return true
      }
      const s = Reflect.set(target, key, value)
      render(el, nodes, $context)
      return s
    },
  })

  if (onroutechange) {
    setOnRouteChange({key: el.$else.id, context: $context, cb: onroutechange})
  }

  for (const attr in attributes) {
    const a = attributes[attr]
    if (typeof a === 'function') {
      if (attr.startsWith('on')) {
        el[attr] = a
      } else {
        el.$else.attrs = {
          ...el.$else.attrs,
          [attr]: a,
        }
        el.setAttribute(attr, a({context: $context}))
      }
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
