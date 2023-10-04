class Praxy {
  listeners = {};
  components = {};
  extensions = {};

  constructor(context) {
    this.data = context?.data ?? {};

    this.proxy = new Proxy(this.data, {
      set: (data, _key, value) => {
        const key = String(_key);

        if (this.listeners[key] != null && data[key] != value) {
          this.listeners[key]({data, key, value, self: this});
        }

        Reflect.set(data, key, value);
      },
    });
  }

  on(event, target, fire) {
    const els = document.querySelectorAll(target);

    if (!els?.length || fire == null) {
      console.error(
        `Praxy->on: No possible matches for "${target}" or no callback provided.`
      );
    }

    els.forEach((el) => {
      el.addEventListener(
        event,
        async ({target}) =>
          await fire({
            self: this,
            target: target,
          })
      );
    });
  }

  component(cmpt, mounted) {
    if (this.components[cmpt.name] != null) {
      throw new Error(`Component "${cmpt.name}" already exists`);
    }
    const uuids = [];
    const map = {};
    const target = cmpt.target ?? '#app';
    const el = document.querySelector(target);

    if (el == null) {
      throw new Error(`Your mount point "${target}" doesn't exist`);
    }

    this.components[cmpt.name] = cmpt;

    const tmp = document.createElement('template');
    tmp.innerHTML = cmpt.template.trim();

    const root = tmp.content.childNodes[0].cloneNode();

    const data = new Proxy(this.components[cmpt.name].data, {
      set: (data, key, value) => {
        const s = Reflect.set(data, key, value);
        this.map(root, uuids, data, map);
        this.render(root, map);
        return s;
      },
      get: (data, key) => {
        return Reflect.get(data, key);
      },
    });

    this.map(tmp.content, uuids, data, map);

    root.setAttribute('key', cmpt.name);
    root.append(tmp.cloneNode(true));
    el.append(root);

    this.render(root, map);

    if (mounted) {
      mounted.call(this, data);
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
      const domEl = root.querySelector(`[key="${key}"]`);
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
          domEl.replaceChild(node, domEl.childNodes[i]);
        });
      }
    });
  }

  map(node, uuids, data, map) {
    if (node.nodeName === '#text' || node.nodeName === '#comment') {
      return;
    }

    Array.from(node.children).forEach((child) => {
      this.map(child, uuids, data, map);

      // Child nodes that contain reactive data
      const hasReactives =
        Array.from(child.childNodes)?.some((c) =>
          c.nodeValue?.match(/{{(.*?)}}/g)
        ) ||
        (child.attributes && child.hasAttribute('key'));
      if (hasReactives) {
        const uuid = child.getAttribute('key') ?? this.generateUUID(uuids);

        if (!uuids.includes(uuid)) {
          uuids.push(uuid);
        }
        if (!child.hasAttribute('key')) {
          child.setAttribute('key', uuid);
        }

        const matches = map[uuid]?.keys ?? new Set();
        const clone = map[uuid]?.clone ?? child.cloneNode(true);
        const nodes = map[uuid]?.clone.childNodes ?? child.childNodes;

        const live = Array.from(nodes).map((node) => {
          const n = node.cloneNode(true);
          if (node.nodeName === '#text') {
            n.nodeValue = n.nodeValue.replace(/{{(.*?)}}/g, (match) => {
              const k = match.replace(/{{|}}/g, '').trim().split('.');
              matches.add(k[0]);
              let v = data[k[0]];
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
        };
      }
    });
  }

  generateUUID(uuids) {
    const uuid = Math.random().toString(36).substring(5);
    while (uuids.includes(uuid)) {
      return this.generateUUID(uuids);
    }
    return uuid;
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

  registerExtension(name, extension) {
    if (this.extensions[name] != null) {
      throw new Error(
        `Praxy->registerExtension: Extension "${name}" already exists`
      );
    }

    this.extensions[name] = extension.bind(this, {self: this});
  }
}
