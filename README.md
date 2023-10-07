# Praxy

Build web apps with atomic components.

## Usage

```js
import { Praxy, html } from 'praxy';

const App = new Praxy();

const Component = {
  // This is the template of your component. Here you define what should be rendered into the DOM.
  //
  // Your template should have exactly 1 root element.
  //
  // You may notice by inspecting the DOM that some elements will have `k` and `i` attributes. These are used
  // internally by Praxy to various operations, such as determine if anything should re-render.
  template: html`
    <div>
      <div>
        <p>My name is {{name}}.</p>
      </div>
      <div>
        <p>This is my to-do</p>
        <!--
        This is a for loop. It will loop each item in an array, and make it accessible via {{}}
        Note: You shouldn't add a key attribute. It will be added automatically - it's called i (for index).
        -->
        <ul px-for="todo in todos">
          <li>{{todo}} <button class="remove">Remove</button></li>
        </ul>
      </div>
      <div>
        <input name="newTodo" type="text" />
        <button id="add">Add</button>
      </div>
    </div>
  `,
  // This is the data of your component. It will react to changes.
  // It will however only listen for changes on the root properties of the object.
  // Meaning that to update a nested object, or an array, you do:
  // add to array: data.todos = [...data.todos, 'new']
  // add to an object: data.obj = {...data.obj, another: 'cool value'}
  data: {
    name: 'Sebastian',
    age: 30,
    todos: ['Walk the dog', 'Drink coffee', 'Pick up kids'],
    newTodo: '',
    obj: { value: 'someValue' },
  },
};

App.component(
  Component,
  // This is the "mounted" lifecycle - if you will.
  // Here you write the logic of your component.
  ({data, on} => {
    // This is how you add event listeners to elements within the component.
    on('input', '[name="newTodo"]',
      ({target}) => data.newTodo = target.value
    );
    on('click', 'button#add',
      () => data.todos = [...data.todos, data.newTodo]
    );
    // All event listeners within a px-for loop will be given a `item`,
    // which is the current item in the loop.
    on('click', 'button.remove',
      ({target, item}) => data.todos = data.todos.filter((x) => x !== item)
    );
  }
);
```

