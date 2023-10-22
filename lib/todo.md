# To-do

- Find a way to only append styles if the element is visible.
- Let the user cache elements with 'cache' in options.
  - If 'cache' is set (to unique string) the element will be cached. A cached element won't update, not even on data changes.
- Document `onmount` and mention that it's called when the element is mounted, but before it's rendered if the component is not a function.
  - This is useful if you want to do something with the element before it's rendered.
  - If the component is a function, it will be called after the element is rendered.

## Theme (WIP)

Could be cool to have a Theme object, which can be used in all components.

But I am not sure what the benefit would be from just have a local object with styles?

- One benefit would be that you can share themes.
- You can give a parent element a theme via opts, and then all children can use it.
  - But a regular object can do the same? In fact, it's easier since you don't have to pass it anywhere.

```js
const theme = T({
  text: {
    color: '#eee',
  },
})

L(
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
