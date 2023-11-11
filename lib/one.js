const components = {}

function o (tag, content, attrs) {
  if (Object.prototype.hasOwnProperty.call(tag, 'view')) {
    if (content != null && typeof content !== 'object') {
      throw new Error(
        'The second argument of the o function must be an object, when you pass another component as the first argument.'
      )
    }

    if (components[tag.name]) {
      if (components[tag.name].props) {
        const oldProps = components[tag.name].props
        const newProps = content
        const keys = Object.keys(oldProps)
        if (keys.length !== Object.keys(newProps).length) {
          return render(tag, newProps)
        }
        for (const key of keys) {
          if (oldProps[key] !== newProps[key]) {
            return render(tag, newProps)
          }
        }
      }

      return components[tag.name].rendered
    }

    const rendered = render(tag, content)

    tag.onmount?.({ data: tag.data, props: content })

    return rendered
  }

  const el = document.createElement(tag)

  setAttrs(el, attrs)

  el.$one = {
    attrs: attrs || {}
  }

  el.append(...(Array.isArray(content) ? content : [content]))

  return el
}

function render (component, props) {
  const { data, name, view, onmount } = component
  const el = document.createElement(name)

  if (!components[name]) {
    components[name] = {
      ...component,
      rendered: null,
      mounted: false,
      props
    }
  }

  component.onmount = function () {
    if (components[name].mounted) {
      return
    }
    onmount?.({ data: $data, props })
    components[name].mounted = true
  }

  const d = typeof components[name].data === 'object'
    ? components[name].data
    : data?.()
  const $data = d
    ? new Proxy(d, {
      set (target, key, value) {
        const s = Reflect.set(target, key, value)

        draw(name, view({ data: $data, props }))
        components[name].data = target

        return s
      }
    })
    : null

  el.append(view({ data: $data, props }))

  components[name].rendered = el

  return el
}

function draw (name, view) {
  const rendered = document.querySelector(name)
  if (!rendered) {
    throw new Error(`The component "${name}" could not be found.`)
  }

  diff(rendered.children[0], view)
}

function diff (dom, view) {
  if (components[dom.tagName.toLowerCase()]) {
    return
  }

  let i = 0

  // TODO: Handle elements rendered in a loop
  // Remove elements from the DOM that are not in the view anymore

  for (const vn of view.children) {
    const dn = dom.children[i]

    if (!dn) {
      const clone = vn.cloneNode(true)

      sync(vn, clone, dom)
      dom.append(clone)

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
    } else if (el[k] != null || k === 'key') {
      el.setAttribute(k, value)
    }
  }
}

function mount (component, where) {
  where.append(
    component.view == null ? component : render(component, component.props)
  )

  component.onmount?.()
}

export { o, render, mount }
