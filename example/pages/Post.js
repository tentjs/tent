import {e, Link} from '../../dist/else'
import styles from './post.module.css'

function Post() {
  return e('div', ({context: {post}}) => Children(post), {
    class: styles.post,
    // `onroutechange` is similar to `onmount` but it's called when the route is changed,
    // which means that you have access to route properties, as well as `context`.
    async onroutechange({context, params}) {
      if (!params.id) {
        context.post = null
        return
      }

      try {
        const req = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${params.id}`
        )
        const json = await req.json()
        if (json?.id) {
          context.post = json
        }
      } catch (e) {
        console.error(e)
        context.post = null
      }
    },
    data() {
      return {post: null}
    },
  })
}

function Children(post) {
  // Children should be iterable, hence the array.
  return [post != null ? PostContent(post) : PostSkeleton()]
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
          post.id > 1
            ? Link({href: `/post/${post.id - 1}`, text: 'Previous'})
            : null,
          post.id < 100
            ? Link({href: `/post/${post.id + 1}`, text: 'Next'})
            : null,
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
    // An alternative to `key` is to use a wrapper element,
    // with a different tagName than the other wrapping element.
    // You could use a `section` on `PostSkeleton` and `div` on PostContent, which would be the same as using `key`.
    'div',
    [
      e('div', [], {class: styles.skeletonHeader}),
      e('div', [], {class: styles.skeletonSubheader}),
      e('div', [], {class: styles.skeletonBody}),
      e(
        'div',
        [
          e('div', [], {class: styles.skeletonButton}),
          e('div', [], {class: styles.skeletonButton}),
        ],
        {class: styles.skeletonNav}
      ),
    ],
    {key: 'skeleton'}
  )
}

export {Post}
