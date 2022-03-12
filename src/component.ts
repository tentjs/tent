import {App} from "./App";

const MyComponent = {
  name: 'myComponent',
  template: /* html */`
    <div>Hello {{entity}} My name is {{name}}.</div>
    <div>And I do love the {{easy}} of Praxy.</div>
    <input name="test-input" />
  `,
  data: {
    entity: 'World!',
    easy: 'simplicity',
    name: 'Sebastian'
  },
};

App
  .component(MyComponent)
  .on('input', '[name="test-input"]', async ({self, target}) => {
    self.set('entity', target.value);
  });