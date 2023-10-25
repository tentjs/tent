import { createUUID, getStyles, getChildren } from './utils'

const uuids = []
const cachedStyles = new Map()

function L(as, nodes = [], opts = {}) {
  const { mount, data, layout, styles, props, ...attributes } = opts
  const el = document.createElement(as)

  const d = data == null ? {} : data()
  if (props) {
    d.props = {}

    el.props = el.props ?? {}
  }

  const stringStyles = JSON.stringify(styles)
  const existingStyles = getStyles(stringStyles, cachedStyles)
  if (existingStyles) {
    attributes[existingStyles] = true
  } else if (styles && existingStyles == null) {
    const uuid = `l-${createUUID(uuids)}`
    const styleEl = document.createElement('style')

    styleEl.id = uuid
    attributes[uuid] = true
    cachedStyles.set(uuid, stringStyles)

    const res = {}
    for (const k in styles) {
      const val = styles[k]
      if (typeof val !== 'object') {
        res[`[${uuid}]`] = {
          ...res[`[${uuid}]`],
          [k]: val,
        }
        delete styles[k]
      }
    }

    function t(obj, root = []) {
      for (const k in obj) {
        const val = obj[k]
        if (typeof val === 'object') {
          root.push(k)
          res[`[${uuid}] ${root.join(' ')}`] = val
          if (t(val, root)) root = []
        }
      }
      return true
    }

    t(styles)

    for (const k in res) {
      const val = res[k]
      if (typeof val !== 'object') {
        styleEl.append(`${k}:${val};`)
      } else {
        styleEl.append(`${k} {`)
        for (const k in val) {
          const v = val[k]
          if (typeof v !== 'object') {
            styleEl.append(`${k}:${v};`)
          }
        }
        styleEl.append(`}`)
      }
    }

    styleEl.textContent = styleEl.textContent.replace(/\s+/g, ' ')

    document.head.append(styleEl)
  }

  const $data = new Proxy(d, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      const s = Reflect.set(target, key, value)
      render()
      return s
    },
  })

  if (props && Array.isArray(props)) {
    for (const prop of props) {
      Object.defineProperty(el.props, prop, {
        set(newValue) {
          if ($data.props[prop] !== newValue) {
            $data.props = {
              ...$data.props,
              [prop]: newValue,
            }
          }
        },
      })
    }
  }

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

  function render() {
    const children = getChildren(nodes, $data, true)

    if (el.children.length === 0 && !el.childNodes.length) {
      if (Array.isArray(children)) {
        for (const c of children) {
          el.append(getChildren(c, $data))
        }
      } else {
        // L('div', ['Some text']) / L('div', 'Some text')
        el.append(getChildren(children, $data))
      }
      return
    } else if (el.children.length === 0 && el.childNodes.length) {
      // L('div', ['Some text']) / L('div', 'Some text')
      el.textContent = Array.isArray(children) ? children[0] : children
    }

    function traverse(children, compare) {
      let i = 0
      for (const child of children) {
        let domReplaced = false
        const dom = compare.children[i]
        if (typeof child === 'function') {
          const c = child({ data: $data })
          if (dom && !dom.isEqualNode(c)) {
            dom.replaceWith(c)
          }
          traverse(Array.from(c.children), c)
          i++
          continue
        }
        if (
          dom &&
          child &&
          ((dom instanceof HTMLElement && !(child instanceof HTMLElement)) ||
            (!(dom instanceof HTMLElement) && child instanceof HTMLElement))
        ) {
          console.error(dom, child)
          throw new Error(
            "You can't have a text node and an element node at the same level"
          )
        }
        if (dom && !dom.isEqualNode(child)) {
          if (dom.children.length === 0) {
            dom.replaceWith(child)
            domReplaced = true
          }
          if (child.attributes.length) {
            for (const attr of child.attributes) {
              if (!attr.name.startsWith('l-')) {
                const found = dom.attributes.getNamedItem(attr.name)
                if (!found || attr.value != found.value) {
                  dom.setAttribute(attr.name, attr.value)
                }
              }
            }
          }
          const domChildren = Array.from(dom.children)
          const childChildren = Array.from(child.children)
          if (childChildren.length > domChildren.length) {
            let j = 0
            for (const c of childChildren) {
              if (!domChildren[j]) {
                if (domReplaced) {
                  child.append(c)
                } else {
                  dom.append(c)
                }
              }
              j++
            }
          }
          if (domChildren.length > childChildren.length) {
            let j = 0
            for (const c of domChildren) {
              if (!childChildren[j]) {
                c.remove()
              }
              j++
            }
          }
          traverse(childChildren, dom)
        }
        i++
      }
    }

    traverse(children, el)
  }

  render()

  if (el.onmount) {
    el.onmount({ el, data: $data })
  }

  if (mount) {
    mount.append(el)
  } else {
    return el
  }
}

function R(routes, opts = {}) {
  const app = opts.root ?? document.body
  if (!app) {
    throw new Error('No root element found')
  }

  window.onload = router
  window.onhashchange = router

  function router() {
    const hash = window.location.hash
    const route = routes.find((r) => r.path === hash)
    if (!route) {
      if (opts.fallback) {
        window.location.hash = opts.fallback
      }
      return
    }

    const layout = route.layout ?? opts.layout
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

    const l = layout || route.component
    const el = getChildren(l)
    const current = app.children?.[0]
    if (current && !current.isEqualNode(el)) {
      current.replaceWith(el)
    } else {
      app.append(el)
    }
  }
}

function Link(opts = {
  href: '/',
  text: 'Link'
}) {
  return L('a', opts.text, {
    href: opts.href,
    onclick(ev) {
      ev.preventDefault()
      history.pushState(null, null, ev.target.href)
    }
  })
}

export { L, R, Link }
