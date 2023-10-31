import {e} from '../../dist/else'
import styles from './post.module.css'

function Post() {
  return e(
    'div',
    ({context}) =>
      context.post
        ? [
            e('h1', context.post.title),
            e('p', e('em', 'This is a simple example of a post from an API.')),
            e('p', context.post.body),
          ]
        : [],
    {
      // `onrouteready` is similar to `onmount` but it's called when the route is ready,
      // which means that you have access to the route params, as well as `context` and `el`.
      async onrouteready({context}) {
        // You should handle errors and loading states as well, this is just a simple example.
        const req = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${context.$route.params.id}`
        )
        context.post = await req.json()
      },
      class: styles.post,
    }
  )
}

export {Post}
