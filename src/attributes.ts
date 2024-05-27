import { type TentNode, type Attrs, type TagAttrsValues } from './types';

function addAttribute<A extends Attrs>(
  el: TentNode<A> | HTMLElement,
  key: string,
  value: TagAttrsValues,
) {
  if (key === 'mounted') {
    return;
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

/**
 * @deprecated
 * Use `el.dataset` instead, will be removed in the next major version.
 */
function getAttribute<A>(el: HTMLElement | Element) {
  return <K extends keyof A>(name: K): A[K] | undefined => {
    const attr = el.attributes.getNamedItem(name as string);

    if (!attr) {
      return;
    }

    const value = attr.value;

    if (value === '') {
      // TODO: This might not be the desired behavior.
      // I should find a better way to handle this,
      // what I want to avoid is returning `T | undefined | 'true'`
      return 'true' as A[K];
    }

    return value as A[K];
  };
}

export { addAttribute, getAttribute };
