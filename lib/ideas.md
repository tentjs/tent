# Ideas

## Scoped styles

Not sure about scoped styles, but since I am using a `style` tag for the `load` event for `mounted` it could be a thing?
The thing I am not 100% sure about is how you would define those styles. It could be a template string, but there's no
syntax highlighting
out of the box, and it might be a bit messy.

Another way could be to define styles in an object, and then process that into a stylesheet. (Like this more!

## Theme

Could be cool to have a Theme object, which can be used in all components. Something like:

```js
L('div', [
  L('p', ['Styled paragraph'], {
    styles({theme}) {
      return {
        // And then access values as you would a normal object
        color: Theme.text.color,
      };
    },
  }),
])
```

And define a Theme like:

```js
T({
  text: {
    color: '#eee',
  },
})
```

## Layouts

It might be a good idea to have a way to define a general layout that each component can use.
The layout would then have a mounting point for the component that is using it. So that when the layout renders
it will inject the component in the right place.

A layout could be the general page structure like header, nav, footer etc., and then each component defines the content
of the page.

```js
const SomeLayout = L('div', [
  L('header', ['This is the header of the layout']),
  L('div', [], {id: 'mount'}),
  L('footer', ['This is the footer of the layout']),
]);
const ComponentWithLayout = L('div', [
  L('span', ['This is the /my-page component']),
], {
  // I think it would be nice to make it possible to define if you want to append or replace the content when mounting.
  // Maybe just have `mount` and `replace`, where `mount` appends and the other replaces. But then it might be nicer to have:
  // `append` and `replace`, which is more descriptive than `mount`.
  // If `replace` is given it has to remove all elements one by one, which might be a performance issue.
  mount: '#mount',
});
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

- Add dynamic params, i.e. `/some-path/:id` or `/some/:path/:id`

### How?

I am not 100% sure how to write the router function.

In short the function should:

- Register each component on a route.
- When changing route it should tear down the component on the route, and setup the new one.
- Handle dynamic params and replace them with values.
