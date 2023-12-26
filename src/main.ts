type Component<S = object> = {
  view: (context: {state: S}) => CustomNode;
  state: S;
  mounted?: (context: {state: S}) => void;
};

type CustomNode = Node & Element & HTMLElement & {
  $tent: {
    attributes: object;
    isComponent: boolean;
  };
  children: CustomNode[];
};

function mount<S = object>(el: HTMLElement | null, component: Component<S>) {
  const {state, view, mounted} = component;
  let node: CustomNode;

  if (el == null) {
    return;
  }

  const proxy = state
    ? new Proxy({...state}, {
      set(obj, prop, value) {
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
    })
    : {} as S;

  node = view({state: proxy});
  node.$tent = {
    attributes: {},
    isComponent: true,
  };

  el.append(node);

  mounted?.({state: proxy});
}

type Children = string | (Node | Context)[]
type Context = [string, Children, object | undefined];

function createTag(context: Context) {
  const [tag, children, attributes] = context;
  const elm = document.createElement(tag) as CustomNode;

  elm.$tent = {
    attributes: {},
    isComponent: false,
  };

  if (Array.isArray(children)) {
    children.forEach(
      (c) =>
        elm.append(
          Array.isArray(c) ? createTag(c) : c,
        ),
    );
  } else {
    elm.append(children);
  }

  for (const key in attributes) {
    elm.$tent.attributes[key] = attributes[key];

    if (key.startsWith("on") || /[A-Z]/.test(key)) {
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

  if (oldNode.children.length < nc.length) {
    nc.forEach((x, index) => {
      if (!oldNode.children[index]) {
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

    if (!nChild) {
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
        if (!occ[index]) {
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
        if (!ncc[index]) {
          x.remove();
        }
      });
    }

    // Add attributes that are not present in the old node
    Array.from(nChild.attributes).forEach((attr) => {
      if (oChild.getAttribute(attr.name) !== attr.value) {
        oChild.setAttribute(attr.name, attr.value);
      }
    });
    // Remove attributes that are not present in the new node
    Array.from(oChild.attributes).forEach((attr) => {
      if (!nChild.hasAttribute(attr.name)) {
        oChild.removeAttribute(attr.name);
      }
    });

    // Replace text content if it's different and the element has no children
    if (
      oChild.textContent !== nChild.textContent &&
      nChild.children.length === 0 &&
      oChild.children.length === 0
    ) {
      oChild.textContent = nChild.textContent;
    }

    walker(oChild, nChild);
  });
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

export {mount, tags, type Component};
