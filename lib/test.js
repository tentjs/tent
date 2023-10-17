function L(as, opts = {}) {
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
          const childWasAdded = childChildren.length > domChildren.length;
          const childWasRemoved = domChildren.length > childChildren.length;
          if (childWasAdded) {
            let j = 0;
            for (const c of childChildren) {
              if (!domChildren[j]) {
                dom.append(c);
              }
              j++;
            }
          }
          if (childWasRemoved) {
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

L('div', {
  mount: document.body,
  children: [
    L('div', {
      data: {
        amount: 0,
        text: '',
        errors: [],
        items: [
          {id: 1, name: 'JS', description: 'JavaScript is nice', subtitle: 'JSX'},
          {id: 2, name: 'Svelte', description: 'Svelte is cool', subtitle: 'SvelteX'},
          {id: 3, name: 'Praxy', description: 'Praxy is awesome', subtitle: 'PraxyX'},
        ],
      },
      children: ({data}) => [
        L('ul', {
          children: data.items.map((item) =>
            L('li', {
              children: [
                L('strong', {children: [item.name]}),
                L('p', {children: [item.description], style: 'margin: 0'}),
                L('p', {
                  children: [
                    L('span', {children: [item.subtitle]})
                  ],
                  style: 'margin: 0'
                }),
              ],
              style: 'margin-bottom: 0.5em',
            }),
          ),
        }),
        L('button', {
          name: 'my-button',
          children: [
            data.amount ? `Clicked ${data.amount} times` : 'Click me'
          ],
          onclick() {
            data.amount = data.amount + 1;
            const items = [...data.items];
            items[0].name = 'React';
            items[1].subtitle = 'ReactX';
            data.items = items;
          },
        }),
        L('div', {
          children: [
            L('input', {
              type: 'text',
              onblur(e) {
                data.text = e.target.value;
                data.errors = ['Error 1', 'Error 2'];
              },
            }),
            L('p', {children: [data.text]}),
            L('p', {children: [data.errors.join(', ')]}),
          ],
        }),
      ],
    }),
  ],
});
