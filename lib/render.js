import {getChildren, remove, replaceWith} from './utils'

function render(el, nodes, $context) {
  const children = getChildren(nodes, $context, true)

  if (el.children.length === 0 && !el.childNodes.length) {
    if (Array.isArray(children)) {
      for (const c of children) {
        el.append(getChildren(c, $context))
      }
    } else {
      // e('div', ['Some text']) / e('div', 'Some text')
      el.append(getChildren(children, $context))
    }
    return
  } else if (el.children.length === 0 && el.childNodes.length) {
    // e('div', ['Some text']) / e('div', 'Some text')
    el.textContent = Array.isArray(children) ? children[0] : children
    return
  }

  diff(children, el, $context)
}

function diff(children, compare, $context) {
  let i = 0

  for (const c of children) {
    let domReplaced = false
    const child = getChildren(c, $context)
    const dom = compare.children[i]

    if (
      dom &&
      child &&
      ((dom instanceof HTMLElement && !(child instanceof HTMLElement)) ||
        (!(dom instanceof HTMLElement) && child instanceof HTMLElement))
    ) {
      console.error(dom, child)
      throw new Error(
        "You can't have a text node and an element node at the same level. Wrap the text node in a span, p, div or other element."
      )
    }

    if (!dom || dom.isEqualNode(child)) {
      i++
      continue
    }

    if (
      dom.tagName !== child.tagName ||
      ((dom.attributes.key || child.attributes.key) &&
        dom.attributes.key !== child.attributes.key)
    ) {
      replaceWith(dom, child)
      i++
      continue
    }

    if (dom.children.length === 0) {
      replaceWith(dom, child)
      domReplaced = true
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
      for (const dc of domChildren) {
        if (!childChildren[j]) {
          remove(dc)
          // The last child is removed and the dom element is empty
          if (domChildren.length - 1 === 0) {
            replaceWith(dom, child)
          }
        }
        j++
      }
    }

    diff(childChildren, dom, $context)

    i++
  }
}

export {render}
