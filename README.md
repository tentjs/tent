# else.js

Build web apps with atomic components.

## Usage

```js
import {L} from 'else'

L(
  'div',
  ({data}) => [
    L('div', [`Hello ${data.text}`]),
    L('button', ['Click me!'], {
      onclick() {
        data.text = data.text.split('').reverse().join('')
      },
    }),
  ],
  {
    data() { return: {text: 'World!'} },
    mount: document.querySelector('#app'),
  }
)
```

