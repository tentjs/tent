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

// Tags are functions that create elements
// A tag takes 2 arguments: the children and the attributes (optional)
// The attributes will be assigned to the element, and can be
// onclick, onchange, disabled, classNames, etc..
const { button } = tags;

type State = { count: number };

const Counter: Component<State> = {
  // Initial state
  state: { count: 0 },
  // Define the view
  view: ({ state }) => {
    return button(
      `You clicked ${state.count} times`,
      // Assign an onclick event to the button
      { onclick: () => state.count++ },
    );
  },
};

// Append the component to the body
mount(document.body, Counter);
```

## 👍🏻 Contribute

If you want to support the active development of Tent, there are a few ways you can help:

1. [**Give a ⭐**](https://github.com/tentjs/tent/stargazers) &mdash; bring attention to the project.
2. **Tweet about it** &mdash; share your excitement.
3. [**Get involved**](https://github.com/tentjs/tent/discussions) &mdash; join the discussions.
4. [**Contribute**](https://github.com/tentjs/tent/pulls) &mdash; submit a pull request.
5. [**Buy me a ☕**](https://www.buymeacoffee.com/sebkolind) &mdash; thank you for your support!
