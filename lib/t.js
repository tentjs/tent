function component(name, fn) {
  const v = fn()
  const el = document.createElement(name)

  el.$e = {
    view: fn,
    name,
  }

  prepare(name, v)

  el.append(v)

  document.body.append(el)
}

function prepare(name, el) {
  function go(el) {
    el.$e = {
      ...el.$e,
      name,
    }
    if (el.children) {
      Array.from(el.children).forEach((x) => go(x))
    }
  }

  go(el)

  return el
}

function t(as, content, attrs) {
  const el = document.createElement(as)

  for (const k in attrs) {
    const attr = attrs[k]

    // TODO: Clean up the attribute functions on cleanup
    // i.e el[k] = null
    el[k] = function (ev) {
      attr(ev)

      let view = null

      function bubble(el) {
        if (el.$e.view) {
          view = el.$e.view
          return
        }
        if (el.parentNode) {
          bubble(el.parentNode)
        }
      }

      bubble(el)

      if (view) {
        render(el.$e.name, view)
      }
    }
  }

  el.append(...(typeof content === 'string' ? [content] : content))

  return el
}

function render(name, view) {
  const dom = document.getElementsByTagName(name)

  if (!dom.length) {
    throw new Error(`The component "${name}" is not in view.`)
  }

  Array.from(dom).forEach((d) => {
    Array.from(prepare(name, view()).children).forEach((vn, i) => {
      const dc = d.children[0].children[i]

      if (!dc.isEqualNode(vn)) {
        dc.replaceWith(vn)
      }
    })
  })
}

export {component, prepare, t}
