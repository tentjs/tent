/**
  * @param {[tag: string, children: HTMLElement[]|string, attributes: object]} context
  * @returns {HTMLElement} The element
  * @example
  * ```js
  * createElement(["div", "Hello, world!", { id: "app" }])
  * ```
  */
function createElement([tag, children, attributes]) {
  const elm = document.createElement(tag)

  if (Array.isArray(children)) {
    children.forEach((c) => {
      elm.append(Array.isArray(c) ? createElement(c) : c)
    })
  } else if (typeof children === "string") {
    elm.append(children)
  }

  for (key in attributes) {
    elm[key] = attributes[key]
  }

  return elm
}

/**
  * @param {HTMLElement} shadow The shadow DOM
  * @param {HTMLElement} live The live DOM
  * @todo Find a better name for `live`. It is not the live DOM, but the generated one.
  */
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

/**
  * @param {object} obj The object to watch
  * @param {string} key The key to watch, can be a path like `user.name`
  * @param {function} fn The function to call when the value changes
  * @todo Add a way to unwatch
  */
function watch(obj, key, fn) {
  let path = obj
  let dest = key

  if (path.includes('.')) {
    const parts = path.split('.')

    dest = parts.pop()
    parts.forEach((k) => path = path[k])
  }

  Object.defineProperty(path, dest, {
    set(value) {
      fn(value)
    }
  })
}

/**
  * @param {{ el: HTMLElement, state: object, view: function }} context
  * @todo Add a way to hook into unmouting
  */
function mount({ el, state, view }) {
  const proxy = state ? new Proxy({ ...state }, {
    set(obj, prop, value) {
      const s = Reflect.set(obj, prop, value)

      walk(
        el.$one.shadow,
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

  el.$one = { shadow: v }

  if (el.children[0]) {
    el.children[0].replaceWith(v)
  } else {
    el.append(v)
  }
}

/**
  * @param {HTMLElement} el The element to mount to
  * @param {array} routes The routes to match
  * @todo Add a way to have dynamic routes, like /users/:id
  */
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

  function anchor(text, attrs) {
    return ['a', text, {
      ...attrs, onclick: (ev) => {
        ev.preventDefault()
        window.history.pushState({}, '', attrs.href)

        // call the handler for the new route
        handler()
      }
    }]
  }

  window.addEventListener('popstate', handler)

  // call the handler for the route on page load
  handler()
}

/**
  * A helper method to add classes conditionally.
  * @param {string[]} classes
  * @example
  * ```js
  * classNames(
  *   'class-1',
  *   true && 'class-2',
  *   false && 'class-3',
  * )
  * ```
  */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function form(children, attrs) {
  return ["form", children, attrs]
}

function input(attrs) {
  return ["input", "", attrs]
}

function button(children, attrs) {
  return ["button", children, attrs]
}

function p(children, attrs) {
  return ["p", children, attrs]
}

function div(children, attrs) {
  return ["div", children, attrs]
}

function span(children, attrs) {
  return ["span", children, attrs]
}

function ul(children, attrs) {
  return ["ul", children, attrs]
}

function ol(children, attrs) {
  return ["ol", children, attrs]
}

function li(children, attrs) {
  return ["li", children, attrs]
}

function h1(children, attrs) {
  return ["h1", children, attrs]
}

function h2(children, attrs) {
  return ["h2", children, attrs]
}

function h3(children, attrs) {
  return ["h3", children, attrs]
}

function h4(children, attrs) {
  return ["h4", children, attrs]
}

function h5(children, attrs) {
  return ["h5", children, attrs]
}

function h6(children, attrs) {
  return ["h6", children, attrs]
}

export {
  mount,
  router,
  watch,
  classNames,
  form,
  input,
  button,
  p,
  div,
  span,
  ul,
  ol,
  li,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
}
