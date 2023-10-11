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
      <p>Hey {{storeKey}}!</p>
      <ul px-for="todo in todos">
        <li>
          {{todo.title}} ({{todo.done ? 'done' : 'to-do'}})
          <input class="check" type="checkbox" />
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
  on('change', '.check', ({item}) => {
    const items = data.todos;
    const x = items.find((x) => x.title === item.title);
    x.done = !x.done;
    data.todos = items;
  });
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
  on('click', 'button.done', ({item, $el}) => {
    const items = data.todos;
    const x = items.find((x) => x.title === item.title);
    x.done = !x.done;
    data.todos = items;
    const check = $el.querySelector('.check');
    if (x.done) {
      check.setAttribute('checked', '');
    } else {
      check.removeAttribute('checked');
    }
  });
});

App.component(
  {
    name: 'my-component2',
    data: {},
    store: {
      subscribe: ['storeKey'],
    },
    template: html`
      <div>
        <p>Hey {{storeKey}}!</p>
        <button>click me</button>
      </div>
    `,
  },
  ({$store, on}) => {
    on('click', 'button', () => {
      $store.storeKey = 'updated value';
    });
  }
);
