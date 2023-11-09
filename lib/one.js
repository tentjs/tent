function o (as, content, attrs) {
  if (as.hasOwnProperty('view')) {
    if (content != null && typeof content !== 'object') {
      throw new Error(
        'The second argument of the o function must be an object, when you pass another component as the first argument.'
      )
    }

    return render(as, content)
  }

  const el = document.createElement(as)

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

  component.onmount = function () {
    onmount?.({ data: $data, props })
  }

  /**
   * @constant errors
   * @type {Array<unknown>}
   * Contains all errors that are thrown in the prepare function.
   * They are made available in the view function so the user can,
   * decide how to handle them.
  */
  const errors = []

  const $data = data
    ? new Proxy(data(), {
      set (target, key, value) {
        const s = Reflect.set(target, key, value)

        draw(name, view({ data: $data, props, errors }))

        return s
      }
    })
    : null

  el.append(view({ data: $data, props, errors }))

  return el
}

function draw (name, view) {
  const query = document.querySelector(name)
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
