import {
  type Children,
  type Context,
  type Component,
  type TentNode,
} from './types';

function mount<S extends object>(el: HTMLElement | null, component: Component<S>) {
  const {state = {} as S, view, mounted} = component;
  let node: TentNode;

  if (el == null) {
    return;
  }

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
        throw new Error(`The property "${String(prop)}" does not exist on the state object.`);
      }
      if (obj[prop] === value) return true;

      const s = Reflect.set(obj, prop, value);

      walker(
        node,
        view({state: proxy}),
      );

      return s;
    },
  }

  const proxy = new Proxy<S>(
    {...state},
    handler,
  );

  node = view({state: proxy});
  node.$tent = {
    attributes: {},
    isComponent: true,
  };

  el.append(node);

  mounted?.({state: proxy});
}

function createTag(context: Context) {
  const [tag, children, attributes] = context;
  const elm = document.createElement(tag) as TentNode;

  elm.$tent = {
    attributes: {},
    isComponent: false,
  };

  if (Array.isArray(children)) {
    children.forEach((c) => {
      elm.append(
        Array.isArray(c) ? createTag(c) : c
      );
    });
  } else {
    elm.append(typeof children === 'number' ? children.toString() : children);
  }

  for (const key in attributes) {
    elm.$tent.attributes[key] = attributes[key];

    if (key.startsWith('on') || /[A-Z]/.test(key)) {
      elm[key] = attributes[key];
    } else {
      const val = attributes[key];
      if (typeof val === 'boolean') {
        if (val) {
          elm.setAttribute(key, '');
        } else {
          elm.removeAttribute(key);
        }
      } else {
        elm.setAttribute(key, attributes[key]);
      }
    }
  }

  return elm;
}

function walker(oldNode: TentNode, newNode: TentNode) {
  const nc = Array.from(newNode.childNodes) as TentNode[];
  const oc = Array.from(oldNode.childNodes) as TentNode[];

  if (oc.length === 0 && nc.length === 0) {
    return;
  }

  syncNodes(oldNode, newNode);

  if (oldNode.nodeType === Node.TEXT_NODE) {
    return
  }

  if (oc.length < nc.length) {
    nc.forEach((x, index) => {
      if (oc[index] == null) {
        oldNode.append(
          addAttributes(x.cloneNode(true) as TentNode, x)
        );
      }
    });
  }

  if (oc.length > nc.length) {
    oc.forEach((c, i) => {
      if (nc[i] == null) {
        c.remove();
      }
    })
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

function syncNodes(oldNode: TentNode, newNode: TentNode) {
  if (oldNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue
    }

    return
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

function addAttributes(clone: TentNode, node: TentNode) {
  if (!clone.$tent && !node.$tent) return clone;

  Object.keys(node.$tent.attributes).forEach(
    (key) => clone[key] = node.$tent.attributes[key],
  );

  if (clone.hasChildNodes()) {
    for (const [index, entry] of clone.childNodes.entries()) {
      addAttributes(entry as TentNode, node.childNodes[index] as TentNode);
    }
  }

  return clone;
}

const t = [
  "div",
  "p",
  "ul",
  "li",
  "button",
  "input",
  "label",
  "form",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "img",
  "video",
  "audio",
  "canvas",
  "table",
  "tr",
  "td",
  "th",
  "thead",
  "tbody",
  "tfoot",
  "select",
  "option",
  "textarea",
  "pre",
  "code",
  "blockquote",
  "hr",
  "br",
  "iframe",
  "nav",
  "header",
  "footer",
  "main",
  "section",
  "article",
  "aside",
  "small",
  "b",
];
const tags: Record<string, (children: Children, attrs?: object) => TentNode> = {};
t.forEach(
  (tag) =>
    tags[tag] = (children, attrs) =>
      createTag([tag, children, attrs]),
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
