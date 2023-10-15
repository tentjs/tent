import {Praxy} from '../dist/praxy';

const App = new Praxy();

App.component(
  'todo-list',
  {
    async data() {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      const json = await res.json();
      const todos = json.filter((t) => !t.completed).slice(0, 8);
      return {todos};
    },
  },
  ({on, data}) => {
    on('click', '.delete', ({item}) => {
      const {todos} = data;
      data.todos = todos.filter((t) => t.id !== item.id);
    });

    on('click', '.toggle', ({item}) => {
      const {todos} = data;
      const todo = todos.find((t) => t.id === item.id);
      todo.completed = !todo.completed;
      todos.splice(todos.indexOf(todo), 1);
      if (todo.completed) {
        todos.push(todo);
      } else {
        todos.unshift(todo);
      }
      data.todos = todos;
    });

    on(
      'input',
      '#add-todo',
      ({target}) => {
        data.newTodo = target.value;
      },
      {
        triggers: {
          enter({target}) {
            const {todos, newTodo} = data;
            if (newTodo) {
              const highestId = todos.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
              todos.unshift({id: highestId + 1, title: newTodo, completed: false});
              data.todos = todos;
              target.value = '';
            }
          },
        },
      },
    );
  }
);
