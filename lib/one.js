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
        draw(
          tag,
          tag.view({
            data: setupData(tag, content),
            props: content
          })
        )

        tag.props = newProps

        return tag.rendered.cloneNode(true)
      }
    }

    if (tag.rendered) {
      return tag.rendered.cloneNode(true)
    }

    tag.props = content

    const component = render(tag)

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

function render (component) {
  const { view, onmount } = component

  if (component.rendered) {
    return component
  }

  const $data = setupData(component)

  const el = view({
    data: $data,
    props: component.props
  })

  component.onmount = function () {
    onmount?.({ data: $data, props: component.props })
  }

  el.$one = {
    isComponent: true,
    props: component.props
  }

  component.rendered = el

  return component
}

function setupData (component) {
  const d = typeof component.data === 'object'
    ? component.data
    : component.data?.()

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
  diff(component.rendered, view, component)
}

function diff (dom, view, component) {
  let i = 0

  if (dom.attributes.if != null || dom.attributes.else != null) {
    dom.replaceWith(view)
    component.rendered = view

    return
  }

  for (const vn of view.children) {
    const dn = dom.children[i]

    if (dn?.$one?.isComponent) {
      diff(dn, vn)

      i++
      continue
    }

    if (!dn) {
      dom.append(vn)

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

    diff(dn, vn, component)

    i++
  }
}

function sync (vn, dn, parent) {
  if (!dn) {
    parent.append(vn)

    return
  }

  if (vn.textContent !== dn.textContent && !vn.children.length) {
    dn.textContent = vn.textContent
  }

  if (vn.$one) {
    setAttrs(dn, vn.$one.attrs)
    dn.$one = vn.$one
  }

  if (vn.children.length) {
    Array.from(vn.children).forEach((child, i) => {
      sync(child, dn.children[i], dn)
    })
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
    } else if (el[k] != null || k === 'key') {
      el.setAttribute(k, value)
    }
  }
}

function remove (el, children) {
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
    component.view == null ? component : render(component, component.props).rendered
  )

  component.onmount?.()
}

export { o, render, mount }
