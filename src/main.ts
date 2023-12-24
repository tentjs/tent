type Component = {
  view: (context: {state: object}) => CustomNode;
  state?: object;
  mounted?: (context: {state: object}) => void;
};

type CustomNode = Node & Element & HTMLElement & {
  $tent: {
    attributes: object;
    isComponent: boolean;
  };
  children: CustomNode[];
};

function mount(el: HTMLElement | null, component: Component) {
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
    : {};

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

function createElement(context: Context) {
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
          Array.isArray(c) ? createElement(c) : c,
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
      elm.setAttribute(key, attributes[key]);
    }
  }

  return elm;
}

function walker(oldNode: CustomNode, newNode: CustomNode) {
  const lc = Array.from<CustomNode>(newNode.children);

  if (oldNode.children.length < lc.length) {
    lc.forEach((x, index) => {
      if (!oldNode.children[index]) {
        oldNode.append(x.cloneNode(true));
      }
    });
  }

  Array.from<CustomNode>(oldNode.children).forEach((sChild, index) => {
    const lChild = lc[index];

    if (lChild?.$tent?.isComponent || sChild?.$tent?.isComponent) {
      return;
    }

    if (!lChild) {
      sChild.remove();
      return;
    }

    if (sChild.tagName !== lChild.tagName) {
      sChild.replaceWith(lChild);
    }

    // Add children that are not present in the shadow
    if (sChild.children.length < lChild.children.length) {
      const scc = Array.from(sChild.children);

      Array.from<CustomNode>(lChild.children).forEach((lcc, index) => {
        if (!scc[index]) {
          const clone = lcc.cloneNode(true);

          // Add attributes to the clone
          Object.keys(lcc.$tent.attributes).forEach(
            (key) => clone[key] = lcc.$tent.attributes[key],
          );

          sChild.append(clone);
        }
      });
    }

    // Remove children that are not present in the live
    if (sChild.children.length > lChild.children.length) {
      const lcc = Array.from(lChild.children);

      Array.from(sChild.children).forEach((x, index) => {
        if (!lcc[index]) {
          x.remove();
        }
      });
    }

    // Add attributes that are not present in the shadow
    Array.from(lChild.attributes).forEach((attr) => {
      if (sChild.getAttribute(attr.name) !== attr.value) {
        sChild.setAttribute(attr.name, attr.value);
      }
    });
    // Remove attributes that are not present in the live
    Array.from(sChild.attributes).forEach((attr) => {
      if (!lChild.hasAttribute(attr.name)) {
        sChild.removeAttribute(attr.name);
      }
    });

    // Replace text content if it's different and the element has no children
    if (
      sChild.textContent !== lChild.textContent &&
      lChild.children.length === 0 &&
      sChild.children.length === 0
    ) {
      sChild.textContent = lChild.textContent;
    }

    walker(sChild, lChild);
  });
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
      createElement([tag, children, attrs]),
);

export {mount, tags};
