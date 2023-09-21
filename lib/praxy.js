class Praxy {
  listeners = {};
  components = {};

  constructor(context) {
    this.data = context?.data ?? {};

    this.proxy = new Proxy(this.data, {
      set: (data, _key, value) => {
        const key = String(_key);

        if (this.listeners[key] != null && data[key] != value) {
          this.listeners[key]({data, key, value, self: this});
        }

        data[key] = value;

        return true;
      },
    });
  }

  set(key, value, listener) {
    if (this.listeners[key] == null && listener != null) {
      this.listeners[key] = listener;
    }

    this.update(`[a-text="${key}"]`, value);

    this.proxy[key] = value;
  }

  get(key) {
    return this.proxy[key];
  }

  /**
   * Listen for data changes
   * @param key
   * @param listener
   *
   * @example
   * App.listen('name', ({value}) => {
   *   console.log('Value of "name" changed to: ', value);
   * });
   */
  listen(key, listener) {
    if (this.listeners[key] != null) {
      return;
    }

    this.set(key, this.get(key), listener);
  }

  /**
   * Bind an event on a `HTMLInputElement` to some actions
   * @param event
   * @param target
   * @param fire
   *
   * @example
   * .on('input', '[name="test-input"]', ({self, target}) => {
   *   self.set('name', target.value);
   * });
   */
  on(event, target, fire) {
    const events = ['click', 'input', 'change', 'select'];
    const els = document.querySelectorAll(target);

    if (els == null || els.length === 0 || fire == null) {
      console.error(`Praxy->on: No possible matches for ${target}`);

      return this;
    }

    if (!events.includes(event)) {
      throw new Error(`${event} is not a valid event`);
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

  /**
   * Bind a value to multiple targets
   * @param targets DOM selector or key in data
   * @param value
   *
   * @example
   * App.bind(['name', '[name="input-1"]'], 'some value');
   */
  bind(targets, value) {
    targets.forEach((target) => {
      if (this.data[target] != null) {
        this.set(target, value);
      }

      if (this.getElements(target) != null) {
        this.update(target, value);
      }
    });
  }

  /**
   * Update DOM elements' value by target
   * @param target
   * @param value
   *
   * @example
   * App.update('[name="test"]', 'some value');
   */
  update(target, value) {
    const els = this.getElements(target);

    if (els == null) {
      return;
    }

    els.forEach((el) => {
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

  async fetch(url, options, target, cb) {
    const els = this.getElements(target);

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

  component(cmpt) {
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

    const regex = /{{[A-Z]+}}/gi;
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
        `<span a-text="${x}">${this.get(x)}</span>`
      );
    });

    el.insertAdjacentHTML('beforeend', template);

    return this;
  }

  componentExists(name) {
    return this.components[name] != null;
  }

  getElements(target) {
    const els = document.querySelectorAll(target);

    if (els == null || els.length === 0) {
      return;
    }

    return els;
  }
}
