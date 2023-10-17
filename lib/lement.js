export function L(as, opts = {}) {
  const {children = [], mount, data, ...attributes} = opts;
  const el = document.createElement(as);
  for (const attr in attributes) {
    const a = attributes[attr];
    if (typeof a === 'function') {
      el[attr] = data != null ? a.bind(data) : a;
    } else {
      el.setAttribute(attr, opts[attr]);
    }
  }
  const $data = data ? new Proxy(data, {
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      const s = Reflect.set(target, key, value);
      render();
      return s;
    },
  }) : null;
  const render = () => {
    const ch = typeof children === 'function' ? children({data: $data}) : Array.from(children);
    if (el.children.length === 0) {
      el.append(...ch);
      return;
    }
    const t = (ch, compare) => {
      let i = 0;
      for (const child of ch) {
        const dom = compare.children[i];
        if (dom && !dom.isEqualNode(child)) {
          if (dom.children.length === 0) {
            dom.replaceWith(child);
          }
          const domChildren = Array.from(dom.children);
          const childChildren = Array.from(child.children);
          if (childChildren.length > domChildren.length) {
            let j = 0;
            for (const c of childChildren) {
              if (!domChildren[j]) {
                dom.append(c);
              }
              j++;
            }
          }
          if (domChildren.length > childChildren.length) {
            let j = 0;
            for (const c of domChildren) {
              if (!childChildren[j]) {
                for (const attr of c.attributes) {
                  if (attr.name.startsWith('on')) {
                    c[attr.name] = null;
                  }
                }
                c.remove();
              }
              j++;
            }
          }
          t(childChildren, dom);
        }
        i++;
      }
    };
    t(ch, el);
  };
  render();
  if (mount) {
    mount.append(el);
  } else {
    return el;
  }
}

