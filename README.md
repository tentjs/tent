# ⛺ Tent

A **jsx-free**, **super-lightweight** and **zero-dependency** library to add reactivity to the web &mdash; without all the nonsense.

> [!IMPORTANT]
> Tent is currently in early development. It _can_ be used in production, but there might be breaking changes in future versions. If you're interested in contributing, please submit a PR or report an issue. Keep track of the changes in the [CHANGELOG](CHANGELOG.md).

## ⚙️ Installation

```bash
npm install @tentjs/tent
```

## ⚡ Quickstart

Getting started is very easy. Here's a simple example component that increments a number when the button is clicked. This example demonstrates creating a stateful component, updating the state, and mounting it to the DOM.

```typescript
import { type Component, mount, tags } from '@tentjs/tent';

// Tags are used to create elements - like `div`, `button`, `span`, etc.
const { button } = tags;

type State = { count: number };

const Counter: Component<State> = {
  // Initial state
  state: { count: 0 },
  // Define the view
  view({ state }) {
    return button(
      `You clicked ${state.count} times`,
      // Add attributes to the button
      { onclick: () => state.count++ },
    );
  },
};

// Append the component to an element in the DOM
mount(document.querySelector('.counter'), Counter);
```

## 💡 Examples

You can find examples for building a [simple counter](https://github.com/tentjs/examples/tree/main/counter), [todo list](https://github.com/tentjs/examples/tree/main/todo-list), [a form](https://github.com/tentjs/examples/tree/main/form) and more in the [examples repository](https://github.com/tentjs/examples).

## 👍🏻 Contribute

If you want to support the active development of Tent, there are a few ways you can help:

1. [**Give a ⭐**](https://github.com/tentjs/tent/stargazers) &mdash; bring attention to the project.
2. **Tweet about it** &mdash; share your excitement.
3. [**Get involved**](https://github.com/tentjs/tent/discussions) &mdash; join the discussions.
4. [**Contribute**](https://github.com/tentjs/tent/pulls) &mdash; submit a pull request.
5. [**Buy me a ☕**](https://www.buymeacoffee.com/sebkolind) &mdash; thank you for your support!
