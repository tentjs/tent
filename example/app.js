import { mount, router, form, input, button, p, div, span, h1, ul, li, h3 } from '../lib/one'

// router(
//   document.querySelector('#app'),
//   [
//     {
//       path: '/',
//       handler() {
//         return {
//           state: { title: 'Home', count: 0 },
//           view({ state, anchor }) {
//             return pageLayout([
//               h1(state.title),
//               p('Welcome home!'),
//               p(`Count: ${state.count}`),
//               button('Decrement', { onclick() { state.count-- } }),
//               button('Increment', { onclick() { state.count++ } }),
//             ], { state, anchor })
//           },
//         }
//       }
//     },
//     {
//       path: '/about',
//       handler() {
//         return {
//           state: { title: 'About', count: 0 },
//           view({ state, anchor }) {
//             return pageLayout([
//               h1(state.title),
//               p('This is the about page.'),
//               p(`Count: ${state.count}`),
//               button('Decrement', { onclick() { state.count-- } }),
//               button('Increment', { onclick() { state.count++ } }),
//             ], { anchor })
//           },
//         }
//       }
//     },
//     {
//       path: '/contact',
//       handler() {
//         return {
//           state: {
//             title: 'Contact',
//             todos: [
//               { id: 1, title: 'Buy milk', done: true },
//               { id: 2, title: 'Buy eggs', done: false },
//               { id: 3, title: 'Buy bread', done: false },
//             ]
//           },
//           view({ state, anchor }) {
//             function onclick(todo) {
//               todo.done = !todo.done
//               state.todos = [...state.todos]
//             }
//             return pageLayout([
//               h1(state.title),
//               p('This is the contact page.'),
//               h3('Todos'),
//               ul(
//                 state.todos.map(todo => li([
//                   button('Done', { onclick: () => onclick(todo) }),
//                   span(todo.title, { className: `todo-title ${todo.done ? 'done' : ''}` }),
//                 ], { className: 'todo' })),
//                 { className: 'todos' }
//               ),
//             ], { anchor })
//           },
//         }
//       }
//     },
//   ]
// )

const state = { count: 0 }
const view = function({ state }) {
  return div([
    p(`Count: ${state.count}`),
    button('Dec', { onclick() { state.count-- } }),
    button('Inc', { onclick() { state.count++ } }),
  ])
}

mount({
  state,
  view,
  el: document.querySelector('#counter'),
})

// function view({ state }) {
//   return pageLayout([
//     ['h1', 'Hello, world!'],
//     userForm(state),
//     counter(state),
//     todos(state),
//   ])
// }

// function pageLayout(children, { state, anchor }) {
//   return div([
//     div([
//       div([
//         ['nav', [
//           anchor('Home', { href: '/' }),
//           anchor('About', { href: '/about' }),
//           anchor('Contact', { href: '/contact' }),
//         ]],
//       ], { className: 'sidebar' }),
//       div([
//         ['main', children],
//         [
//           'footer', state?.title
//             ? `This is a footer for ${state.title}`
//             : 'This is the footer'
//         ],
//       ], { className: 'content' })
//     ], { className: 'page-container' }),
//   ], { className: 'page-layout' })
// }

