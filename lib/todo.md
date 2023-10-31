# To-do

- [x] Remove `styles` and recommend either `style` as attribute or CSS Modules instead.
- [x] Rename `data` to `context` since it also holds `props` and `route`, and not just data. Data will be on the root of
      the object, to make it easy to use `context.X`, and `context.$route.X` and `context.$props.X`.
- [x] Create a `$$else` property on the element where the route and props are stored.
  - This is to avoid any clashes with any other properties.
  - And it's easy to do `Object.defineProperty(el, '$$else' { ... })` and then handle both route, props and future
    features in the same go.
- [ ] Let the user cache elements with 'cache' in options.
  - If 'cache' is set (to unique string) the element will be cached. A cached element won't update, not even on data
    changes.
- [ ] Document differences between `[() => e( ... )]` vs. `[e( ... )]`, and when to use a function returning elements.
      I.e. it'll re-render everytime.
- [ ] Document `onmount` and mention that it's called when the element is mounted, but before it's rendered if the
      component is not a function.
  - This is useful if you want to do something with the element before it's rendered.
  - If the component is a function, it will be called after the element is rendered.
- [ ] Write tests for ./router
- [ ] Figure out if a store utilizing session-/localStorage is a good fit?
- [ ] How to add animations on appearing and disappearing elements?

## Theme (WIP)

Could be cool to have a Theme object, which can be used in all components.

But I am not sure what the benefit would be from just have a local object with styles?

- One benefit would be that you can share themes.
- It would be cool to have a Theme registered, so 3rd party UI components can utilize the theme somehow.
- You can give a parent element a theme via opts, and then all children can use it.
  - But a regular object can do the same? In fact, it's easier since you don't have to pass it anywhere.

```js
const theme = T({
  text: {
    color: '#eee',
  },
})

e(
  'div',
  [
    L('p', ['Styled paragraph'], {
      styles({theme}) {
        return {
          // And then access values as you would a normal object
          color: theme.text.color,
        }
      },
    }),
  ],
  {theme}
)
```
