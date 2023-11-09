# one.js

A lightweight library to build reactive web apps without all the fuzz.

## Usage

```js
import {o, mount} from 'one'

const MyComponent = {
  name: 'my-component',
  data() {
    return {
      name: 'John Doe',
    }
  ),
  view({ data }) {
    return o('div', [
      o('p', `Hello ${data.name}`),
    ])
  },
}

mount(document.body, MyComponent)
```

