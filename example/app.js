const App = new Praxy();

// The function would be imported from a separate package,
// but for the sake of this example, the function is defined in ./extensions.js
// and included in ./index.html as a script tag
App.registerExtension(
  'generateSelectOptions',
  generateSelectOptions,
)

const MyComponent = {
  name: 'myComponent',
  template: html`
    <div>Hello {{entity}} My name is {{name}}.</div>
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

App.component(MyComponent, function() {
  this.on('input', '[name="test-input"]', ({target}) => {
    this.set('entity', target.value);
  });
});

App
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

function html(...values) {
  return values.join('');
}
