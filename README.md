# ⛺ tent

A jsx-free, super-lightweight and zero-dependency library to add interactivity to the web &mdash; without all the nonsense.

**Note**: The library is under heavy development. There might (unlikely) be breaking changes in the future - use at your own risk. All discussions, questions, ideas and PR's are welcome!

## Install

```bash
npm install @tentjs/tent
```
or
```html
<script defer src="//unpkg.com/@tentjs/tent"></script>
```

## Usage

```js
import {mount, tags} from '@tentjs/tent'

const {p, button, div} = tags

const Counter = {
  state: {count: 0},
  view: ({state}) => div([
    p(`Count: ${state.count}`),
    button('Dec', {
      onclick: () => state.count--
    }),
    button('Inc', {
      onclick: () => state.count++
    }),
  ]),
}

mount(document.body, Counter)
```
