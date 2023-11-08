function t(as, content, attrs) {
  if (typeof as === 'object') {
    return render(as, content)
  }

  const el = document.createElement(as)

  el.$e = {
    key: null,
    attrs: null,
  }

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
      if (el.$e.attrs == null) {
        el.$e.attrs = {}
      }
      el.$e.attrs[k] = value
      el.setAttribute(k, value)
    } else if (k === 'key') {
      el.$e.key = value
    }
  }

  el.append(...(Array.isArray(content) ? content : [content]))

  return el
}

function render(component, props) {
  const { data, name, view, before } = component
  const el = document.createElement(name)

  const $data = new Proxy(data, {
    set(target, key, value) {
      const s = Reflect.set(target, key, value)
      draw(name, view({ data: $data, props }))
      return s
    },
  })

  if (before) {
    const befores = before()
    for (const prop in befores) {
      const b = befores[prop]
      if (b instanceof Promise) {
        b.then((res) => {
          $data[prop] = res
        })
        // TODO: Add catch clause, and put the error object in $data[prop],
        // so that the user can handle that. However, that might be annoying to work with,
        // since you expect to have data[prop] right away?
        // On the other hand, that would force consumers to handle errors better, which is a good thing.
        // if (data[prop].error) { ... }
      } else {
        $data[prop] = b
      }
    }
  }

  el.append(view({ data: $data, props }))

  return el
}

function draw(name, view) {
  const dom = document.querySelector(name)

  if (!dom) {
    throw new Error(`The component "${name}" could not be found.`)
  }

  let i = 0
  for (const vn of view.children) {
    const dn = dom.children[0].children[i]

    if (!dn) {
      cleanup(dom.children[0])
      dom.children[0].replaceWith(view)
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

  el.$e = null

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
