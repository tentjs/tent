const App = new Praxy();

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
  .on('change', '[name="select"]', ({target}) => {
    console.log(target.value, 'selected!');
  })
  .fetch(
    'https://dummyjson.com/products',
    {},
    '[name="select"]',
    async ({self, target, res}) => {
      const {products} = await res.json();
      target.forEach((t) => {
        products.forEach((product) => {
          const option = document.createElement('option');
          option.value = product.id;
          option.textContent = product.title;
          t.appendChild(option);
        });
      });
    }
  );

App.component(MyInjectedComponent);

