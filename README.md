# ⛺ Tent.js

A jsx-free, super-lightweight and zero-dependency library to add interactivity to the web &mdash; without all the nonsense.

Tent is in alpha and is under heavy development. There might be breaking changes in the future - use at your own risk. All discussions, questions, ideas and PR's are welcome!

## Usage

```js
import {mount, tags} from 'tent'

const {p, button, div} = tags

const Counter = {
  state: {count: 0},
  view({state}) {
    return div([
      p(`Count: ${state.count}`),
      button('Dec', {
        onclick: () => state.count--
      }),
      button('Inc', {
        onclick: () => state.count++
      }),
    ])
  },
}

mount(document.body, Counter)
```
