import {e} from '../../dist/else'
import styles from './post.module.css'

function Post() {
  return e(
    'div',
    ({context: {post}}) =>
      post
        ? [
            e('h1', post.title),
            e('p', e('em', 'This is a simple example of a post from an API.')),
            e('p', post.body),
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
      data() {
        return {post: null}
      },
      class: styles.post,
    }
  )
}

export {Post}
