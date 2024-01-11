type Component<S> = {
  view: (context: {state: S}) => CustomNode;
  state?: S;
  mounted?: (context: {state: S}) => void;
};

type CustomNode = Node & Element & HTMLElement & {
  $tent: {
    attributes: object;
    isComponent: boolean;
  };
  children: CustomNode[];
};

function mount<S extends object>(el: HTMLElement | null, component: Component<S>) {
  const {state = {} as S, view, mounted} = component;
  let node: CustomNode;

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
        throw new Error(
          `The property "${String(prop)
          }" does not exist on the state object.`,
        );
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

type Children = string | number | CustomNode | (Node | Context)[]
type Context = [string, Children, object | undefined];

function createTag(context: Context) {
  const [tag, children, attributes] = context;
  const elm = document.createElement(tag) as CustomNode;

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

function walker(oldNode: CustomNode, newNode: CustomNode) {
  const nc = Array.from<CustomNode>(newNode.children);

  syncNodes(oldNode, newNode);

  if (oldNode.children.length < nc.length) {
    nc.forEach((x, index) => {
      if (oldNode.children[index] == null) {
        oldNode.append(
          addAttributes(x.cloneNode(true) as CustomNode, x)
        );
      }
    });
  }

  Array.from<CustomNode>(oldNode.children).forEach((oChild, index) => {
    const nChild = nc[index];

    if (nChild?.$tent?.isComponent || oChild?.$tent?.isComponent) {
      return;
    }

    if (nChild == null) {
      oChild.remove();
      return;
    }

    if (oChild.tagName !== nChild.tagName) {
      oChild.replaceWith(nChild);
    }

    // Add children that are not present in the old node
    if (oChild.children.length < nChild.children.length) {
      const occ = Array.from(oChild.children);

      Array.from<CustomNode>(nChild.children).forEach((ncc, index) => {
        if (occ[index] == null) {
          oChild.append(
            addAttributes(ncc.cloneNode(true) as CustomNode, ncc)
          );
        }
      });
    }

    // Remove children that are not present in the new node
    if (oChild.children.length > nChild.children.length) {
      const ncc = Array.from(nChild.children);

      Array.from(oChild.children).forEach((x, index) => {
        if (ncc[index] == null) {
          x.remove();
        }
      });
    }

    syncNodes(oChild, nChild);

    if (oChild.children.length && nChild.children.length) {
      walker(oChild, nChild);
    }
  });
}

function syncNodes(oldNode: CustomNode, newNode: CustomNode) {
  // Add attributes that are not present in the old node
  Array.from(newNode.attributes).forEach((attr) => {
    if (oldNode.getAttribute(attr.name) !== attr.value) {
      oldNode.setAttribute(attr.name, attr.value);
    }
  });
  // Remove attributes that are not present in the new node
  Array.from(oldNode.attributes).forEach((attr) => {
    if (!newNode.hasAttribute(attr.name)) {
      oldNode.removeAttribute(attr.name);
    }
  });

  // Replace text content if it's different and the element has no children
  if (
    oldNode.textContent !== newNode.textContent &&
    newNode.children.length === 0 &&
    oldNode.children.length === 0
  ) {
    oldNode.textContent = newNode.textContent;
  }
}

function addAttributes(clone: CustomNode, node: CustomNode) {
  if (!clone.$tent && !node.$tent) return clone;

  Object.keys(node.$tent.attributes).forEach(
    (key) => clone[key] = node.$tent.attributes[key],
  );

  if (clone.hasChildNodes()) {
    for (const [index, entry] of clone.childNodes.entries()) {
      addAttributes(entry as CustomNode, node.childNodes[index] as CustomNode);
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
const tags: Record<string, (children: Children, attrs?: object) => CustomNode> = {};
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
};
