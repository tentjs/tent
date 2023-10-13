import {Praxy, html} from '../dist/praxy';

const App = new Praxy({
  store: {
    name: 'my-store',
    persist: 'sessionStorage',
  },
});

const Component = {
  name: 'my-component',
  store: {
    init() {
      return {
        storeKey: 'storeValue',
      };
    },
  },
  template: html`
    <div>
      <ul px-for="todo in todos">
        <li>
          <span class="[todo.done ? 'done' : 'todo']"
            >{{todo.title}} ({{todo.done ? 'done' : 'to-do'}})</span
          >
          <input class="check" type="checkbox" checked="{{todo.done}}" />
          <button class="remove">remove</button>
          <button class="toggle-done">{{todo.done ? 'not done' : 'done'}}</button>
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
  on('change', '.check', ({item}) => {
    const items = data.todos;
    const x = items.find((x) => x.title === item.title);
    x.done = !x.done;
    data.todos = items;
  });
  on('input', 'input[type="text"]', ({target}) => {
    data.newTodo = target.value;
  });
  on('click', 'button#add', ({}) => {
    if (data.newTodo) {
      data.todos = [...data.todos, {title: data.newTodo, done: false}];
    }
  });
  on('click', 'button.remove', ({item}) => {
    data.todos = data.todos.filter((x) => x !== item);
  });
  on('click', 'button.toggle-done', ({item}) => {
    const items = data.todos;
    const x = items.find((x) => x.title === item.title);
    x.done = !x.done;
    data.todos = items;
  });
});

App.component(
  {
    name: 'empty-component',
    data: {
      someValue: 'some-value',
      someBool: true,
    },
    store: {
      subscribe: ['name'],
    },
  },
  async ({$store, on, data}) => {
    const store = await $store;
    store.name = 'new-name';
    on('click', 'button#toggle-bool', () => {
      data.someBool = !data.someBool;
    });
  }
);
