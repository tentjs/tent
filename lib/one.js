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
    } else if (el[k] != null) {
      el.setAttribute(k, value)
    }
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

  // TODO: Create a "onunmount" lifecycle hook that removes the component from the global object

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
  const query = components[name]?.rendered
  if (!query) {
    throw new Error(`The component "${name}" could not be found.`)
  }

  const dom = query.children[0]

  if (!view.children.length) {
    cleanup(dom)
    dom.replaceWith(view)

    return
  }

  diff(dom, view)
}

function diff (dom, view) {
  const tag = dom.tagName.toLowerCase()

  if (components[tag]) {
    return
  }

  let i = 0

  for (const vn of view.children) {
    const dn = dom.children[i]

    if (!dn) {
      cleanup(dom)
      dom.replaceWith(view)

      return
    }

    if (!dn.isEqualNode(vn)) {
      cleanup(dn)
      dn.replaceWith(vn.cloneNode(true))
    }

    diff(dn, vn)

    i++
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
    component.view == null ? component : render(component, component.props)
  )

  component.onmount?.()
}

export { o, render, mount }
