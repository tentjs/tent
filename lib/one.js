'use strict'

const components = {}
const store = {
  state: {},
  get length () { return Object.keys(store.state).length },
  get (key) {
    return store.state[key]
  },
  set (key, value) {
    if (!store.state[key]) {
      throw new Error(`One->store: You can't set "${key}", since it wasn't defined on initialization.`)
    }

    store.state[key] = value

    for (const k in components) {
      const component = components[k]
      if (!component) {
        continue
      }

      component.forEach(c => {
        if (
          c.template?.includes(`$store.${key}`) ||
          c.el.textContent.includes(`$store.${key}`)
        ) {
          // TODO: Find a way to optimize that the component would re-render twice,
          // if it's got an event AND is using the store.
          // The value would probably be the same, so it wouldn't make any DOM mutations,
          // but the equality check would still be run.
          render(c)
        }
      })
    }
  }
}

let uid = 0

function one (config) {
  const els = config.parent
    ? config.parent.el.querySelectorAll(config.name)
    : document.querySelectorAll(config.name)

  Array.from(els).forEach(el => {
    const { setup, ...c } = createInstance({
      ...config,
      state: { ...config.state },
      store: Object.freeze({
        get: store.get,
        set: store.set,
        length: store.length
      }),
      el
    })

    template(c)

    if (config.components) {
      config.components.forEach(component => {
        one({
          ...component,
          parent: c
        })
      })
    }

    if (setup) {
      setup({
        state: c.state,
        props: c.props,
        parent: c.parent,
        store: { get: store.get, set: store.set, length: store.length },
        query: query.bind(c),
        computed: computed.bind(c)
      })
    }

    render(c)
  })
}

function template (config) {
  // FIXME: Shouldn't bail when there's no template.
  // The user could've defined the template in HTML.
  // i.e.: config.el.children...
  if (!config.template) return

  const tmpl = document.createElement('template')
  tmpl.innerHTML = config.template

  if (tmpl.content.children.length !== 1) {
    throw new Error('One->template: You can only have exactly one root element in your template.')
  }

  const clone = tmpl.content.children[0].cloneNode(true)
  const component = components[config.name].find(c => c.uid === config.uid)

  clone.$one = config.el.$one

  for (const attr of config.el.attributes) {
    if (config.props[attr.name]) continue
    clone.setAttribute(attr.name, attr.value)
  }

  config.el.replaceWith(clone)
  config.el = clone

  component.el = clone

  tmpl.remove()
}

function createInstance (config) {
  const name = config.name
  const el = config.el

  if (el.$one) {
    return components[name].find(c => c.uid === el.$one.uid)
  }

  if (!components[name]) {
    components[name] = []
  }

  uid = uid + 1
  config.uid = uid

  el.$one = {
    uid,
    props: {},
    state: config.state,
    parent: config.parent
  }

  const props = {}
  if (config.props) {
    config.props.forEach(prop => {
      const val = el.getAttribute(prop)

      if (val) {
        if (config.props[prop] == null) {
          props[prop] = val
        }
        el.$one.props[prop] = val
      }
    })
  }
  config.props = Object.freeze({ ...props })

  config.computed = {}

  components[name].push(config)

  return config
}

function query (selector) {
  const el = this.el.children.length
    ? this.el.querySelector(selector)
    : this.el

  if (!el) {
    throw new Error(`One->query: No element was found for "${selector}"`)
  }

  el.on = on.bind(this, el)
  el.if = fi.bind(this, el)
  el.for = loop.bind(this, el)

  return el
}

function on (el, name, handler) {
  el[`on${name}`] = async () => {
    await handler({
      store: { get: store.get, set: store.set, length: store.length },
      props: this.props,
      state: this.state
    })

    if (this.computed) {
      for (const k in this.computed) {
        this.state[k] = this.computed[k]({
          state: this.state,
          props: this.props,
          store: this.store
        })
      }
    }

    render(this)
  }
}

function loop (el, [items, key], fn, parent = null) {
  const parentNode = parent ?? el.parentNode
  const arr = this.state[items] ?? this.parent?.state?.[items]

  parentNode.$one = {
    ...parentNode.$one,
    store: this.store,
    state: this.state,
    loop: { parent: parentNode, el, items, key, fn }
  }

  // `parent` will only be defined if it's a re-render.
  // Or, if the user defines it, which should be discouraged.
  if (parent) {
    Array.from(parentNode.children).forEach((child) => {
      const k = child.$one?.key
      if (!k) { return }
      if (!arr.find(x => x[key] === k)) {
        child.remove()
      }
    })
  }

  parentNode.setAttribute('o-for', '')

  if (arr.length === 0) {
    el.remove()
  }

  arr.forEach((item, index) => {
    const clone = el.cloneNode(true)

    if (!item[key]) {
      throw new Error(`One->for: The key "${key}" does not exist on ${JSON.stringify(item)}`)
    }

    el.remove()

    clone.$one = {
      key: item[key],
      el: clone,
      state: item,
      store: this.store
    }

    clone.on = on.bind(clone.$one, clone)
    clone.if = fi.bind(clone.$one, clone)
    clone.for = loop.bind(clone.$one, clone)

    render(clone.$one)

    if (parentNode.children[index]) {
      render(parentNode.children[index].$one)
    } else {
      parentNode.append(clone)
    }

    if (fn) {
      fn({ el: clone, item })
    }
  })
}

function fi (el) {
  let original

  const container = document.createElement('one-if')
  const template = document.createElement('template')
  const sibling = el.nextSibling

  return {
    hide () {
      if (original) { return }

      template.append(el)
      container.append(template)

      sibling.parentNode.insertBefore(container, sibling)

      original = container
    },
    show () {
      original.replaceWith(el)
      original = null
    }
  }
}

function computed (name, fn) {
  if (this.state[name] != null) {
    throw new Error(`One->computed: You already have a state property called "${name}".`)
  }
  if (this.computed[name] != null) {
    throw new Error(`One->computed: You already have a computed property called "${name}".`)
  }

  this.state[name] = fn({
    state: this.state,
    props: this.props,
    store: this.store
  })

  this.computed[name] = fn
}

function render (config) {
  traverse(config.el, config)
}

function traverse (el, config) {
  Array.from(el.attributes).forEach(attr => {
    if (attr.name === 'o-text') {
      const val = value(attr.value, config)

      if (val != null && el.textContent !== val) {
        el.textContent = val
      }
    }

    if (attr.name === 'o-for') {
      const { el: elm, items, key, fn, parent } = el.$one.loop
      loop.bind(config)(elm, [items, key], fn, parent)
    }
  })

  if (el.children.length) {
    Array.from(el.children).forEach(c => {
      if (c.$one?.uid) { return }
      traverse(c, config)
    })
  }
}

// TODO: Support for nested keys, like `foo.bar.baz`.
function value (key, config) {
  const fromStore = key.startsWith('$store.')
  const fromProps = key.startsWith('$props.')

  if (fromStore) {
    if (config.store.length === 0) {
      throw new Error('One->value: You are trying to access a $store value, but no store was passed to the component.')
    }

    return config.store.get(key.replace('$store.', ''))
  }

  if (fromProps) {
    if (config.props == null) {
      throw new Error('One->value: You are trying to access a $props value, but the component have no props.')
    }

    return config.props[key.replace('$props.', '')]
  }

  return config.state[key]
}

function createStore (fn) {
  store.state = fn()
}

function html (strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const val = values[i] == null ? '' : values[i]
    return acc + str + val
  }, '')
}

if (process.env.NODE_ENV !== 'production') {
  window.$one = {
    components
  }
}

export { one, createStore, html }
