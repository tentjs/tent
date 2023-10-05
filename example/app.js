import {Praxy, html} from '../dist/praxy';

const App = new Praxy();

const Component = {
  template: html`
    <div>
      <ul px-for="item in items">
        <li>
          <span>{{item}}</span>
          <button class="remove">remove</button>
        </li>
      </ul>
      <button id="add">Add item</button>
      <button id="reset">Reset list</button>
    </div>
  `,
  data: {
    name: 'Sebastian',
    items: ['one', 'two', 'three'],
  },
};

App.component(Component, ({data, on, closest}) => {
  const initialItems = [...data.items];

  on('click', 'button#add', () => {
    data.items = [...data.items, `four #${data.items.length + 1}`];
  });
  on('click', 'button.remove', ({target}) => {
    const i = Number(closest(target, 'i')?.getAttribute('i'));
    data.items = data.items.filter((_, index) => index !== i);
  });
  on('click', 'button#reset', () => {
    data.items = initialItems;
  });
});
