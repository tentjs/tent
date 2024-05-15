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
    el.$tent.attributes[key] = attributes[key];

    if (key.startsWith('on') || /[A-Z]/.test(key)) {
      el[key] = attributes[key];
    } else {
      const val = attributes[key];
      if (typeof val === 'boolean') {
        if (val) {
          el.setAttribute(key, '');
        } else {
          el.removeAttribute(key);
        }
      } else {
        el.setAttribute(key, attributes[key]);
      }
    }
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

function walker<A extends Attrs>(oldNode: TentNode<A>, newNode: TentNode<A>) {
  const nc = Array.from(newNode.childNodes) as TentNode<A>[];
  const oc = Array.from(oldNode.childNodes) as TentNode<A>[];

  if (oc.length === 0 && nc.length === 0) {
    return;
  }

  syncNodes(oldNode, newNode);

  if (oldNode.nodeType === Node.TEXT_NODE) {
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

    syncNodes(oChild, nChild);

    walker(oChild, nChild);
  });
}

function syncNodes<A extends Attrs>(
  oldNode: TentNode<A>,
  newNode: TentNode<A>,
) {
  if (oldNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }

    return;
  }

  // Add attributes that are not present in the old node
  if (newNode.attributes?.length) {
    Array.from(newNode.attributes).forEach((attr) => {
      if (oldNode.getAttribute(attr.name) !== attr.value) {
        oldNode.setAttribute(attr.name, attr.value);
      }
    });
  }
  // Remove attributes that are not present in the new node
  if (oldNode.attributes?.length) {
    Array.from(oldNode.attributes).forEach((attr) => {
      if (!newNode.hasAttribute(attr.name)) {
        oldNode.removeAttribute(attr.name);
      }
    });
  }
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
