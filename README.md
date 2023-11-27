# One.js

A lightweight library to build reactive web apps &mdash; fast.

One is in alpha and is under heavy development. There might be breaking changes in the future - use at your own risk. All discussions, questions, ideas and PR's are welcome!

## Usage

```js
import { one, html } from 'one'

one({
  name: 'counter',
  template: html`
    <div>
      <button id="dec">-</button>
      <span o-text="count"></span>
      <button id="inc">+</button>
    </div>
  `,
  state: { count: 0 },
  setup({ query, state }) {
    query('#dec').on('click', () => state.count--)
    query('#inc').on('click', () => state.count++)
  }
})
```
