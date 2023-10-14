import { Praxy } from '../dist/praxy';

const App = new Praxy();

App.component('todo-list', {
  data: {
    newTodo: '',
    todos: [
      { text: 'Learn JavaScript', done: false },
      { text: 'Learn Praxy', done: false },
      { text: 'Build something awesome', done: false }
    ],
  },
}, ({ on, data }) => {
  let todoInput = null;

  on('click', '.delete', ({ item }) => {
    const { todos } = data;
    data.todos = todos.filter(t => t.text !== item.text);
  });

  on('click', '.toggle', ({ item }) => {
    const { todos } = data;
    const todo = todos.find(t => t.text === item.text);
    const index = todos.indexOf(todo);
    todo.done = !todo.done;
    todos.splice(index, 1);
    if (todo.done) {
      todos.push(todo);
    } else {
      todos.unshift(todo);
    }
    data.todos = todos;
  });

  on('input', '#add-todo', ({ target }) => {
    todoInput = target;
    data.newTodo = target.value;
  });

  on('click', '#add-button', () => {
    const { todos, newTodo } = data;
    if (newTodo) {
      todos.unshift({ text: newTodo, done: false });
      data.todos = todos;
      todoInput.value = '';
    }
  });
});

