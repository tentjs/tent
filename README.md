# ⛺ Tent

A jsx-free, super-lightweight and zero-dependency library to add interactivity to the web &mdash; without all the nonsense.

Read [this blog post](https://www.itsmeseb.dev/2024/01/03/tent.html) to get a better understanding of what this library is and why it exists.

## Principles

The core principles of Tent are: No JSX, no SSR and no obscure HTML syntax to learn. Tent is built to be used with the [Islands Architecture](https://www.patterns.dev/vanilla/islands-architecture) in mind, meaning that most of the web page is server-rendered, and the job of this library is to add chunks of interactivity where it is needed.

## Install

```bash
npm install @tentjs/tent
```

## Usage

```typescript
import {mount, tags, type Component} from '@tentjs/tent'

const {button} = tags

type State = {
  count: number
}

const Counter: Component<State> = {
  state: {count: 0},
  view: ({state}) => button(
    `Clicked ${state.count} times`,
    {onclick: () => state.count++},
  ),
}

mount(document.body, Counter)
```

If you're interested in more examples you can take a look at the [Cookbook](https://tentjs.github.io/cookbook/).

## Contributing

Feel free to get involved in the [discussions](https://github.com/tentjs/tent/discussions), submit a pull request or send me an [email](mailto:artiste_avid_0z@icloud.com).
