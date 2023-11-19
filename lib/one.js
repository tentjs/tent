const components = {}
const store = {
  state: {},
  get (key) {
    return store.state[key]
  },
  set (key, value) {
    if (!store.state[key]) {
      throw new Error(`One->store: You can't set "${key}", since it wasn't defined on initialization.`)
    }

    store.state[key] = value
  }
}
let uid = 0

function one (config) {
  const tag = config.name
  const els = document.querySelectorAll(tag)

  Array.from(els).forEach(el => {
    const { setup, ...c } = createInstance({
      ...config,
      state: Object.assign({}, config.state) ?? {},
      el
    })

    template(c)
    setup({
      config: c,
      state: c.state,
      query: query.bind(c),
      event: event.bind(c),
      click: click.bind(c)
    })
    render(c)
  })
}

function template (config) {
  if (!config.template) return

  const tmpl = document.createElement('template')
  tmpl.innerHTML = config.template

  config.el.append(...tmpl.content.children)
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
    state: config.state
  }

  config.props?.forEach(prop => {
    const val = el.getAttribute(prop)

    if (val) {
      if (config.state[prop] == null) {
        config.state[prop] = val
      }
      el.$one.props[prop] = val
    }
  })

  components[name].push(config)

  return config
}

function query (selector) {
  return this.el.querySelector(selector)
}

function event (el, name, handler) {
  if (!el) return

  el[`on${name}`] = async () => {
    await handler(this)
    render(this)
  }
}

function click (el, handler) {
  event.bind(this)(el, 'click', handler)
}

function render (config) {
  traverse(config.el, config)
}

function traverse (el, config) {
  if (el.getAttribute('o-text')) {
    const key = el.getAttribute('o-text')
    const fromStore = key.startsWith('$store')
    const value = fromStore
      ? config.store?.get(key.replace('$store.', ''))
      : config.state[key]

    if (fromStore && config.store == null) {
      throw new Error('You are trying to access a $store value, but no store was passed to the component.')
    }

    if (value && el.textContent !== value) {
      el.textContent = value
    }
  }

  if (el.children.length) {
    Array.from(el.children).forEach(c => {
      if (c.$one) {
        return
      }
      traverse(c, config)
    })
  }
}

function createStore (fn) {
  store.state = fn()

  return { get: store.get, set: store.set }
}

export { one, createStore }
