export function replaceWith(el, target) {
  el.replaceWith(target)
  if (el.attributes) {
    for (const attr of el.attributes) {
      if (attr.name.startsWith('l-')) {
        document.head.querySelector(`#${attr.name}`).remove()
      }
    }
  }
}
