# ⛺ tent

A jsx-free, super-lightweight and zero-dependency library to add interactivity to the web &mdash; without all the nonsense.

**Note**: The library is under heavy development. There might (unlikely) be breaking changes in the future - use at your own risk. All discussions, questions, ideas and PR's are welcome!

## Principles

1. No JSX.
2. No SSR.
3. No HTML syntax.

## Install

```bash
npm install @tentjs/tent
```

## Usage

```typescript
import {mount, tags, type Component} from '@tentjs/tent'

const {button, div} = tags

type State = {
  count: number
}

const Counter: Component<State> = {
  state: {count: 0},
  view: ({state}) => div([
    button('+', {
      onclick: () => state.count++
    }),
    div(state.count),
    button('-', {
      onclick: () => state.count--
    }),
  ])
}

mount(document.body, Counter)
```
