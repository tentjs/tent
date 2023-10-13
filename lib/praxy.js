class Praxy {
  #events = [];
  #components = {};
  #store = {};

  constructor(ctx = {}) {
    this.#store = this.#createStore(ctx);
  }

  async component(cmpt, mounted) {
    const uuids = [];

    if (!cmpt.name) {
      throw new Error(`Praxy->component: You must provide a name for your component.`);
    }
    if (this.#components[cmpt.name] != null) {
      throw new Error(`Praxy->component: "${cmpt.name}" already exists`);
    }

    const map = {};
    const fors = {};
    const target = cmpt.target;
    const el = target ? document.querySelector(target) : document.body;
    const customEl = document.querySelector(cmpt.name);

    if (!el && !customEl) {
      throw new Error(
        `Praxy->component: Your mount point "${target ?? document.body}" doesn't exist`
      );
    }

    this.#components[cmpt.name] = {
      ...cmpt,
      fors,
    };

    if (cmpt.store?.init && typeof cmpt.store.init === 'function') {
      const o = await cmpt.store.init();
      if (typeof o !== 'object') {
        throw new Error(`Praxy->component: Your store for "${cmpt.name}" must return an object.`);
      }
      const storage = JSON.parse(window.sessionStorage.getItem(this.#store.$name));
      for (const k in o) {
        if (o.hasOwnProperty(k)) {
          this.#store[k] = storage?.[k] ? storage[k] : o[k];
        }
      }
    }

    const tmp = document.createElement('template');
    // TODO: Consider creating the template from the DOM instead.
    // This might be easier for the user to understand, and it's separation of concerns.
    tmp.innerHTML = cmpt.template.trim();
    if (tmp.content.children.length > 1 || tmp.content.children.length === 0) {
      throw new Error(
        `Praxy->component: Your template for "${cmpt.name}" must have a single root element.`
      );
    }

    const root = tmp.content.children[0].cloneNode();

    const sample = cmpt.inherit ? this.#components[cmpt.inherit].data : cmpt.data;
    const data = new Proxy(sample ?? {}, {
      set: (data, key, value) => {
        const s = Reflect.set(data, key, value);
        this.#for(root, uuids, data, map, fors);
        this.#map(root, uuids, data, map);
        this.#render(root, map);
        return s;
      },
      get: (data, key) => {
        return Reflect.get(data, key);
      },
    });

    this.#for(tmp.content, uuids, data, map, fors);
    this.#map(tmp.content, uuids, data, map);
    this.#components[cmpt.name].data = data;

    if (tmp.content.children.length > 1) {
      root.append(tmp.content.children[0].cloneNode(true));
    } else {
      tmp.content.children[0].childNodes.forEach((node) => {
        root.append(node.cloneNode(true));
      });
      if (tmp.content.children[0].attributes) {
        for (const attr of tmp.content.children[0].attributes) {
          root.setAttribute(attr.name, attr.value);
        }
      }
    }
    if (customEl) {
      customEl.replaceWith(root);
    } else {
      el.append(root);
    }

    this.#render(root, map);

    mounted?.({
      data,
      root,
      on: this.#on.bind(this),
      closest: this.#closest.bind(this),
      $store: this.#store,
    });
  }

  #createStore(ctx) {
    return ctx.store
      ? new Proxy(
        {
          $name: ctx.store?.name ?? 'praxy-store',
          $persist: ctx.store?.persist ?? 'sessionStorage',
        },
        {
          set: (data, key, value) => {
            if (key.startsWith('$')) {
              throw new Error(`Praxy->store: "${key}" is a reserved key.`);
            }
            const s = Reflect.set(data, key, value);
            const components = Object.entries(this.#components);
            for (const [, cmpt] of components) {
              if (cmpt.store?.subscribe?.includes(key) && cmpt.data[key] !== data[key]) {
                cmpt.data[key] = data[key];
              }
              if (ctx?.store?.persist) {
                const storage = window[data.$persist];
                if (!storage) {
                  throw new Error(
                    `Praxy->store: "${data.$persist}" is not a valid storage type.`
                  );
                }
                const x = storage.getItem(data.$name);
                const z = x ? JSON.parse(x) : {};
                z[key] = data[key];
                storage.setItem(data.$name, JSON.stringify(z));
              }
            }
            return s;
          },
          get: (data, key) => {
            return Reflect.get(data, key);
          },
        }
      )
      : {};
  }

  #map(node, uuids, data, map) {
    if (!node.children || Object.keys(data).length === 0) {
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      this.#map(child, uuids, data, map);

      if (child.attributes && child.hasAttribute('px-for')) {
        return;
      }

      const isFor =
        (child.parentNode.attributes && child.parentNode.hasAttribute('px-for')) ||
        child.hasAttribute('i') ||
        this.#closest(child, 'i', null, 'px-for');

      if (child.attributes) {
        const uuid = child.getAttribute('k') ?? this.#uuid(uuids);
        const clone = map[uuid]?.clone ?? child.cloneNode(true);
        for (const attr of clone.attributes) {
          const k = attr.value.replace(/{{|}}/g, '').trim().split('.');
          const v = this.#getValue(child, data, k, attr.value, isFor);
          if (attr.name === 'px-if') {
            map[uuid] = {
              clone,
              condition: v,
            };
          } else if (attr.value.match(/{{(.*?)}}/g)) {
            const attributes = {
              ...map[uuid]?.attributes,
              [attr.name]: v,
            };
            map[uuid] = {
              clone,
              attributes,
            };
          }
          if (!child.hasAttribute('k')) {
            child.setAttribute('k', uuid);
          }
        }
      }

      if (
        Array.from(child.childNodes)?.some((c) => c.nodeValue?.match(/{{(.*?)}}/g)) ||
        (child.attributes && child.hasAttribute('k'))
      ) {
        const uuid = child.getAttribute('k') ?? this.#uuid(uuids);
        if (!child.hasAttribute('k')) {
          child.setAttribute('k', uuid);
        }
        const matches = map[uuid]?.keys ?? new Set();
        const clone = map[uuid]?.clone ?? child.cloneNode(true);
        const nodes = map[uuid]?.clone.childNodes ?? child.childNodes;

        const live = Array.from(nodes).map((node) => {
          const n = node.cloneNode(true);
          if (node.nodeName === '#text') {
            n.nodeValue = n.nodeValue.replaceAll(/{{(.*?)}}/g, (match) => {
              const isTernary = match.includes('?') && match.includes(':');
              let k = match.replace(/{{|}}/g, '').trim();
              if (isTernary) {
                const [lh, rh] = k.split('?');
                const key = lh.trim().split('.');
                const match = lh.trim();
                const [v1, v2] = rh.split(':');
                const v = this.#getValue(child, data, key, match, isFor);
                const val = v ? v1.trim() : v2.trim();
                if (!val.includes("'") && !val.includes('"')) {
                  // the evaluated value is a variable
                  const loopItem = this.#getValue(child, data, [val], val, isFor);
                  const rootValue = this.#getValue(child, data, [val], val, false);
                  return loopItem[val] ?? rootValue;
                }
                matches.add(key);
                return val.replaceAll(/['"]/g, '');
              } else {
                k = k.split('.');
              }
              matches.add(k[0]);
              return this.#getValue(child, data, k, match, isFor);
            });
          }
          return n;
        });

        map[uuid] = {
          ...map[uuid],
          live,
          clone,
          keys: matches,
          parent: child.parentNode.cloneNode(),
        };
      }
    }
  }

  #render(root, map) {
    Object.keys(map).forEach((key) => {
      const m = map[key];
      const domEl =
        root.children.length === 0 || (root.attributes && root.getAttribute('k') === key)
          ? root
          : root.querySelector(`[k="${key}"]`);
      if (!domEl && !m.attributes && m.condition == null) {
        delete map[key];
        return;
      }
      if (m.condition != null) {
        if (!domEl && m.condition === false) {
          return;
        }
        if (m.condition) {
          const placeholder = document.querySelector(`px-if[k="${key}"]`);
          if (placeholder) {
            m.clone.setAttribute('px-if', m.clone.getAttribute('px-if'));
            m.clone.setAttribute('k', key);
            placeholder.replaceWith(m.clone);
          }
        } else {
          const placeholder = document.createElement('px-if');
          placeholder.setAttribute('k', key);
          placeholder.setAttribute('px-if', m.clone.getAttribute('px-if'));
          domEl.replaceWith(placeholder);
        }
      }
      if (m.attributes) {
        for (const [name, value] of Object.entries(m.attributes)) {
          if (value) {
            domEl.setAttribute(name, typeof value === 'boolean' ? '' : value);
          } else {
            domEl.removeAttribute(name);
          }
        }
      }
      const domStr = Array.from(domEl.childNodes)
        .map((c) => c.nodeValue)
        .join('');
      const liveStr = m.live.map((c) => c.nodeValue).join('');
      if (domStr !== liveStr) {
        m.live.forEach((node, i) => {
          const c = domEl.childNodes[i];
          if (!c) {
            return;
          }
          // don't replace nodes that's already been processed
          if (c.attributes && c.hasAttribute('k')) {
            return;
          }
          if (!c.isEqualNode(node)) {
            domEl.replaceChild(node, c);
          }
        });
      }
    });
  }

  #for(root, uuids, data, map, fors) {
    if (Object.keys(data).length === 0) {
      return;
    }
    root.querySelectorAll('[px-for]')?.forEach((el) => {
      const parent = el;
      const uuid = parent.getAttribute('k') ?? this.#uuid(uuids);
      const f = fors[uuid];
      const children = Array.from(parent.children);
      const clone = f ? f.clone : children[0]?.cloneNode(true);
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
        for (let i = 0; i < arr?.length; i++) {
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
            this.#on(event, target, fire, c, true);
          });
          c.setAttribute('i', i);
          parent.append(c);
        }
      });
    });
  }

  #getValue(child, data, k, match, isFor) {
    let v = data[k[0]];
    if (isFor) {
      const index = this.#closest(child, 'i')?.getAttribute('i') ?? child.getAttribute('i');
      const parent = this.#closest(child, 'px-for');
      const [_, values] = parent.getAttribute('px-for')?.split(' in ');
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
  }

  #closest(el, attrName, attrValue, end = document.body) {
    let parent = el.parentNode;
    while (parent != null) {
      const stop = typeof end === 'string' ? parent.attributes && parent.hasAttribute(end) : end;
      if (parent === stop) {
        return;
      }
      if (attrValue == null) {
        if (parent.attributes && parent.hasAttribute(attrName)) {
          return parent;
        }
      } else if (parent.attributes && parent.getAttribute(attrName) === attrValue) {
        return parent;
      }
      parent = parent.parentNode;
    }
    return;
  }

  #uuid(uuids) {
    const uuid = Math.random().toString(36).substring(5);
    while (uuids.includes(uuid)) {
      return this.#uuid(uuids);
    }
    uuids.push(uuid);
    return uuid;
  }

  #on(event, target, fire, parent, silent = false) {
    const els = (parent ?? document).querySelectorAll(target);
    if (!els?.length || fire == null) {
      if (!silent) {
        console.error(`Praxy->on: No possible matches for "${target}" or no callback provided.`);
      }
    }

    els.forEach((el) => {
      if (!this.#events.find((ev) => ev.target === target)) {
        this.#events.push({event, target, fire});
      }

      el.addEventListener(event, async ({target}) => {
        let item = null;
        let $el = null;
        let cmptName = null;
        const loop = this.#closest(target, 'px-for');
        if (loop) {
          const k = loop.getAttribute('k');
          const [_, values] = loop.getAttribute('px-for')?.split(' in ');
          for (const [, value] of Object.entries(this.#components)) {
            if (value.fors[k] != null) {
              cmptName = value.name;
            }
          }
          const data = this.#components[cmptName]?.data;
          const closest = this.#closest(target, 'i');
          const i = closest?.getAttribute('i');
          item = data?.[values]?.[i];
          $el = closest;
        }
        await fire({
          target,
          item,
          $el,
        });
      });
    });
  }
}

function html(...strings) {
  return strings.join('');
}

export {Praxy, html};
