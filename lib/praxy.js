class Praxy {
  #events = [];
  components = {};

  constructor() {}

  component(cmpt, mounted) {
    const cmptName = cmpt.name ?? this.generateUUID(Object.keys(this.components));
    if (this.components[cmptName] != null) {
      throw new Error(`Praxy->component: "${cmptName}" already exists`);
    }

    const uuids = [];
    const map = {};
    const fors = {};
    const target = cmpt.target;
    const el = target ? document.querySelector(target) : document.body;

    if (el == null) {
      throw new Error(
        `Praxy->component: Your mount point "${target ?? document.body}" doesn't exist`
      );
    }

    this.components[cmptName] = cmpt;

    const tmp = document.createElement('template');
    tmp.innerHTML = cmpt.template.trim();

    if (tmp.content.childNodes.length > 1) {
      throw new Error(
        `Praxy->component: Your template for "${cmptName}" must have a single root element.`
      );
    }

    const root = tmp.content.childNodes[0].cloneNode();

    const data = new Proxy(this.components[cmptName].data, {
      set: (data, key, value) => {
        const s = Reflect.set(data, key, value);
        this.renderFor(root, data, uuids, fors, map);
        this.map(root, uuids, data, map);
        this.render(root, map);
        return s;
      },
      get: (data, key) => {
        return Reflect.get(data, key);
      },
    });

    this.renderFor(tmp.content, data, uuids, fors, map);
    this.map(tmp.content, uuids, data, map);

    root.setAttribute('k', cmptName);
    root.append(tmp.cloneNode(true));
    el.append(root);

    this.render(root, map);

    if (mounted) {
      mounted({
        data,
        on: this.on.bind(this),
        closest: this.closest.bind(this)
      });
    }
  }

  render(root, map) {
    const tmp = root.querySelector('template');
    if (
      root.children.length === 1 &&
      root.children[0].nodeName === 'TEMPLATE'
    ) {
      Array.from(tmp.content.children).forEach((child) => {
        root.append(child);
      });
    }

    Object.keys(map).forEach((key) => {
      const m = map[key];
      const domEl = root.querySelector(`[k="${key}"]`);
      if (!domEl) {
        delete map[key];
        return;
      }
      if (domEl.childNodes.length !== m.live.length) {
        console.warn(
          `Praxy->render: The number of live nodes (${m.live.length}) doesn't match the number of DOM nodes (${domEl.childNodes.length}).`,
          'This may be due to a change in the template. DOM have been synced to match again.'
        );
        while (domEl.firstChild) {
          domEl.removeChild(domEl.lastChild);
        }
        m.live.forEach((node) => {
          domEl.append(node);
        });
      }
      const domStr = Array.from(domEl.childNodes)
        .map((c) => c.nodeValue)
        .join('');
      const liveStr = m.live.map((c) => c.nodeValue).join('');
      if (domStr !== liveStr) {
        m.live.forEach((node, i) => {
          const c = domEl.childNodes[i];
          // don't replace nodes that's already been processed
          if (c.attributes && c.hasAttribute('k')) {
            return;
          }
          domEl.replaceChild(node, c);
        });
      }
    });
  }

  renderFor(root, data, uuids, fors, map) {
    root.querySelectorAll('[px-for]')?.forEach((el) => {
      const parent = el;
      const uuid = parent.getAttribute('k') ?? this.generateUUID(uuids);
      const f = fors[uuid];
      const children = Array.from(parent.children);
      const clone = f ? f.clone : parent.children[0].cloneNode(true);
      const firstRender = f == null;
      if (firstRender) {
        fors[uuid] = {
          clone,
          parent,
        };
      }
      const attr = parent.getAttribute('px-for');
      const [_, value] = attr.split(' in ');
      const arr = data[value];
      if (firstRender) {
        parent.setAttribute('k', uuid);
        for (let i = 0; i < arr.length; i++) {
          const c = clone.cloneNode(true);
          c.setAttribute('i', i);
          parent.append(c);
        }
        Array.from(parent.children)
          .find((c) => !c.hasAttribute('i'))
          ?.remove();
        return;
      }
      // sync nodes
      children.forEach((c) => {
        const index = c.getAttribute('i');
        const item = arr[index];
        if (item == null) {
          delete map[c.getAttribute('k')];
          c.remove();
        }
      });
      // sync data
      // TODO: The user could have re-ordered the array.
      // The current implementation always adds new items to the end.
      arr.forEach((_, i) => {
        const index = children[i]?.getAttribute('i');
        if (index == null) {
          const c = clone.cloneNode(true);
          this.#events.forEach(({event, target, fire}) => {
            this.on(event, target, fire, c, true);
          });
          c.setAttribute('i', i);
          parent.append(c);
        }
      });
    });
  }

  map(node, uuids, data, map) {
    if (node.nodeName === '#text' || node.nodeName === '#comment') {
      return;
    }

    Array.from(node.children).forEach((child) => {
      this.map(child, uuids, data, map);

      if (child.attributes && child.hasAttribute('px-for')) {
        return;
      }

      if (
        Array.from(child.childNodes)?.some((c) =>
          c.nodeValue?.match(/{{(.*?)}}/g)
        ) ||
        (child.attributes && child.hasAttribute('k'))
      ) {
        const uuid = child.getAttribute('k') ?? this.generateUUID(uuids);

        if (!child.hasAttribute('k')) {
          child.setAttribute('k', uuid);
        }

        const parent = child.parentNode;
        const isFor =
          parent.hasAttribute('px-for') ||
          child.hasAttribute('i') ||
          this.closest(child, 'i', null, 'px-for');
        const matches = map[uuid]?.keys ?? new Set();
        const clone = map[uuid]?.clone ?? child.cloneNode(true);
        const nodes = map[uuid]?.clone.childNodes ?? child.childNodes;

        const live = Array.from(nodes).map((node) => {
          const n = node.cloneNode(true);
          if (node.nodeName === '#text') {
            n.nodeValue = n.nodeValue.replaceAll(/{{(.*?)}}/g, (match) => {
              const k = match.replace(/{{|}}/g, '').trim().split('.');
              matches.add(k[0]);
              let v = data[k[0]];
              if (isFor) {
                const index =
                  this.closest(child, 'i')?.getAttribute(
                    'i'
                  ) ?? child.getAttribute('i');
                const parent = this.closest(
                  child,
                  'px-for'
                );
                const [_, values] = parent
                  .getAttribute('px-for')
                  ?.split(' in ');
                v = data[values][index];
                if (!v) {
                  throw new Error(
                    `Praxy->map: No value found for "${match}". This may be due to a change in the template.`
                  );
                }
              }
              if (match.includes('.')) {
                k.forEach((key) => {
                  if (v[key] != null) {
                    v = v[key];
                  }
                });
              }
              return v;
            });
          }
          return n;
        });

        map[uuid] = {
          live,
          clone,
          keys: matches,
          parent: child.parentNode.cloneNode(),
        };
      }
    });
  }

  closest(el, attrName, attrValue, end = document.body) {
    let parentNode = el.parentNode;
    while (parentNode != null) {
      const stop = typeof end === 'string' ? parentNode.hasAttribute(end) : end;
      if (parentNode === stop) {
        return;
      }
      if (attrValue == null) {
        if (parentNode.attributes && parentNode.hasAttribute(attrName)) {
          return parentNode;
        }
      } else if (
        parentNode.attributes &&
        parentNode.getAttribute(attrName) === attrValue
      ) {
        return parentNode;
      }
      parentNode = parentNode.parentNode;
    }
    return;
  }

  generateUUID(uuids) {
    const uuid = Math.random().toString(36).substring(5);
    while (uuids.includes(uuid)) {
      return this.generateUUID(uuids);
    }
    uuids.push(uuid);
    return uuid;
  }

  on(event, target, fire, parent, silent = false) {
    const els = (parent ?? document).querySelectorAll(target);
    if (!els?.length || fire == null) {
      if (!silent) {
        console.error(
          `Praxy->on: No possible matches for "${target}" or no callback provided.`
        );
      }
    }

    els.forEach((el) => {
      if (!this.#events.find((ev) => ev.target === target)) {
        this.#events.push({event, target, fire});
      }

      el.addEventListener(
        event,
        async ({target}) =>
          await fire({
            self: this,
            target,
          })
      );
    });
  }

  async fetch(url, options, target, cb) {
    const els = document.querySelectorAll(target);

    if (!url) {
      throw new Error('Praxy->fetch: You must provide a URL');
    }
    if (els == null) {
      throw new Error(`Praxy->fetch: No possible matches for ${target}`);
    }

    cb({
      self: this,
      target: els,
      res: await fetch(url, options),
    });
  }
}

function html(...strings) {
  return strings.join('');
}

export {Praxy, html};
