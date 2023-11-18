const TEXT = 'o-text'
const FOR = 'o-for'
const MODEL = 'o-model'
const IF = 'o-if'
const KEY = 'o-key'
const SCOPE = 'o-scope'

class One {
  #scope = null
  #state = {}
  #methods = {}
  #computed = {}

  #setup = null

  constructor (setup) {
    this.#setup = setup
  }

  get scope () { return this.#scope }

  get methods () { return this.#methods }
  set methods (methods) {
    this.#methods = methods
  }

  get state () { return this.#state }
  set state (state) {
    this.#state = { ...this.#state, ...state }

    if (this.computed) {
      for (const key in this.computed) {
        this.state[key] = this.computed[key]()
      }
    }

    this.render()
  }

  get computed () { return this.#computed }
  set computed (computed) {
    this.#computed = computed
  }

  render (scope = this.scope, state = this.state) {
    const iterator = scope instanceof window.NodeList ||
        scope instanceof window.HTMLCollection
      ? scope
      : [scope]

    if (!iterator.length) {
      return
    }

    for (const el of iterator) {
      if (el.getAttribute(TEXT)) {
        this.text(el, state)
      }

      if (el.getAttribute(FOR)) {
        this.for(el, state)
      }

      if (el.getAttribute(MODEL)) {
        this.model(el, state)
      }

      if (el.getAttribute(IF)) {
        this.if(el, state)
      }

      const events = []
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('o-on:')) {
          events.push(attr)
        }
      })
      if (events.length) {
        this.on(el, events)
      }

      if (el.children.length) {
        for (const c of el.children) {
          if (c.getAttribute(`${SCOPE}`)) {
            // Don't process inner scopes
            continue
          }

          this.render(c, state)
        }
      }
    }
  }

  text (el, state) {
    const text = el.getAttribute(TEXT)
    const key = el.getAttribute(KEY)
    const value = this.value(text, state, key)

    if (value != null && value !== el.textContent) {
      el.textContent = value
    }
  }

  for (el, state) {
    const tmpl = el.querySelector('template')
    const template = tmpl ?? document.createElement('template')
    const rendered = template.children.length
    const array = state[el.getAttribute(FOR)]

    if (array == null || array.length === 0) {
      return
    }

    // Remove all children that are not in the array
    if (rendered) {
      const children = Array.from(el.children).filter(c => c !== template)

      let i = 0
      for (const c of children) {
        if (!array[i]) {
          el.removeChild(c)
        }
        i++
      }
    }

    if (!tmpl) {
      template.append(...el.children)
      el.append(template)
    }

    const t = template.children[0].cloneNode(true)
    const children = Array.from(el.children).filter(c => c !== template)

    array.forEach((_, i) => {
      // Don't append already existing children
      if (!children[i]) {
        t.setAttribute(KEY, i)
        el.append(t.cloneNode(true))
      }
    })

    this.render(el.children, array)
  }

  model (el, state) {
    const model = el.getAttribute(MODEL)
    const value = this.value(model, state)

    if (value == null) {
      return
    }

    if (el.type === 'checkbox') {
      if (el.checked !== value) {
        el.checked = value
      }
    } else {
      if (el.value !== value) {
        el.value = value
      }
    }
  }

  if (el, state) {
    const key = el.getAttribute(IF)
    const value = this.value(key, state)
    const tmpl = el.querySelector('template')
    const template = tmpl ?? document.createElement('template')

    if (!el.children.length) {
      throw new Error(`${IF} must have at least one child`)
    }

    if (!tmpl) {
      el.append(template)
    }

    if (!value) {
      template.append(...Array.from(el.children).filter(c => c !== template))
    } else {
      el.append(...template.children)
    }
  }

  on (el, events) {
    if (!this.methods) {
      return
    }

    events.forEach(event => {
      const e = event.name.split(':')[1]
      const key = event.value

      if (!e || !key || !this.methods[key]) {
        return
      }

      el[`on${e}`] = () => {
        this.methods[key](el)
      }
    })
  }

  value (key, state, i) {
    let s = i ? state?.[i]?.[key] : state[key]

    if (key.includes('.')) {
      let value = state

      for (const p of key.split('.')) {
        value = value?.[p]
      }
      if (!value) {
        return
      }

      s = value
    }

    return s
  }

  async mount () {
    const config = this.#setup.bind(this)()

    if (!config.scope) {
      throw new Error('Scope is required')
    }

    this.#scope = document.querySelector(`[${SCOPE}="${config.scope}"]`)

    if (!this.#scope) {
      throw new Error(`Scope "${config.scope}" not found`)
    }

    this.methods = config.methods
    this.computed = config.computed
    this.state = config.state

    if (config.onmount) {
      await config.onmount()
    }
  }
}

export { One }
