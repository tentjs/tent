# else.js

Build web apps with atomic components.

## Usage

```js
import {e} from 'else'

e(
  'div',
  ({context}) => [
    e('div', `Hello ${context.text}`),
    e('button', 'Click me!', {
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
import {e, createRouter} from 'else'

const Layout = e('div', [
  e('header', 'Header'),
  e('main', [], {view: true}),
  e('footer', 'Footer'),
])

const Home = e('div', e('div', 'This is home'))

const AboutUs = e('div', e('div', 'This is all about us'))

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
