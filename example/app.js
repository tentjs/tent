import {Praxy, html} from '../dist/praxy';

const App = new Praxy();

const Component = {
  template: html`
    <div>
      <ul px-for="item in items">
        <li>
          <div>
            <span>{{item}}</span>
          </div>
          <button class="remove">remove</button>
        </li>
      </ul>
      <button id="add">Click me!</button>
    </div>
  `,
  data: {
    name: 'Sebastian',
    items: ['one', 'two', 'three'],
  },
};

App.component(Component, function (data) {
  this.on('click', 'button#add', () => {
    data.items = [...data.items, 'four'];
  });
  this.on('click', 'button.remove', ({item}) => {
    // item will only be available if the event was triggered by a px-for loop.
    data.items = data.items.filter((x) => x !== item);
  });
});
