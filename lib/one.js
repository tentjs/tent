const components = {}
let uid = 0

function one (config) {
  const tag = config.name
  const els = document.querySelectorAll(tag)

  Array.from(els).forEach(el => {
    const { setup, ...c } = createInstance({
      ...config,
      state: {},
      el
    })

    template(c)
    setup({
      config: c,
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

  if (components[name]) {
    uid = uid + 1
    el.$one = { uid }
    config.uid = uid

    config.props?.forEach(prop => {
      const val = el.getAttribute(prop)
      if (val) {
        config.state[prop] = val
      }
    })

    components[name].push(config)
  }

  return config
}

function query (selector) {
  console.log('this', this.el)
  const el = this.el.querySelector(selector)

  return el
}

function event (el, name, cb) {
  if (!el) return

  el[`on${name}`] = () => {
    // eslint-disable-next-line n/no-callback-literal
    cb(this)
    render(this)
  }
}

function click (el, cb) {
  event.bind(this)(el, 'click', cb)
}

function render (config) {
  const texts = config.el.querySelectorAll('[o-text]')

  if (texts.length) {
    Array.from(texts).forEach(el => {
      const key = el.getAttribute('o-text')
      const value = config.state[key]

      if (value && el.textContent !== value) {
        el.textContent = value
      }
    })
  }
}

export { one }
