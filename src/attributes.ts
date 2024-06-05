import { type TentNode, type Attrs, type TagAttrsValues } from './types';

function addAttributes<A extends Attrs>(el: TentNode<A>, attributes: A) {
  for (const key in attributes) {
    const value = attributes[key as string];

    addAttribute(el, key, value);
  }
}

function addAttribute<A extends Attrs>(
  el: TentNode<A> | HTMLElement,
  key: string,
  value: TagAttrsValues,
) {
  if (key === 'mounted') return;

  if ('$tent' in el) {
    el.$tent.attributes[key] = value;
  }

  if (typeof value === 'boolean') {
    if (value) {
      el.setAttribute(key, '');
    } else {
      el.removeAttribute(key);
    }

    return;
  }

  // Either set the attribute or the property of the element.
  // i.e., `el.value` is a property, and `el['data-foo']` is an attribute.
  if (el[key] === undefined) {
    el.setAttribute(key, String(value));
  } else {
    el[key] = value;
  }
}

export { addAttributes, addAttribute };
