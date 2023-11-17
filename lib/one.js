import { Render } from './render'

class One {
  #el = null
  #scope = null
  #state = {}
  #methods = {}

  #setup = null

  constructor (el, setup) {
    this.#el = typeof el === 'string' ? document.querySelectorAll(el) : el

    if (!this.#el.length) {
      throw new Error('Element not found')
    }

    this.#setup = setup

    this.models()
  }

  get el () { return this.#el }

  get scope () { return this.#scope }
  set scope (scope) {
    this.#scope = scope
  }

  get state () { return this.#state }
  set state (state) {
    this.#state = this.scope?.state
      ? { ...this.scope.state, ...state }
      : { ...this.state, ...state }

    if (this.scope) {
      this.scope.state = this.state
    }

    new Render().render(
      this.el,
      this.state,
      this.methods
    )
  }

  get methods () { return this.#methods }
  set methods (methods) {
    this.#methods = methods
  }

  models () {
    this.el.forEach(el => {
      const models = el.querySelectorAll('[o-model]')

      if (models.length) {
        models.forEach(model => {
          const key = model.getAttribute('o-model')

          model[this.getModelEvent(model)] = (e) => {
            const value = e.target.type === 'checkbox'
              ? e.target.checked
              : e.target.value

            this.state = {
              [key]: value
            }
          }
        })
      }
    })
  }

  getModelEvent (el) {
    if (el.tagName === 'INPUT') {
      if (el.type === 'checkbox') {
        return 'onchange'
      }
      return 'oninput'
    }

    if (el.tagName === 'SELECT') {
      return 'onchange'
    }

    return 'oninput'
  }

  register (components) {
    components.forEach(component => {
      component.scope = this
      component.state = this.state
      component.mount()
    })
  }

  on (event, fn) {
    const iterator = this.#el.length ? this.#el : [this.#el]

    for (const el of iterator) {
      el[`on${event}`] = () => {
        fn.bind(this)({
          state: this.scope?.state ?? this.#state
        })
      }
    }
  }

  mount (state) {
    if (state) {
      this.#state = state
    }

    this.#setup.bind(this)()
  }
}

export { One }
