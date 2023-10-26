import {createUUID, getStyles, getChildren} from './utils'

const uuids = []
const cachedStyles = new Map()

function L(as, nodes = [], opts = {}) {
  const {mount, data, layout, styles, props, ...attributes} = opts
  const el = document.createElement(as)

  const d = data == null ? {} : data()
  if (props) {
    d.props = {}

    el.props = el.props ?? {}
  }
  d.route = d.route ?? {params: null}

  const stringStyles = JSON.stringify(styles)
  const existingStyles = getStyles(stringStyles, cachedStyles)
  if (existingStyles) {
    attributes[existingStyles] = true
  } else if (styles && existingStyles == null) {
    const uuid = `l-${createUUID(uuids)}`
    const styleEl = document.createElement('style')

    styleEl.id = uuid
    attributes[uuid] = true
    cachedStyles.set(uuid, stringStyles)

    const res = {}
    for (const k in styles) {
      const val = styles[k]
      if (typeof val !== 'object') {
        res[`[${uuid}]`] = {
          ...res[`[${uuid}]`],
          [k]: val,
        }
        delete styles[k]
      }
    }

    function t(obj, root = []) {
      for (const k in obj) {
        const val = obj[k]
        if (typeof val === 'object') {
          root.push(k)
          res[`[${uuid}] ${root.join(' ')}`] = val
          if (t(val, root)) root = []
        }
      }
      return true
    }

    t(styles)

    for (const k in res) {
      const val = res[k]
      if (typeof val !== 'object') {
        styleEl.append(`${k}:${val};`)
      } else {
        styleEl.append(`${k} {`)
        for (const k in val) {
          const v = val[k]
          if (typeof v !== 'object') {
            styleEl.append(`${k}:${v};`)
          }
        }
        styleEl.append(`}`)
      }
    }

    styleEl.textContent = styleEl.textContent.replace(/\s+/g, ' ')

    document.head.append(styleEl)
  }

  const $context = new Proxy(d, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      const s = Reflect.set(target, key, value)
      render()
      return s
    },
  })

  if (props && Array.isArray(props)) {
    for (const prop of props) {
      Object.defineProperty(el.props, prop, {
        set(newValue) {
          if ($context.props[prop] !== newValue) {
            $context.props = {
              ...$context.props,
              [prop]: newValue,
            }
          }
        },
      })
    }
  }

  Object.defineProperty(el, '$params', {
    set(newValue) {
      $context.route = {
        ...$context.route,
        params: newValue,
      }
    },
  })

  for (const attr in attributes) {
    const a = attributes[attr]
    if (typeof a === 'function') {
      el[attr] = a
    } else if (typeof a === 'boolean') {
      if (a) {
        el.setAttribute(attr, '')
      } else {
        el.removeAttribute(attr)
      }
    } else {
      el.setAttribute(attr, a)
    }
  }

  function render() {
    const children = getChildren(nodes, $context, true)

    if (el.children.length === 0 && !el.childNodes.length) {
      if (Array.isArray(children)) {
        for (const c of children) {
          el.append(getChildren(c, $context))
        }
      } else {
        // L('div', ['Some text']) / L('div', 'Some text')
        el.append(getChildren(children, $context))
      }
      return
    } else if (el.children.length === 0 && el.childNodes.length) {
      // L('div', ['Some text']) / L('div', 'Some text')
      el.textContent = Array.isArray(children) ? children[0] : children
      return
    }

    function traverse(children, compare) {
      let i = 0
      for (const child of children) {
        let domReplaced = false
        const dom = compare.children[i]
        if (typeof child === 'function') {
          const c = child({context: $context})
          if (dom && !dom.isEqualNode(c)) {
            dom.replaceWith(c)
          }
          traverse(Array.from(c.children), c)
          i++
          continue
        }
        if (
          dom &&
          child &&
          ((dom instanceof HTMLElement && !(child instanceof HTMLElement)) ||
            (!(dom instanceof HTMLElement) && child instanceof HTMLElement))
        ) {
          console.error(dom, child)
          throw new Error(
            "You can't have a text node and an element node at the same level"
          )
        }
        if (dom && !dom.isEqualNode(child)) {
          if (dom.children.length === 0) {
            dom.replaceWith(child)
            domReplaced = true
          }
          if (dom.attributes.key !== child.attributes.key) {
            dom.replaceWith(child)
            i++
            continue
          }
          if (child.attributes.length) {
            for (const attr of child.attributes) {
              if (!attr.name.startsWith('l-')) {
                const found = dom.attributes.getNamedItem(attr.name)
                if (!found || attr.value != found.value) {
                  dom.setAttribute(attr.name, attr.value)
                }
              }
            }
          }
          const domChildren = Array.from(dom.children)
          const childChildren = Array.from(child.children)
          if (childChildren.length > domChildren.length) {
            let j = 0
            for (const c of childChildren) {
              if (!domChildren[j]) {
                if (domReplaced) {
                  child.append(c)
                } else {
                  dom.append(c)
                }
              }
              j++
            }
          }
          if (domChildren.length > childChildren.length) {
            let j = 0
            for (const c of domChildren) {
              if (!childChildren[j]) {
                c.remove()
              }
              j++
            }
          }
          traverse(childChildren, dom)
        }
        i++
      }
    }

    traverse(children, el)
  }

  render()

  if (el.onmount) {
    el.onmount({el, context: $context})
  }

  if (mount) {
    mount.append(el)
  } else {
    return el
  }
}

export {L}
