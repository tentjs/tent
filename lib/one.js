// @flow

type OneElement = HTMLElement & {
  $one: Component,
  on?: Function,
  if?: Function,
  for?: Function,
  [string]: Function
}

type Props = Array<string> | { [string]: mixed }
type State = Object
type Computed = { [string]: Function }
type Key = string | number | boolean

type Config = {
  key?: Key,
  uid?: number,
  name?: string,
  template?: TrustedHTML,
  computed?: Computed,
  el: OneElement,
  props?: Props,
  state?: State,
  parent?: Omit<Config, 'setup'>,
  store?: Store,
  setup: Function,
  created?: Function,
  components?: Array<Config>,
  loop?: {
    parent: OneElement,
    el: OneElement,
    items: string,
    key: ?Key,
    fn: Function
  }
}

type Component = Omit<Config, 'setup'>

type Components = {
  [string]: Array<Component>
}

type Store = {
  state?: { [string]: mixed },
  get: (key: string) => mixed,
  set: (key: string, value: mixed) => void,
  length: number
}

const components: Components = {}
const store: Store = {
  state: {},
  get length() { return Object.keys(store.state ?? {}).length },
  get(key) {
    return store.state?.[key]
  },
  set(key, value) {
    if (!store.state?.[key]) {
      throw new Error(`One->store: You can't set "${key}", since it wasn't defined on initialization.`)
    }

    store.state[key] = value

    for (const k in components) {
      const component = components[k]
      component.forEach(c => {
        if (
          typeof c.template === 'string' && c.template.includes(`$store.${key}`) ||
          c.el?.textContent.includes(`$store.${key}`)
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

function one(config: Config): void {
  if (!config.name) {
    throw new Error('One->one: You must define a name for your component.')
  }

  const els: NodeList<OneElement> = config.parent
    ? (config.parent.el?.querySelectorAll(config.name): any)
    : (document.querySelectorAll(config.name): any)

  if (els == null || els.length === 0) {
    return
  }

  Array.from(els).forEach(async (el) => {
    const { setup, ...cfg } = config
    const { created, ...c } = createInstance({
      ...cfg,
      state: { ...config.state },
      store: Object.freeze({
        get: store.get,
        set: store.set,
        length: store.length
      }),
      el
    })

    if (created) {
      await created.bind(c)()
    }

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

function template(config: Component) {
  const tmpl = document.createElement('template')

  // FIXME: Shouldn't bail when there's no template.
  // The user could've defined the template in HTML.
  // i.e.: config.el.children...
  if (!config.template) return
  tmpl.innerHTML = config.template

  if (tmpl.content.children.length !== 1) {
    throw new Error('One->template: You can only have exactly one root element in your template.')
  }

  const clone: OneElement = (tmpl.content.children[0].cloneNode(true): any)

  const name = config.name
  if (!name) return

  const component = components[name].find(c => c.uid === config.uid)

  if (!component) {
    throw new Error(`One->template: Could not find component ${name}.`)
  }

  if (!config.el) {
    throw new Error('One->template: Could not find the element.')
  }

  const el = config.el
  clone.$one = config.el?.$one

  for (const attr of config.el.attributes) {
    if (config.props && (config.props: Object)[attr.name]) continue
    clone.setAttribute(attr.name, attr.value)
  }

  el.replaceWith(clone)
  config.el = clone

  component.el = clone

  tmpl.remove()
}

function createInstance(config: Component): Component {
  const name = config.name
  const el = config.el

  if (!name) {
    throw new Error('One->createInstance: You must define a name for your component.')
  }

  if (el.$one) {
    const component = components[name].find(c => c.uid === el.$one.uid)
    if (component) {
      return component
    }
  }

  if (!components[name]) {
    components[name] = [config]
  }

  uid = uid + 1
  config.uid = uid

  el.$one = {
    uid,
    props: {},
    state: config.state,
    parent: config.parent,
    el: config.el,
  }

  const props: Object = {}
  if (config.props && Array.isArray(config.props)) {
    config.props.forEach(prop => {
      const val = el.getAttribute(prop)

      if (val) {
        if ((config.props: Object)[prop] == null) {
          props[prop] = val
        }
      }
      (el.$one.props: Object)[prop] = val
    })
  }

  config.props = Object.freeze({ ...props })

  config.computed = {}

  components[name].push(config)

  return config
}

function query(this: Component, selector: string) {
  const el: ?OneElement = this.el?.children.length
    ? (this.el.querySelector(selector): any)
    : this.el

  if (!el) {
    throw new Error(`One->query: No element was found for "${selector}"`)
  }

  el.on = on.bind(this, el)
  el.if = fi.bind(this, el)
  el.for = loop.bind(this, el)

  return el
}

function on(this: Component, el: OneElement, name: string, handler: Function) {
  el[`on${name}`] = async () => {
    await handler({
      store: { get: store.get, set: store.set, length: store.length },
      props: this.props,
      state: this.state
    })

    if (this.computed) {
      for (const k in this.computed) {
        if (!this.computed[k]) { continue }
        const value: mixed = this.computed[k]({
          state: this.state,
          props: this.props,
          store: this.store
        })
        if (value && this.state && this.state[k] !== value) {
          this.state[k] = value
        }
      }
    }

    render(this)
  }
}

function loop(
  this: Component,
  el: OneElement,
  [items, key]: [string, ?Key],
  fn: Function,
  parent: ?OneElement = null
) {
  const parentNode: OneElement = parent ?? (el.parentNode: any)
  const arr = this.state?.[items] ?? this.parent?.state?.[items]

  if (!Array.isArray(arr)) {
    return
  }

  parentNode.$one = {
    ...parentNode.$one,
    store: this.store,
    state: this.state,
    loop: { parent: parentNode, el, items, key, fn }
  }

  // `parent` will only be defined if it's a re-render.
  // Or, if the user defines it, which should be discouraged.
  if (parent) {
    Array.from(parentNode.children).forEach((child: any) => {
      const k: OneElement = child.$one?.key
      if (!k) return
      if (!arr.find((x: Object) => x[key] === k)) {
        child.remove()
      }
    })
  }

  parentNode.setAttribute('o-for', '')

  if (arr.length === 0) {
    el.remove()
  }

  const keys: Array<Key> = []
  arr.forEach((item: Object | string | number | boolean, index: number) => {
    const clone: OneElement = (el.cloneNode(true): any)
    const k = getKey(item, key).toString()

    if (keys.includes(k)) {
      throw new Error(`One->for: There are multiple items with the key "${k}" when looping "${items}".`)
    }
    keys.push(k)

    el.remove()

    const config = {
      key: k,
      el: clone,
      state: item,
      store: this.store
    }
    clone.$one = config

    clone.on = on.bind(clone.$one, clone)
    clone.if = fi.bind(clone.$one, clone)
    clone.for = loop.bind(clone.$one, clone)

    render(clone.$one)

    const child: OneElement = (parentNode.children[index]: any)
    if (child) {
      render(child.$one)
    } else {
      parentNode.append(clone)
    }

    if (fn) {
      fn({ el: clone, item })
    }
  })
}

function getKey(item: Object | string | number | boolean, key: ?Key) {
  if (!key && typeof item === 'object') {
    throw new Error(`One->for: You must define a key for "${JSON.stringify(item)}"`)
  }

  if (key && typeof item === 'object' && !item[key]) {
    throw new Error(`One->for: The key "${key.toString()}" does not exist on ${JSON.stringify(item)}`)
  }

  if (typeof item === 'object') {
    return item[key]
  }

  return item
}

function fi(this: Component, el: OneElement) {
  let original: ?OneElement = null

  const container: OneElement = (document.createElement('one-if'): any)
  const template = document.createElement('template')
  const sibling: OneElement = (el.nextSibling: any)

  return {
    hide() {
      if (original) return

      template.append(el)
      container.append(template)

      sibling.parentNode?.insertBefore(container, sibling)

      original = container
    },
    show() {
      if (!original) return
      original.replaceWith(el)
      original = null
    }
  }
}

function computed(this: Component, name: string, fn: Function) {
  if (this.state?.[name] != null) {
    throw new Error(`One->computed: You already have a state property called "${name}".`)
  }
  if (this.computed?.[name] != null) {
    throw new Error(`One->computed: You already have a computed property called "${name}".`)
  }

  if (this.state) {
    this.state[name] = fn({
      state: this.state,
      props: this.props,
      store: this.store,
      parent: this.parent
    })
  }

  if (this.computed) {
    this.computed[name] = fn
  }
}

function render(config: Component) {
  traverse(config.el, config)
}

function traverse(el: OneElement, config: Component) {
  Array.from(el.attributes).forEach(attr => {
    if (attr.name === 'o-text') {
      const val = value(attr.value, config)

      if (val != null && el.textContent !== val) {
        el.textContent = val
      }
    }

    if (attr.name === 'o-for') {
      if (!el.$one?.loop) return
      const { el: elm, items, key, fn, parent } = el.$one.loop
      loop.bind(config)(elm, [items, key], fn, parent)
    }
  })

  if (el.children.length) {
    const children: Array<OneElement> = (Array.from(el.children): any)
    children.forEach((c) => {
      if (c.$one?.uid) return
      traverse(c, config)
    })
  }
}

// TODO: Support for nested keys, like `foo.bar.baz`.
function value(key: string, config: Component) {
  const fromStore = key.startsWith('$store.')
  const fromProps = key.startsWith('$props.')

  if (fromStore) {
    if (config.store == null || config.store?.length === 0) {
      throw new Error('One->value: You are trying to access a $store value, but no store was passed to the component.')
    }

    return config.store.get(key.replace('$store.', ''))
  }

  if (fromProps) {
    if (config.props == null) {
      throw new Error('One->value: You are trying to access a $props value, but the component have no props.')
    }

    return (config.props: Object)[key.replace('$props.', '')]
  }

  if (config.state == null) {
    throw new Error('One->value: You are trying to access a state value, but the component have no state.')
  }

  if (typeof config.state !== 'object') {
    return config.state
  }

  return config.state[key]
}

function createStore(fn: Function) {
  store.state = fn()
}

function html(strings: Array<string>, ...values: Array<string>): string {
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
