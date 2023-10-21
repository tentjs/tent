# Ideas

## To-do

- Find a way to only append styles  if the element is visible.
- Don't re-render styles if they already exist.
- Let the user cache elements with 'cache' in options.
  - if 'cache' is set (to unique string) the element will be cached. A cached element won't update, not even on data changes.
- Find a way to use the same styles on a looped element.
- ~~Store uuid's for scoped styles, and check if it exists when creating new ones.~~

## Mounted

Is a good idea, but it doesn't really work 100%. It triggers even when data is changed, which is not ideal.
Need a way of storing if some element have been mounted before.

## Scoped styles

Not sure about scoped styles, but since I am using a `style` tag for the `load` event for `mounted` it could be a thing?
The thing I am not 100% sure about is how you would define those styles. It could be a template string, but there's no
syntax highlighting out of the box, and it might be a bit messy.

Another way could be to define styles in an object, and then process that into a stylesheet. (Like this more!)

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

L('div', [
  L('p', ['Styled paragraph'], {
    styles({theme}) {
      return {
        // And then access values as you would a normal object
        color: theme.text.color,
      };
    },
  }),
], {theme})
```

## Router

The router should be a simple path => component router.

I think it would be nice if something like this is possible:

```js
const MyPage = L('div', [
  L('span', ['This is the /my-page component']),
]);

const router = R([
  {path: '/my-page', component: MyPage, layout: SomeLayout},
]);
```

### To-do

- Figure out if relying on the hash is a bad idea, since it's hijacking the normal # jumping

### How?

I am not 100% sure how to write the router function.

In short the function should:

- ~~Register each component on a route.~~
- ~~When changing route it should tear down the component on the route, and setup the new one.~~
- Handle dynamic params and replace them with values.
