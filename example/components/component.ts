import {App} from '../App';

const MyComponent = {
  name: 'myComponent',
  template: /* html */ `
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
  template: /* html */ `
    <div>I was {{injection}}</div>
  `,
  data: {
    injection: 'injected!',
  },
};

App.component(MyComponent).on(
  'input',
  '[name="test-input"]',
  ({self, target}) => {
    self.set('entity', target.value);

    if (!self.componentExists(MyInjectedComponent.name)) {
      self.component(MyInjectedComponent);
    }
  }
);
