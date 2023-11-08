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

  el.append(...(typeof content === 'string' ? [content] : content))

  return el
}

function render(component, props) {
  const { data, name, view, before, onmount } = component
  const el = document.createElement(name)

  if (before) {
    const befores = before()
    for (const prop in befores) {
      const b = befores[prop]
      if (b instanceof Promise) {
        b.then((res) => {
          data[prop] = res
        })
      } else {
        data[prop] = b
      }
    }
  }

  component.onmount = function () {
    onmount?.()
    if (before) {
      // TODO: Is there another way to wait for "next draw"?
      setTimeout(() => draw(name, view({ data, props })), 0)
    }
  }

  const $data = new Proxy(data, {
    set(target, key, value) {
      const s = Reflect.set(target, key, value)
      draw(name, view({ data: target, props }))
      return s
    },
  })

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

    if (!dn.isEqualNode(vn)) {
      dn.replaceWith(vn.cloneNode(true))
      cleanup(dn)
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
  component.onmount?.()
}

export { t, render, mount }
