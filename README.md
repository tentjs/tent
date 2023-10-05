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
Meaning that if have a nested object, and update a nested property your component won't react to that change.

Instead you can update nested objects like this:

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
}, function(data) {
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

// The "mounted" function will have `data` as it's only argument, which is the data of your component.
// You can operate directly on `data`, i.e set/modify properties.
App.component(Component, function(data) {
  // This is where you write your components logic, and also your "mounted" hook.
  data.name = 'Torben';
});
```

It is __important__ that the function (the second argument to .component()) is a regular function, i.e not an arrow function.
This is due to how `this` is bound. If you don't need access to anything on the Praxy instance, you can use an arrow function and still have access to `data`.

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

### templates

Templates are regular basic HTML, with the addition that you can use properties
from `data`. A template should consist of 1 root element.

```js
App.component({
  template: html`
    <div>
      Hi! I am {{name}}.
    </div>
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
        <li>{{item}}</li>
      </ul>
      <button>Click me!</button>
    </div>
  `,
  data: {
    name: '',
    items: ['one', 'two', 'three'],
  },
}

App.component(Component, function(data) {
  this.on('input', '[name="name"]',
    ({target}) => data.name = target.value
  );
  this.on('click', 'button',
    () => data.items = [...data.items, 'four']
  );
});
```

