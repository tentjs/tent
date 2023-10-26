# else.js

Build web apps with atomic components.

## Usage

```js
import {L} from 'else'

L(
  'div',
  ({context}) => [
    L('div', [`Hello ${context.text}`]),
    L('button', ['Click me!'], {
      onclick() {
        context.text = context.text.split('').reverse().join('')
      },
    }),
  ],
  {
    data() {
      return {text: 'World!'}
    },
    mount: document.querySelector('#app'),
  }
)
```

### Router

```js
import {L, createRouter} from 'else'

const Layout = L('div', [
  L('header', 'Header'),
  L('main', [], {view: true}),
  L('footer', 'Footer'),
])

const Home = L('div', [L('div', 'This is home')])

const AboutUs = L('div', [L('div', 'This is all about us')])

createRouter(
  [
    {path: '/', component: Home},
    {path: '/about-us', component: AboutUs},
  ],
  {
    fallback: '/',
    layout: Layout,
    root: document.querySelector('#app'),
  }
)
```
