import {Praxy, html} from '../dist/praxy';

const App = new Praxy();

const Component = {
  name: 'my-component',
  template: html`
    <div>
      <ul px-for="todo in todos">
        <li>
          {{todo.title}} ({{todo.done}})
          <button class="remove">remove</button>
          <button class="done">done</button>
        </li>
      </ul>
      <input type="text" placeholder="New todo" />
      <button id="add">Add todo</button>
    </div>
  `,
  data: {
    name: 'Sebastian',
    newTodo: '',
    todos: [
      {title: 'one', done: false},
      {title: 'two', done: true},
      {title: 'three', done: false},
    ],
  },
};

App.component(Component, ({data, on}) => {
  on('input', 'input', ({target}) => {
    data.newTodo = target.value;
  });
  on('click', 'button#add', () => {
    if (data.newTodo) {
      data.todos = [...data.todos, {title: data.newTodo, done: false}];
    }
  });
  on('click', 'button.remove', ({item}) => {
    data.todos = data.todos.filter((x) => x !== item);
  });
  on('click', 'button.done', ({item}) => {
    const items = data.todos;
    const x = items.find((x) => x.title === item.title);
    x.done = !x.done;
    data.todos = items;
  });
});
