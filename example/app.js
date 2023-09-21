const App = new Praxy();

App.registerExtension(
  'generateSelectOptions',
  function({self}, {target, items, map}) {
    target.forEach((t) => {
      items.forEach((product) => {
        const option = document.createElement('option');
        option.value = product[map.value];
        option.textContent = product[map.text];
        t.appendChild(option);
      });
    });
  }
)

const MyComponent = {
  name: 'myComponent',
  template: `
    <div>Hello {{entity}} My name is {{name}}.</div>
    <div id="injected-component-target"></div>
    <div>And I do love the {{easy}} of Praxy.</div>
    <input name="test-input" />
  `,
  data: {
    entity: 'World!',
    easy: 'simplicity',
    name: 'Sebastian',
  },
};

const MyInjectedComponent = {
  name: 'myInjectedComponent',
  target: '#injected-component-target',
  template: `
    <div>I was {{injection}}</div>
  `,
  data: {
    injection: 'injected!',
  },
};

App
  .component(MyComponent)
  .on(
    'input',
    '[name="test-input"]',
    ({self, target}) => {
      self.set('entity', target.value);
    }
  );

App
  .fetch(
    'https://dummyjson.com/products',
    {},
    '[name="select"]',
    async ({self, target, res}) => {
      const {products} = await res.json();
      self.extensions.generateSelectOptions({
        target,
        items: products,
        map: {value: 'id', text: 'title'}
      });
    }
  );

App.component(MyInjectedComponent);

