type Component = {
  view: (context: {state: object}) => OneNode;
  state?: object;
  mounted?: (context: {state: object}) => void;
};

type OneNode = Node & Element & HTMLElement & {
  $one: {
    attributes: object;
    isComponent: boolean;
  };
  children: OneNode[];
};

function mount(el: Element, component: Component) {
  const {state, view, mounted} = component;
  let node: OneNode;

  if (!(el instanceof HTMLElement)) {
    throw new Error("The element passed to mount is not an HTMLElement.");
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
  node.$one = {
    attributes: {},
    isComponent: true,
  };

  el.append(node);

  mounted?.({state: proxy});
}

type Context = [string, string | (Node | Context)[], object];

function createElement(context: Context) {
  const [tag, children, attributes] = context;
  const elm = document.createElement(tag) as OneNode;

  elm.$one = {
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
    elm.$one.attributes[key] = attributes[key];

    if (key.startsWith("on") || /[A-Z]/.test(key)) {
      elm[key] = attributes[key];
    } else {
      elm.setAttribute(key, attributes[key]);
    }
  }

  return elm;
}

function walker(oldNode: OneNode, newNode: OneNode) {
  const lc = Array.from<OneNode>(newNode.children);

  if (oldNode.children.length < lc.length) {
    lc.forEach((x, index) => {
      if (!oldNode.children[index]) {
        oldNode.append(x.cloneNode(true));
      }
    });
  }

  Array.from<OneNode>(oldNode.children).forEach((sChild, index) => {
    const lChild = lc[index];

    if (lChild?.$one?.isComponent || sChild?.$one?.isComponent) {
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

      Array.from<OneNode>(lChild.children).forEach((lcc, index) => {
        if (!scc[index]) {
          const clone = lcc.cloneNode(true);

          // Add attributes to the clone
          Object.keys(lcc.$one.attributes).forEach(
            (key) => clone[key] = lcc.$one.attributes[key],
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
  "svg",
  "path",
  "circle",
  "rect",
  "polygon",
  "polyline",
  "ellipse",
  "embed",
  "object",
  "param",
  "source",
  "track",
  "nav",
  "header",
  "footer",
  "main",
  "section",
  "article",
  "aside",
  "details",
  "summary",
  "figure",
  "figcaption",
  "mark",
  "small",
  "strong",
  "sub",
  "sup",
  "time",
  "del",
  "ins",
  "kbd",
  "samp",
  "var",
  "b",
  "i",
  "u",
  "s",
  "q",
  "dfn",
  "abbr",
  "cite",
  "address",
  "bdo",
  "ruby",
  "rt",
  "rp",
];
const tags = {};
t.forEach(
  (tag) =>
    tags[tag] = (children = [], attrs = {}) =>
      createElement([tag, children, attrs]),
);

export {mount, tags};
