# Ideas

## Router

The router should be a simple path => component router.

I think it would be nice if something like this is possible:

```js
const MyPage = L('div', {
  children: [
    L('span', children: ['This is the /my-page component']),
  ],
});

const router = R({
  '/my-page': MyPage,
});
```

### How?

I am not 100% sure how to write the router function.

In short the function should:

- Register each component on a route.
- When changing route it should tear down the component on the route, and setup the new one.
