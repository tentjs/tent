# ⛺ Tent

A **jsx-free**, **super-lightweight** and **zero-dependency** library to add interactivity to the web &mdash; without all the nonsense.

Read [this blog post](https://www.itsmeseb.dev/2024/01/03/tent.html) to get a better understanding of what Tent is and why it exists. You might also be interested in "[What is Tent?](https://tentjs.github.io/docs/what-is-it.html)".

## ⚙️ Installation

```bash
npm install @tentjs/tent
```

## ⚡ Quickstart

Getting started with Tent is easy. Here's a simple example component that increments a number when the button is clicked. This example demonstrates creating a stateful component, updating the state, and mounting it to the DOM.

```typescript
import { type Component, mount, tags } from '@tentjs/tent';

// `Tags` are functions that create elements.
// A tag takes 2 arguments: children and attributes (optional)
// Attributes are assigned to the element, e.g.:
// `onclick`, `onchange`, `disabled`, `classNames`, etc..
const { button } = tags;

type State = { count: number };

const Counter: Component<State> = {
  // Initial state
  state: { count: 0 },
  // Define the view
  view: ({ state }) =>
    button(
      `You clicked ${state.count} times`,
      // Assign an onclick event to the button
      { onclick: () => state.count++ },
    ),
};

// Append the component to the body
mount(document.body, Counter);
```

## 💡 Examples

#### 📖 [Custom Tags](#custom-tags)

```typescript
import { type Component, type Children, createTag } from '@tentjs/tent';

// Ideally you would put this in a separate file and export it,
// which would let you use it anywhere in your project.
const customTag = (children: Children, attrs?: object) =>
  createTag([
    'my-tag',
    // Wrap the children in a div with a class of 'container'
    // This is just to demonstrate that you can manipulate the children
    div(children, { className: 'container' }),
    attrs,
  ]);

const CustomTag: Component = {
  view: () => customTag(p('Hello, World!')),
};
```

```html
<my-tag>
  <div class="container">
    <p>Hello, World!</p>
  </div>
</my-tag>
```

#### 📖 [Mounted](#mounted)

```typescript
import { type Component, tags } from '@tentjs/tent';

const { ul, li } = tags;

type Post = { userId: number; id: number; title: string; body: string };
type State = { items: Post[] };

const Posts: Component<State> = {
  view: ({ state }) => ul(state.items.map((item) => li(item))),
  // Fetch data when the component is mounted
  mounted: async ({ state }) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');

    state.items = await res.json();
  },
};
```

#### 📖 [Async Mount](#async-mount)

```typescript
// async-mount.ts
import { type Component, tags } from '@tentjs/tent';

const { ul, li } = tags;

type Todo = { userId: number; id: number; title: string; completed: boolean };
type Attrs = { todos: string };

export const AsyncMount: Component<{}, Attrs> = {
  view: ({ el }) => {
    // Parse the JSON string into an array of `Todo`
    const todos: Todo[] = JSON.parse(el.dataset.todos);

    return ul(todos.map((todo) => li(todo.title)));
  },
  // It is optional to remove the `data-todos` attribute.
  // But, if the attribute contains a lot of data, it is recommended to remove it.
  mounted: ({ el }) => el.removeAttribute('data-todos'),
};

// app.ts
import { mount } from '@tentjs/tent';
import { AsyncMount } from '../components/async-mount';

fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
  .then((res) => res.json())
  .then((json) => {
    const target = document.querySelector<HTMLDivElement>('.async-mount');

    if (target) {
      target.dataset.todos = JSON.stringify(json);

      mount(target, AsyncMount);
    }
  });
```

#### 📖 [Simple Todo](#simple-todo)

```typescript
import { type Component, tags } from '@tentjs/tent';

const { div, input, button, ul, li } = tags;

type State = { todos: string[]; input: string };

const Todo: Component<State> = {
  state: { todos: [], input: '' },
  view: ({ state }) =>
    div([
      // Since an input can't have children, we use an empty array
      input([], {
        value: state.input,
        onchange: (e) => (state.input = e.target.value),
      }),
      button('Add', {
        onclick: () => {
          // Use assignment to update the state, and trigger a re-render,
          // `.push()` would not trigger a re-render
          state.todos = [...state.todos, state.input];
          // Clear the input
          state.input = '';
        },
      }),
      ul(state.todos.map((todo) => li(todo))),
    ]),
};
```

## 👍🏻 Contribute

If you want to support the active development of Tent, there are a few ways you can help:

1. [**Give a ⭐**](https://github.com/tentjs/tent/stargazers) &mdash; bring attention to the project.
2. **Tweet about it** &mdash; share your excitement.
3. [**Get involved**](https://github.com/tentjs/tent/discussions) &mdash; join the discussions.
4. [**Contribute**](https://github.com/tentjs/tent/pulls) &mdash; submit a pull request.
5. [**Buy me a ☕**](https://www.buymeacoffee.com/sebkolind) &mdash; thank you for your support!
