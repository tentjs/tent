const App = new Praxy();

// The function would be imported from a separate package
// For the sake of this example, the function is defined in ./extensions.js
// and included in ./index.html as a script tag
App.registerExtension(
  'generateSelectOptions',
  generateSelectOptions,
)

const MyComponent = {
  name: 'myComponent',
  template: `
    <div>Hello {{entity}} My name is {{name}}.</div>
    <div id="injected-component-target"></div>
    <div>And I do love the {{easy}} of Praxy.</div>
    <input name="test-input" />
    <div>This is the selected value: {{selected}}</div>
    <div>This is the selected value of select2: {{selected2}}</div>
  `,
  data: {
    entity: 'World!',
    easy: 'simplicity',
    name: 'Sebastian',
    selected: '',
    selected2: '',
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
  .component(MyInjectedComponent)

App
  .on(
    'input',
    '[name="test-input"]',
    ({self, target}) => {
      self.set('entity', target.value);
    }
  )
  .on(
    'change',
    '[name="select"]',
    ({self, target}) => {
      self.set('selected', target.value);
    }
  )
  .on(
    'change',
    '[name="select2"]',
    ({self, target}) => {
      self.set('selected2', target.value);
    }
  )
  .fetch(
    'https://dummyjson.com/products',
    {},
    '[name="select"], [name="select2"]',
    async ({self, target, res}) => {
      const {products} = await res.json();
      self.extensions.generateSelectOptions({
        target,
        items: products,
        map: {value: 'id', text: 'title'}
      });
    }
  );

