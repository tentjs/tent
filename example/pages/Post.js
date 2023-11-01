import {e, Link} from '../../dist/else'
import styles from './post.module.css'

function Post() {
  return e('div', ({context: {post}}) => Children(post), {
    class: styles.post,
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
  })
}

function Children(post) {
  // children should be iterable, hence the array.
  return [post ? PostContent(post) : PostSkeleton()]
}

function PostContent(post) {
  return e(
    'div',
    [
      e('h1', post.title),
      e('p', e('em', 'This is a simple example of a post from an API.')),
      e('p', post.body),
      e(
        'div',
        [
          Link({href: `/post/${post.id - 1}`, text: 'Previous'}),
          Link({href: `/post/${post.id + 1}`, text: 'Next'}),
        ],
        {class: styles.nav}
      ),
    ],
    // `key` is used to tell that a re-render should happen.
    // In this case it is used because Children() have different return values.
    // If you don't use `key` here you will get parts of the Skeleton in the final render,
    // because PostContent() and PostSkeleton() returns different amounts of nodes.
    {key: post.id, class: styles.post}
  )
}

function PostSkeleton() {
  return e(
    'div',
    [
      e('div', [], {class: styles.skeletonHeader}),
      e('div', [], {class: styles.skeletonSubheader}),
      e('div', [], {class: styles.skeletonBody}),
    ],
    // `key` is used to tell that a re-render should happen.
    {key: 'skeleton'}
  )
}

export {Post}
