function t(as, content, attrs) {
  if (as.hasOwnProperty('view')) {
    return render(as, content)
  }

  const el = document.createElement(as)

  for (const k in attrs) {
    const value = attrs[k]

    if (typeof value === 'function') {
      el[k] = function (ev) {
        value(ev)
      }
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

function render(component, props) {
  const { data, name, view, prepare } = component
  const el = document.createElement(name)

  /**
   * @constant errors
   * @type {Array<unknown>}
   * Contains all errors that are thrown in the prepare function.
   * They are made available in the view function so the user can,
   * decide how to handle them.
  */
  const errors = []

  const $data = data ? new Proxy(data(), {
    set(target, key, value) {
      const s = Reflect.set(target, key, value)
      draw(name, view({ data: $data, props, errors }))
      return s
    },
  }) : null

  if (prepare) {
    if ($data == null) {
      throw new Error(
        'The prepare function can only be used when a data function is present.'
      )
    }

    const prepares = prepare()
    for (const prop in prepares) {
      const pre = prepares[prop]
      if (pre instanceof Promise) {
        pre.then((res) => {
          $data[prop] = res
        }).catch((err) => {
          errors.push(err)
          $data[prop] = null
        })
      } else {
        $data[prop] = pre
      }
    }
  }

  el.append(view({ data: $data, props, errors }))

  return el
}

function draw(name, view) {
  const query = document.querySelector(name)
  if (!query) {
    throw new Error(`The component "${name}" could not be found.`)
  }

  const dom = query.children[0]

  // TODO: This is a very naive implementation of diffing.
  // If the view have additional children, they should be added. 
  // If the view have less children, they should be removed.
  // Right now it just replaces the whole thing, which means that the state, of the dom elements are lost.
  // i.e.: An input with a value will be reset, since the input is re-rendered.
  if (
    !view.children.length ||
    (dom.children.length !== view.children.length)
  ) {
    cleanup(dom)
    dom.replaceWith(view)
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

    i++
  }
}

function cleanup(el) {
  for (const prop in el) {
    if (prop.startsWith('on') && typeof el[prop] === 'function') {
      el[prop] = null
    }
  }

  if (el.children.length) {
    Array.from(el.children).forEach((c) => cleanup(c))
  }
}

function mount(component, where) {
  where.append(
    component.view == null ? component : render(component, component.props)
  )
}

export { t, render, mount }
