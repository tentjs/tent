# To-do

- When removing styles, only do so if count is 1.
- Find a way to only append styles if the element is visible.
- Let the user cache elements with 'cache' in options.
  - if 'cache' is set (to unique string) the element will be cached. A cached element won't update, not even on data changes.

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
