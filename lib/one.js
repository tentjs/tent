const components = {}

function o (tag, content, attrs) {
  if (Object.prototype.hasOwnProperty.call(tag, 'view')) {
    if (content != null && typeof content !== 'object') {
      throw new Error(
        'The second argument of the o function must be an object, when you pass another component as the first argument.'
      )
    }

    if (tag.props) {
      const oldProps = tag.props
      const newProps = content
      const keys = Object.keys(oldProps)

      const changed = keys.length !== Object.keys(newProps).length ||
        keys.some((key) => oldProps[key] !== newProps[key])

      if (changed) {
        const rendered = tag.view({
          data: setupData(tag, attrs),
          props: content
        })
        draw(
          tag,
          rendered
        )

        tag.props = newProps
        tag.attrs = attrs

        return rendered
      }
    }

    if (tag.rendered && !attrs?.redraw) {
      const cache = tag.rendered.cloneNode(true)
      sync(tag.rendered, cache, tag.rendered)
      return cache
    }

    tag.props = content
    tag.attrs = attrs

    const component = render(tag, attrs)
    component.onmount()

    return component.rendered
  }

  const el = document.createElement(tag)

  setAttrs(el, attrs)

  el.$one = {
    attrs: attrs || {}
  }

  el.append(...(Array.isArray(content) ? content : [content]))

  return el
}

function render (component, attrs) {
  const { view, onmount } = component

  if (!component.name) {
    throw new Error('One.render(): The component must have a name.')
  }

  if (component.rendered && !attrs?.redraw) {
    return component
  }

  if (typeof component.data === 'function' && !component.dataFn) {
    component.dataFn = component.data
  }
  const $data = setupData(component, attrs)

  const el = view({
    data: $data,
    props: component.props
  })

  component.onmount = function () {
    onmount?.({ data: $data, props: component.props })
  }

  el.$one = {
    name: component.name,
    isComponent: true,
    props: component.props,
    attrs
  }

  component.rendered = el

  components[component.name] = component

  return component
}

function setupData (component, attrs) {
  let d = typeof component.data === 'object'
    ? component.data
    : component.data?.()

  if (attrs?.redraw && component.dataFn) {
    d = component.dataFn()
  }

  const $data = d
    ? new Proxy(d, {
      set (target, key, value) {
        const s = Reflect.set(target, key, value)

        draw(
          component,
          component.view({
            data: $data,
            props: component.props
          })
        )
        component.data = target

        return s
      }
    })
    : null

  return $data
}

function draw (component, view) {
  if (!component.rendered) {
    throw new Error('The component could not be found.')
  }

  remove(component.rendered, view.children)
  diff(component.rendered, view)
}

function diff (dom, view) {
  let i = 0

  if (view.children.length > dom.children.length) {
    append(dom, view.children)
  }

  for (const vn of view.children) {
    const dn = dom.children[i]

    if (dn?.$one?.attrs?.redraw) {
      dn.replaceWith(vn)

      i++
      continue
    }

    if (dn?.isEqualNode(vn)) {
      i++
      continue
    }

    if (!dn) {
      dom.append(vn)

      i++
      continue
    }

    if (dn.$one?.isComponent && vn.$one?.isComponent) {
      const cmp = components[vn.$one.name]
      const rendered = cmp.rendered.cloneNode(true)

      sync(vn, rendered, dom)
      dn.replaceWith(rendered)

      cmp.rendered = rendered

      i++
      continue
    }

    if (dn.tagName !== vn.tagName) {
      dn.replaceWith(vn)

      i++
      continue
    }

    if (!dn.isEqualNode(vn)) {
      sync(vn, dn, dom)
    }

    diff(dn, vn)

    i++
  }
}

function sync (from, to, parent) {
  if (!to) {
    parent.append(from)

    return
  }

  if (from.textContent !== to.textContent && !from.children.length) {
    to.textContent = from.textContent
  }

  if (from.$one) {
    setAttrs(to, from.$one.attrs)
    to.$one = from.$one
  }

  if (from.children.length) {
    Array.from(from.children).forEach((child, i) => {
      sync(child, to.children[i], to)
    })
  }

  if (components[from.$one?.name]) {
    components[from.$one.name].rendered = to
  }
}

function setAttrs (el, attrs) {
  for (const k in attrs) {
    const value = attrs[k]

    if (typeof value === 'function') {
      el[k] = value
    } else if (typeof value === 'boolean') {
      if (value) {
        el.setAttribute(k, '')
      } else {
        el.removeAttribute(k)
      }
    } else if (k === 'value') {
      el.value = value
    } else {
      el.setAttribute(k, value)
    }
  }
}

function append (dom, view) {
  if (dom.children.length < view.length) {
    dom.append(...view)
  }

  if (dom.children.length && view.length) {
    let i = 0
    for (const c of dom.children) {
      append(c, view[i].children)
      i++
    }
  }
}

function remove (el, children) {
  if (el?.$one.isComponent) {
    return
  }

  if (el.children.length > children.length) {
    Array.from(el.children).forEach((child, i) => {
      if (!children[i]) {
        cleanup(child)
        el.removeChild(child)
      }
    })
  }

  if (el.children.length && children.length) {
    let i = 0
    for (const c of el.children) {
      remove(c, children[i].children)
      i++
    }
  }
}

function cleanup (el) {
  for (const prop in el) {
    if (prop.startsWith('on') && typeof el[prop] === 'function') {
      el[prop] = null
    }
  }

  if (el.children.length) {
    Array.from(el.children).forEach((c) => cleanup(c))
  }
}

function mount (component, where) {
  where.append(
    component.view == null ? component : render(component, component.attrs).rendered
  )

  component.onmount?.()
}

if (process.env.NODE_ENV !== 'production') {
  window.$one = {
    components
  }
}

export { o, render, mount }
