# One.js

A lightweight library to build reactive web apps &mdash; fast.

One is in alpha and is under heavy development. There might be breaking changes in the future - use at your own risk. All discussions, questions, ideas and PR's are welcome!

## Usage

```js
import { mount, div, button } from 'one'

function view({ state }) {
  return div([
    p(`Count: ${state.count}`),
    button('Dec', { onclick() { state.count-- } }),
    button('Inc', { onclick() { state.count++ } }),
  ])
}

const state = { count: 0 }

mount({
  state,
  view,
  el: document.querySelector('#counter'),
})
```

### Router

```js
import { router, h1, p, div } from 'one'

router(
  document.querySelector('#app'),
  [{
    path: '/',
    handler() {
      return {
        state: { title: 'Home' },
        view({ state, anchor }) {
          return div([
            h1(state.title),
            p('Welcome to the home page.'),
            anchor('About', { href: '/about' }),
          ])
        },
      }
    }
  },
  {
    path: '/about',
    handler() {
      return {
        view({ anchor }) {
          return div([
            h1('About'),
            p('This is the about page.'),
            anchor('Home', { href: '/' }),
          ])
        },
      }
    }
  }],
)
```
