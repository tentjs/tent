type Data = Record<string, unknown>;
type Listeners = Record<string, (context: IListener) => void>;
type Components = Record<string, Component>;
type OnEvents = 'click' | 'input' | 'change' | 'select';
type OnFire = (context: {self: Praxy; target: HTMLInputElement}) => void;

type AppContext = {
  data: Data; 
  components?: Components;
};

type IListener = {
  self: Praxy;
  data: Data;
  key: string;
  value: unknown;
};

type Component = {
  name: string;
  data: Data;
  template: string;
  target?: string;
  mount?: (context: {self: Praxy}) => void;
};

class Praxy {
  private data: Data;
  private proxy: Data;
  private listeners: Listeners = {};
  private components: Components = {};

  constructor(context: AppContext) {
    const {data, components} = context;

    this.data = data;

    for (const key in components) {
      for (const k in components[key].data) {
        if (this.data[k] != null) {
          throw new Error(
            `You are not allowed to override data for property \`${k}\` with "${components[key].data[k]}" in ${components[key].name}.`
          );
        }

        this.data[k] = components[key].data[k];
      }
    }

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

    this.mountComponents(components);
  }

  public set(
    key: string,
    value: unknown,
    listener?: (context: IListener) => unknown
  ): void {
    if (this.listeners[key] == null && listener != null) {
      this.listeners[key] = listener;
    }

    this.update(`[a-text="${key}"]`, value);

    this.proxy[key] = value;
  }

  public get(key: string): unknown {
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
  public listen(key: string, listener: (context: IListener) => void): void {
    if (this.listeners[key] != null) {
      throw new Error(
        `You are not allowed to override a listener. Tried to set listener for "${key}".`
      );
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
  public on(
    event: OnEvents,
    target: string,
    fire: OnFire,
  ): Praxy {
    const events = ['click', 'input', 'change', 'select'];
    const el = document.querySelector(target);

    if (el == null || fire == null) {
      console.error(`Praxy->on: No possible matches for ${target}`);

      return this;
    }

    if (!events.includes(event)) {
      throw new Error(`${event} is not a valid event`);
    }

    el.addEventListener(event, ({target}) =>
      fire({
        self: this,
        target: target as HTMLInputElement,
      })
    );

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
  public bind(targets: string[], value: unknown): void {
    targets.forEach((target: string) => {
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
  private update(target: string, value: unknown): void {
    const els = this.getElements(target);

    if (els == null) {
      return;
    }

    els.forEach((el) => {
      switch (el.nodeName) {
        case 'INPUT':
          (el as HTMLInputElement).value = `${value}`;
          break;

        default:
          el.textContent = `${value}`;
      }
    });
  }

  private component(cmpt: Component): void {
    if (this.components[cmpt.name] != null) {
      throw new Error(`Component "${cmpt.name}" already exists`);
    }

    this.components[cmpt.name] = cmpt;

    const el = document.querySelector(cmpt.target ?? '#app');

    if (el == null) {
      throw new Error(`Your target parent ${cmpt.target} does not exist`);
    }

    const regex = /{{[A-Z]+}}/gi;
    const matches = cmpt.template.match(regex).map((x) => x.replace('{{', '').replace('}}', ''));
    const exists = matches.every((x) => this.data[x] != null);

    if (!exists) {
      throw new Error('Some of your interpolation keys does not exist');
    }

    let template: string;
    matches.forEach((x) => {
      template = (template ?? cmpt.template).replaceAll(
        `{{${x}}}`,
        `<span a-text="${x}">${this.get(x)}</span>`
      );
    });

    el.insertAdjacentHTML('beforeend', template);

    if (cmpt.mount != null) {
      cmpt.mount({self: this});
    }
  }

  private getElements(target: string): NodeList | null {
    const els = document.querySelectorAll(target);

    if (els == null || els.length === 0) {
      return;
    }

    return els;
  }

  private mountComponents(components: Components): void {
    for (const key in components) {
      this.component(components[key]);
    }
  }
}

const MyComponent: Component = {
  name: 'myComponent',
  template: `
    <div>Hello {{entity}} My name is {{name}}.</div>
    <div>And I do love the {{easy}} of Praxy.</div>
  `,
  data: {
    entity: 'World!',
  },
};

const MyComponent2: Component = {
  name: 'myComponent2',
  template: `
    <div>My other love is books, and this is my favorite: {{book}}</div>
  `,
  data: {
    book: '...',
  },
};

const App = new Praxy({
  data: {
    name: 'Linus',
    easy: 'simplicity'
  },
  components: {
    MyComponent,
    MyComponent2,
  },
});

App
  .on('click', '.button', async ({self}) => {
    self.bind(['name', '[name="test-input2"]'], 'Sebastian');

    const res = await fetch(
      'https://www.anapioficeandfire.com/api/books',
      {headers: {'Content-Type': 'application/json'}, method: 'GET'}
    );
    const books = await res.json();

    self.set('book', books[0].name);
  })
  .on('input', '[name="test-input"]', ({self, target}) => {
    self.set('entity', target.value);
  })
  .on('input', '[name="test-input2"]', ({self, target}) => {
    self.set('name', target.value);
  });
