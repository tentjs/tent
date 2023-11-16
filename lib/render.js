const TEXT = 'o-text'
const FOR = 'o-for'
const MODEL = 'o-model'
const IF = 'o-if'
const KEY = 'key'

class Render {
  render (target, state) {
    const iterator = target instanceof window.NodeList ||
        target instanceof window.HTMLCollection
      ? target
      : [target]

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

      if (el.children.length) {
        for (const c of el.children) {
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
      throw new Error('o-if must have at least one child')
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
}

export { Render }
