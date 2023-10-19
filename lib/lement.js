export function L(as, nodes = [], opts = {}) {
  const {mount, data, layout, ...attributes} = opts
  const el = document.createElement(as)
  for (const attr in attributes) {
    const a = attributes[attr]
    if (typeof a === 'function') {
      el[attr] = data != null ? a.bind(data) : a
    } else {
      if (typeof a === 'boolean') {
        if (a) {
          el.setAttribute(attr, '')
        } else {
          el.removeAttribute(attr)
        }
      } else {
        el.setAttribute(attr, a)
      }
    }
  }
  const $data = data
    ? new Proxy(data, {
        get(target, key) {
          return target[key]
        },
        set(target, key, value) {
          const s = Reflect.set(target, key, value)
          render()
          return s
        },
      })
    : null
  const render = () => {
    const children =
      typeof nodes === 'function' ? nodes({data: $data}) : Array.from(nodes)
    if (el.children.length === 0) {
      for (const c of children) {
        el.append(typeof c === 'function' ? c({data: $data}) : c)
      }
      return
    }

    function t(children, compare) {
      let i = 0
      for (const child of children) {
        const dom = compare.children[i]
        if (typeof child === 'function') {
          const c = child({data: $data})
          if (dom && !dom.isEqualNode(c)) {
            dom.replaceWith(c)
          }
          t(Array.from(c.children), c)
          i++
          continue
        }
        if (dom && !dom.isEqualNode(child)) {
          if (dom.children.length === 0) {
            dom.replaceWith(child)
          }
          const domChildren = Array.from(dom.children)
          const childChildren = Array.from(child.children)
          if (childChildren.length > domChildren.length) {
            let j = 0
            for (const c of childChildren) {
              if (!domChildren[j]) {
                dom.append(c)
              }
              j++
            }
          }
          if (domChildren.length > childChildren.length) {
            let j = 0
            for (const c of domChildren) {
              if (!childChildren[j]) {
                for (const attr of c.attributes) {
                  if (attr.name.startsWith('on')) {
                    c[attr.name] = null
                  }
                }
                c.remove()
              }
              j++
            }
          }
          t(childChildren, dom)
        }
        i++
      }
    }

    t(children, el)
  }
  render()
  if (mount) {
    mount.append(el)
  } else {
    return el
  }
}

export function R(routes, opts = {}) {
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
    }
    const layout = route.layout ?? opts.layout
    if (layout) {
      const mount = layout.querySelector('[view]')
      if (!mount) {
        throw new Error(
          `When using "layout" it is required to specify "view" in the targets options.`
        )
      }
      if (mount.children.length > 1) {
        throw new Error('Mount point must have only one child')
      }
      if (mount.children.length === 0) {
        mount.append(route.component)
      } else {
        mount.children[0].replaceWith(route.component)
      }
    }
    const el = layout || route.component
    const current = app.children?.[0]
    if (current && !current.isEqualNode(el)) {
      current.replaceWith(el)
    } else {
      app.append(el)
    }
  }
}
