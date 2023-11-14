# One.js

A lightweight library to build reactive web apps &mdash; fast.

One is in alpha and is under heavy development. You *can* use this for building web apps today, but the library is still considered very immature. All discussions, questions, ideas and PR's are welcome!

## Usage

```js
import {o, mount} from 'one'

const MyComponent = {
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

## Gotchas

Since One is as lightweight as it is, there are a couple of gotchas that you should
be aware of. Feel free to submit a PR if you've found a lightweight way of fixing these.

However, these are gotchas, and can easily be avoided.

### Conditional rendering
When using conditional rendering in a components `view` function, you should 
structure your view in such a way, that you don't break the natural render tree.

The recommended way to have conditional rendering is to use 2 components and the `redraw` attribute set to `true`.
If you don't use the `redraw` attribute, the component will return a cached version from last render.
See the first example below.

```js
// ok
const Component = {
  // Recommended!
  view({ data }) {
    return o('div', [
      data.bool ? 
        // Can have props, but if not, set second argument to `null`
        o(Component1, null, {redraw: true}) :
        o(Component2, null, {redraw: true})
    ])
  }
}

const Component = {
  view({ data }) {
    return o('div', [
      o('ul',
        data.items.length
          ? data.items.map(item => o('li', `${item.name}`))
          : o('li', 'Loading')
      )
    ])
  }
}

const Component = {
  view({ data }) {
    return o('div', 
      data.items.length
        ? o('nav', data.items.map(item => o('a', `${item.name}`)))
        // Notice that both ternaries return same root element.
        : o('nav', o('div', 'Loading...'))
    )
  }
}

const Component = {
  view ({ data }) {
    return o(
      'ul',
      data.items.map(item => o('li', `${item.name}`))
    )
  }
}

// not ok
const Component = {
  view({ data }) {
    return data.items.length
      ? o('ul', data.items.map(item => o('li', `${item.name}`)))
      : o('div', o('p', 'Loading...'))
  }
}

const Component = {
  view({ data }) {
    return o('div', 
      data.items.length
      ? o('ul', data.items.map(item => o('li', `${item.name}`)))
      : o('div', o('p', 'Loading...'))
    )
  }
}

const Component = {
  view({ data }) {
    if (!data.items.length) {
      return o('div', 'Loading')
    }

    return o('div', 'p', 'Items loaded...')
  }
}
```

### Dangling TextNodes
One is built around diffing HTML elements and not text nodes. This means that you shouldn't have "dangling" text nodes.

A dangling text node is a text node with HTML element siblings. See below for examples.

It *is* possible, but since One doesn't care about text nodes, they will often be removed from the DOM during rendering.

```js
// ok
o('div', 
  o('h1', 'This is a heading'),
  o('p', 'This is a paragraph'),
)

// not ok
o('div', 
  o('h1', 'This is a heading'),
  'This is a "dangling" text node',
)
```