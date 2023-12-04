function createElement(context) {
  const [tag, children, properties] = context
  const elm = document.createElement(tag)

  if (Array.isArray(children)) {
    children.forEach((c) => {
      elm.append(Array.isArray(c) ? createElement(c) : c)
    })
  } else if (typeof children === "string") {
    elm.append(children)
  }

  for (key in properties) {
    elm[key] = properties[key]
  }

  return elm
}

// Walk the shadow DOM and the live DOM and update the shadow DOM to match the live DOM.
// TODO Find a better name for `live`. It is not the live DOM, but the generated one.
function walk(shadow, live) {
  const lc = Array.from(live.children)

  if (shadow.children.length < lc.length) {
    lc.forEach((x, index) => {
      if (!shadow.children[index]) {
        shadow.append(x.cloneNode(true))
      }
    })
  }

  Array.from(shadow.children).forEach((sChild, index) => {
    const lChild = lc[index]

    // Add children that are not present in the shadow
    if (sChild.children.length < lChild.children.length) {
      const scc = Array.from(sChild.children)
      Array.from(lChild.children).forEach((x, index) => {
        if (!scc[index]) {
          sChild.append(x.cloneNode(true))
        }
      })
    }

    // Remove children that are not present in the live
    if (sChild.children.length > lChild.children.length) {
      const lcc = Array.from(lChild.children)
      Array.from(sChild.children).forEach((x, index) => {
        if (!lcc[index]) {
          x.remove()
        }
      })
    }

    if (sChild.tagName !== lChild.tagName) {
      sChild.replaceWith(lChild.cloneNode(true))
    }

    // Add attributes that are not present in the shadow
    Array.from(lChild.attributes).forEach((attr) => {
      if (sChild.getAttribute(attr.name) !== attr.value) {
        sChild.setAttribute(attr.name, attr.value)
      }
    })
    // Remove attributes that are not present in the live
    Array.from(sChild.attributes).forEach((attr) => {
      if (!lChild.hasAttribute(attr.name)) {
        sChild.removeAttribute(attr.name)
      }
    })

    // Replace text content if it's different and the element has no children
    if (
      sChild.textContent !== lChild.textContent
      && lChild.children.length === 0
      && sChild.children.length === 0
    ) {
      sChild.textContent = lChild.textContent
    }

    walk(sChild, lChild)
  })
}

function watch(obj, key, fn) {
  let path = obj
  let dest = key

  if (key.includes('.')) {
    const parts = key.split('.')

    dest = parts.pop()
    parts.forEach((k) => path = path[k])
  }

  Object.defineProperty(path, dest, {
    set(value) {
      fn(value)
    }
  })
}

function mount({ el, state, view }) {
  const proxy = state ? new Proxy(state, {
    set(obj, prop, value) {
      const s = Reflect.set(obj, prop, value)

      walk(
        view.shadow,
        createElement(
          view({ el, state: obj })
        )
      )

      return s
    }
  }) : {}

  const v = createElement(
    view({ el, state: proxy })
  )

  if (v.children.length > 1) {
    throw new Error('The view must return a single element')
  }

  view.shadow = v

  if (el.children[0]) {
    el.children[0].replaceWith(v)
  } else {
    el.append(v)
  }
}

function router(el, routes) {
  function handler() {
    const { pathname } = window.location
    const route = routes.find((r) => r.path === pathname)

    if (route) {
      const { state, view } = route.handler()

      mount({
        el,
        state,
        view({ el, state }) {
          return view({ el, state, anchor })
        }
      })
    }
  }

  function anchor(text, props) {
    return ['a', text, {
      ...props, onclick: (ev) => {
        ev.preventDefault()
        window.history.pushState({}, '', props.href)

        // call the handler for the new route
        handler()
      }
    }]
  }

  window.addEventListener('popstate', handler)

  // call the handler for the route on page load
  handler()
}

function form(children, props) {
  return ["form", children, props]
}

function input(props) {
  return ["input", "", props]
}

function button(children, props) {
  return ["button", children, props]
}

function p(children, props) {
  return ["p", children, props]
}

function div(children, props) {
  return ["div", children, props]
}

function span(children, props) {
  return ["span", children, props]
}

function ul(children, props) {
  return ["ul", children, props]
}

function li(children, props) {
  return ["li", children, props]
}

function h1(children, props) {
  return ["h1", children, props]
}

function h2(children, props) {
  return ["h2", children, props]
}

function h3(children, props) {
  return ["h3", children, props]
}

function h4(children, props) {
  return ["h4", children, props]
}

function h5(children, props) {
  return ["h5", children, props]
}

function h6(children, props) {
  return ["h6", children, props]
}

export { mount, router, watch, form, input, button, p, div, span, ul, li, h1, h2, h3, h4, h5, h6 }
