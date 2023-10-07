# Praxy

Build web apps with atomic components.

### data

```js
App.component({
  template: html`
    <div>
      <p>Hey! My name is {{name}}, and I am {{age}} years old.</p>
    </div>
  `,
  data: {
    name: 'Sebastian',
    age: 30,
  },
});
```

Praxy listens for changes in your components data, but only on the root properties of your object.
Meaning that if have a nested object, or arrays, and update a nested property your component won't react to that change.

Instead you can update nested objects, or arrays, like this:

```js
App.component({
  template: html`
    <div>{{nested.property}}</div>
  `,
  data: {
    nested: {
      property: 'Hey!',
    },
    items: ['one', 'two', 'three'],
  },
}, ({data}) => {
  // Set the root property, and use the spread operator to add/modify your property
  data.nested = {...data.nested, property: 'You'};

  // When setting arrays you can't use `.push()`. Instead you can use the spread operator.
  // You can't use `.push()` because of how it works internally when mutating the array, which
  // makes it impossible for Praxy to operate on the changes.
  data.items = [...data.items, 'four'];

  // or, you could do something like this, if you _really_ want to use `.push()`:
  const items = [...data.items];
  items.push('four');
  data.items = items;
});
```

### mounted

```js
const Component = {
  template: html`
    <div>{{name}}</div>
  `,
  data: {
    name: 'Sebastian',
  },
}

// The "mounted" function will have `data` as an argument, which is the data of your component.
// You can operate directly on `data`, i.e set/modify properties.
App.component(Component, ({data}) => {
  // This is where you write your components logic, and also your "mounted" hook.
  data.name = 'Torben';
});
```

### for loop

```js
App.component({
  template: html`
    <div>
      <ul px-for="item in items">
        <li>{{item}}</li>
      </ul>
    </div>
  `,
  data: {
    items: ['one', 'two', 'three'],
  },
});
```

Note: You shouldn't add a `key` attribute to the looped items. It will be added automatically to all relevant elements - it's called `i` (for index). More on that later.

### templates

Templates are regular basic HTML, with the addition that you can use properties
from `data`. A template should consist of 1 root element.

#### `k` and `i`

Praxy will add `k` and `i` attributes to all relevant elements in the DOM.
They are used to traverse the DOM, and to determine if any re-renders should happen or not.
`i` stands for `index` and is added to the looped element in a `px-for` loop, and `k` is a unique identifier.

```js
App.component({
  template: html`
    <div>Hi! I am {{name}}.</div>
  `,
  data: {
    name: 'Joe',
  },
});
```

### click, input, etc.

```js
const Component = {
  template: html`
    <div>
      <div>
        <p>My name is {{name}}</p>
        <input name="name" type="text" />
      </div>
      <ul px-for="item in items">
        <li>{{item}} <button id="remove">Add an item</button></li>
      </ul>
      <button id="add">Add an item</button>
    </div>
  `,
  data: {
    name: '',
    items: ['one', 'two', 'three'],
  },
}

App.component(Component, ({data, on}) => {
  on('input', '[name="name"]',
    ({target}) => data.name = target.value
  );
  on('click', 'button#add',
    () => data.items = [...data.items, 'four']
  );
  // all event listeners within a px-for loop will be given a `item`,
  // which is the current item in the loop.
  on('click', 'button.remove', ({target, item}) => {
      data.items = data.items.filter((x) => x !== item);
  });
});
```

