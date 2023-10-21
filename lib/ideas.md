# To-do

- Find a way to only append styles if the element is visible.
- Don't re-render styles if they already exist.
  - when replacing, first check for style attributes, and transfer to replacing element.
    - don't do this if it is a function, since we have to re-render it anyway.
- Let the user cache elements with 'cache' in options.
  - if 'cache' is set (to unique string) the element will be cached. A cached element won't update, not even on data changes.
- Find a way to use the same styles on a looped element.
- ~~Store uuid's for scoped styles, and check if it exists when creating new ones.~~

## Mounted

Is a good idea, but it doesn't really work 100%. It triggers even when data is changed, which is not ideal.
Need a way of storing if some element have been mounted before.

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
