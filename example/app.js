import {Praxy} from '../dist/praxy';

const App = new Praxy();

App.component(
  'todo-list',
  {
    async data() {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      const todos = await res.json();
      return {todos: todos.filter((t) => !t.completed).slice(0, 8)};
    },
  },
  ({on, data}) => {
    let input = null;

    on('click', '.delete', ({item}) => {
      const {todos} = data;
      data.todos = todos.filter((t) => t.id !== item.id);
    });

    on('click', '.toggle', ({item}) => {
      const {todos} = data;
      const todo = todos.find((t) => t.id === item.id);
      const index = todos.indexOf(todo);
      todo.completed = !todo.completed;
      todos.splice(index, 1);
      if (todo.completed) {
        todos.push(todo);
      } else {
        todos.unshift(todo);
      }
      data.todos = todos;
    });

    on('input', '#add-todo', ({target}) => {
      input = target;
      data.newTodo = target.value;
    });

    on('click', '#add-button', () => {
      const {todos, newTodo} = data;
      if (newTodo) {
        todos.unshift({title: newTodo, completed: false});
        data.todos = todos;
        input.value = '';
      }
    });
  }
);
