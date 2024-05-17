import {
  type Children,
  type Context,
  type Component,
  type TentNode,
  type Attrs,
} from './types';

function mount<S extends {} = {}, A extends Attrs = {}>(
  element: HTMLElement | Element | TentNode<A> | null,
  component: Component<S, A>,
) {
  if (element == null) {
    return;
  }

  const { state = {} as S, view, mounted } = component;
  let node: TentNode<A>;

  const el = element as TentNode<A>;

  el.$tent = {
    attributes: {},
    isComponent: true,
  };

  const handler = {
    get(obj: S, key: string) {
      if (typeof obj[key] === 'object' && obj[key] != null) {
        return new Proxy(obj[key], handler);
      } else {
        return obj[key];
      }
    },
    set(obj: S, prop: string, value: unknown) {
      if (!obj.hasOwnProperty(prop)) {
        throw new Error(
          `The property "${String(prop)}" does not exist on the state object.`,
        );
      }
      if (obj[prop] === value) return true;

      const s = Reflect.set(obj, prop, value);

      walker(node, view({ state: proxy, el, attr: getAttribute<A>(el) }));

      return s;
    },
  };

  const proxy = new Proxy<S>({ ...state }, handler);

  node = view({ state: proxy, el, attr: getAttribute<A>(el) });
  node.$tent = {
    attributes: {},
    isComponent: false,
  };

  el.append(node);

  mounted?.({ state: proxy, el, attr: getAttribute<A>(el) });
}

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

function createTag(context: Context) {
  const [tag, children, attributes] = context;
  const el = document.createElement(tag) as TentNode;

  el.$tent = {
    attributes: {},
    isComponent: false,
  };

  for (const key in attributes) {
    const value = attributes[key];

    el.$tent.attributes[key] = value;

    addAttribute(el, key, value);
  }

  if (Array.isArray(children)) {
    children.forEach((c) => {
      el.append(Array.isArray(c) ? createTag(c) : c);
    });
  } else {
    el.append(typeof children === 'number' ? children.toString() : children);
  }

  return el;
}

function addAttribute<A extends Attrs>(
  el: TentNode<A>,
  key: string,
  value: string,
) {
  if (typeof value === 'boolean') {
    if (value) {
      el.setAttribute(key, '');
    } else {
      el.removeAttribute(key);
    }

    return;
  }

  if (el[key] === undefined) {
    el.setAttribute(key, value);
  } else {
    el[key] = value;
  }
}

function walker<A extends Attrs>(oldNode: TentNode<A>, newNode: TentNode<A>) {
  const nc = Array.from(newNode.childNodes, (n) => n as TentNode<A>);
  const oc = Array.from(oldNode.childNodes, (n) => n as TentNode<A>);

  if (oldNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }

    return;
  }

  // Remove attributes that are not present in the new node
  for (const key in oldNode.$tent.attributes) {
    if (newNode.$tent.attributes[key] == null) {
      delete oldNode.$tent.attributes[key];
      if (oldNode.hasAttribute(key)) {
        oldNode.removeAttribute(key);
      }
    }
  }

  // Add attributes that are not present in the old node
  const attrs = {
    ...oldNode.$tent.attributes,
    ...newNode.$tent.attributes,
  };

  for (const key in attrs) {
    addAttribute(oldNode, key, attrs[key]);
  }

  if (oc.length === 0 && nc.length === 0) {
    return;
  }

  if (oc.length < nc.length) {
    nc.forEach((x, index) => {
      if (oc[index] == null) {
        oldNode.append(x);
      }
    });
  }

  if (oc.length > nc.length) {
    oc.forEach((c, i) => {
      if (nc[i] == null) {
        c.remove();
      }
    });
  }

  oc.forEach((oChild, index) => {
    const nChild = nc[index];

    if (nChild == null) {
      return;
    }

    if (oChild.tagName !== nChild.tagName) {
      oChild.replaceWith(nChild);
    }

    walker(oChild, nChild);
  });
}

const t = [
  'div',
  'p',
  'ul',
  'li',
  'button',
  'input',
  'label',
  'form',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'img',
  'video',
  'audio',
  'canvas',
  'table',
  'tr',
  'td',
  'th',
  'thead',
  'tbody',
  'tfoot',
  'select',
  'option',
  'textarea',
  'pre',
  'code',
  'blockquote',
  'hr',
  'br',
  'iframe',
  'nav',
  'header',
  'footer',
  'main',
  'section',
  'article',
  'aside',
  'small',
  'b',
];
const tags: Record<string, (children: Children, attrs?: object) => TentNode> =
  {};
t.forEach(
  (tag) => (tags[tag] = (children, attrs) => createTag([tag, children, attrs])),
);

export {
  mount,
  tags,
  createTag,
  type Component,
  type Children,
  type Context,
  type TentNode,
};
