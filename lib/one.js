const components = {}

function o (tag, content, attrs) {
  if (Object.prototype.hasOwnProperty.call(tag, 'view')) {
    if (content != null && typeof content !== 'object') {
      throw new Error(
        'The second argument of the o function must be an object, when you pass another component as the first argument.'
      )
    }

    if (components[tag.name]) {
      // TODO: Check if the components props (if any) have changed,
      // and if so, re-render the component
      // Keep in mind that when re-rendering the component, the component
      // could have changes in its data object, so we need to keep track of that
      console.log('component', components[tag.name].props, content)
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

  components[name] = {
    ...component,
    rendered: el,
    props
  }

  component.onmount = function () {
    onmount?.({ data: $data, props })
  }

  // TODO: Create a onunmount function that removes the component from the global object

  const $data = data
    ? new Proxy(data(), {
      set (target, key, value) {
        const s = Reflect.set(target, key, value)

        draw(name, view({ data: $data, props }))

        return s
      }
    })
    : null

  el.append(view({ data: $data, props }))

  components[name].rendered = el

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
  const tag = dom.tagName.toLowerCase()
  // TODO: What should happen if the dom node is a component?
  // I guess the component should update if it has props?
  // How to get the constructor object of a component from the dom node?
  // Either the dom node has a .$one property with relevant info
  // Or, when the component is mounted, it adds itself to a global object
  if (components[tag]) {
    console.log('component', components[tag])
    return
  }

  let i = 0

  for (const vn of view.children) {
    const dn = dom.children[i]

    if (!dn) {
      cleanup(dom)
      console.log('REPLACE ENTIRE DOM', dn, vn)
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
