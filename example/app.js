import {Praxy, html} from '../dist/praxy';

const App = new Praxy();

const Component = {
  template: html`
    <div>
      <p>My name is {{name}}</p>
      <div><input name="name" type="text" /></div>
      <ul px-for="item in items">
        <li>{{item}}</li>
      </ul>
      <button>Click me!</button>
    </div>
  `,
  data: {
    name: '',
    items: ['one', 'two', 'three'],
  },
};

App.component(Component, function (data) {
  this.on('input', '[name="name"]', ({target}) => (data.name = target.value));
  this.on('click', 'button', () => {
    data.items = [...data.items, 'four'];
  });
});
