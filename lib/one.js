const TEXT = 'o-text'

class O {
  #el = null
  #scope = null
  #state = {}

  constructor (el, setup) {
    this.#el = typeof el === 'string' ? document.querySelectorAll(el) : el

    setup.bind(this)()

    if (!this.#el) {
      throw new Error('Element not found')
    }

    if (this.#scope) {
      this.#state = this.#scope.getState()
    }
  }

  get el () {
    return this.#el
  }

  setup (fn) {
    fn.bind(this)()
  }

  setScope (scope) {
    this.#scope = scope
  }

  on (event, fn) {
    const iterator = this.#el.length ? this.#el : [this.#el]
    for (const el of iterator) {
      el[`on${event}`] = () => {
        fn.bind(this)(this.#state)
      }
    }
  }

  setState (state, override = false) {
    this.#state = override ? state : { ...this.#state, ...state }
    this.render(this.#scope?.el ?? this.#el)
  }

  getState (key) {
    if (key) {
      return this.#state[key]
    }

    return this.#state
  }

  render (target, state = this.#state) {
    const iterator = target.length ? target : [target]
    for (const el of iterator) {
      if (el.getAttribute(TEXT)) {
        const text = el.getAttribute(TEXT)
        const key = el.getAttribute('key')
        const s = key ? state?.[key]?.[text] : state[text]
        el.textContent = s != null
          ? s
          : el.textContent
      }
      if (el.getAttribute('o-for')) {
        const template = el.children[0].cloneNode(true)
        const array = state[el.getAttribute('o-for')]
        // TODO: Handle if the array length is less than,
        // the current children length, which means we have to remove

        // Only remove first child if it is the template
        if (!template.getAttribute('key')) {
          el.children[0].remove()
        }
        array.forEach((item, i) => {
          // Don't append already existing children
          if (!el.children[i]) {
            template.setAttribute('key', i)
            el.append(template.cloneNode(true))
          }
        })
        this.render(el.children, array)
      }

      if (el.children.length) {
        for (const c of el.children) {
          this.render(c)
        }
      }
    }
  }
}

export { O }
