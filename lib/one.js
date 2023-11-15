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

  render (target) {
    const iterator = target.length ? target : [target]
    for (const el of iterator) {
      if (el.getAttribute(TEXT)) {
        const key = el.getAttribute(TEXT)
        el.textContent = this.#state[key] != null
          ? this.#state[key]
          : el.textContent
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
