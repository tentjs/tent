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

  set(key, value, listener) {
    if (this.listeners[key] == null && listener != null) {
      this.listeners[key] = listener;
    }

    this.update(`[a-text="${key}"]`, value);

    return Reflect.set(this.proxy, key, value);
  }

  get(key) {
    return Reflect.get(this.proxy, key);
  }

  listen(key, listener) {
    if (this.listeners[key] != null) {
      return;
    }

    this.set(key, this.get(key), listener);
  }

  on(event, target, fire) {
    const els = document.querySelectorAll(target);

    if (!els?.length || fire == null) {
      console.error(`Praxy->on: No possible matches for ${target} or no callback provided.`);

      return this;
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

    return this;
  }

  update(target, value) {
    const els = document.querySelectorAll(target);

    els?.forEach((el) => {
      switch (el.nodeName) {
        case 'INPUT':
        case 'SELECT':
          el.value = `${value}`;
          break;

        default:
          el.textContent = `${value}`;
      }
    });
  }

  component(cmpt, mounted) {
    if (this.componentExists(cmpt.name)) {
      throw new Error(`Component "${cmpt.name}" already exists`);
    }

    this.components[cmpt.name] = cmpt;

    for (const key in this.components[cmpt.name].data) {
      if (this.data[key] != null) {
        throw new Error(
          `You are not allowed to override data for property \`${key}\` with "${this.components[key].data[key]}" in ${this.components[key].name}.`
        );
      }

      this.data[key] = this.components[cmpt.name].data[key];
    }

    const target = cmpt.target ?? '#app';
    const el = document.querySelector(target);

    if (el == null) {
      throw new Error(`Your target parent ${target} does not exist`);
    }

    const regex = /{{[A-Z0-9]+}}/gi;
    const regexMatches = cmpt.template.match(regex);

    if (regexMatches == null || regexMatches.length === 0) {
      el.insertAdjacentHTML('beforeend', cmpt.template);

      return this;
    }

    const matches = regexMatches.map((x) =>
      x.replace('{{', '').replace('}}', '')
    );
    const exists = matches.every((x) => this.data[x] != null);

    if (!exists) {
      throw new Error('Some of your interpolation keys does not exist');
    }

    let template;
    matches.forEach((x) => {
      template = (template ?? cmpt.template).replaceAll(
        `{{${x}}}`,
        `${this.get(x)}<!--{{${x}}}-->`
      );
    });

    el.insertAdjacentHTML('beforeend', template);

    if (mounted) {
      mounted.call(this);
    }
  }

  componentExists(name) {
    return this.components[name] != null;
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
      throw new Error(`Praxy->registerExtension: Extension "${name}" already exists`);
    }

    this.extensions[name] = extension.bind(this, {self: this});
  }
}
