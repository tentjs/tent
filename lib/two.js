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
  const proxy = new Proxy(state, {
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
  })

  const v = createElement(view({ el, state: proxy }))

  view.shadow = v
  el.append(v)
}

function form(children, props) {
  return ["form", children, props]
}

function input(props) {
  return ["input", "", props]
}

function button(text, props) {
  return ["button", text, props]
}

function text(text, props) {
  return ["p", text, props]
}

function div(children, props) {
  return ["div", children, props]
}

export { mount, watch, form, input, button, text, div }
