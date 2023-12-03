import { mount, router, form, input, button, text, div, span, h1, ul, li, h3 } from '../lib/two'

router(
  document.querySelector('#app'),
  [
    {
      path: '/',
      handler() {
        return {
          state: { title: 'Home', count: 0 },
          view({ state, anchor }) {
            return pageLayout([
              h1(state.title),
              text('Welcome home!'),
              text(`Count: ${state.count}`),
              button('Decrement', { onclick() { state.count-- } }),
              button('Increment', { onclick() { state.count++ } }),
            ], { state, anchor })
          },
        }
      }
    },
    {
      path: '/about',
      handler() {
        return {
          state: { title: 'About', count: 0 },
          view({ state, anchor }) {
            return pageLayout([
              h1(state.title),
              text('This is the about page.'),
              text(`Count: ${state.count}`),
              button('Decrement', { onclick() { state.count-- } }),
              button('Increment', { onclick() { state.count++ } }),
            ], { anchor })
          },
        }
      }
    },
    {
      path: '/contact',
      handler() {
        return {
          state: {
            title: 'Contact',
            todos: [
              { id: 1, title: 'Buy milk', done: true },
              { id: 2, title: 'Buy eggs', done: false },
              { id: 3, title: 'Buy bread', done: false },
            ]
          },
          view({ state, anchor }) {
            function onclick(todo) {
              todo.done = !todo.done
              state.todos = [...state.todos]
            }

            return pageLayout([
              h1(state.title),
              text('This is the contact page.'),
              h3('Todos'),
              ul(
                state.todos.map(todo => li([
                  button('Done', { onclick: () => onclick(todo) }),
                  span(todo.title, { className: `todo-title ${todo.done ? 'done' : ''}` }),
                ], { className: 'todo' })),
                { className: 'todos' }
              ),
            ], { anchor })
          },
        }
      }
    },
  ]
)

function view({ state }) {
  return pageLayout([
    ['h1', 'Hello, world!'],
    userForm(state),
    counter(state),
    todos(state),
  ])
}

function pageLayout(children, { state, anchor }) {
  return div([
    div([
      div([
        ['nav', [
          anchor('Home', { href: '/' }),
          anchor('About', { href: '/about' }),
          anchor('Contact', { href: '/contact' }),
        ]],
      ], { className: 'sidebar' }),
      div([
        ['main', children],
        [
          'footer', state?.title
            ? `This is a footer for ${state.title}`
            : 'This is the footer'
        ],
      ], { className: 'content' })
    ], { className: 'page-container' }),
  ], { className: 'page-layout' })
}

function userForm(state) {
  const inputs = [
    'firstname',
    'lastname',
    'phone',
    'email',
  ]

  function onclick(ev) {
    ev.preventDefault()

    const errors = []

    inputs.forEach(input => {
      if (!state[input]) {
        errors.push(`${input} is required`)
      }
    })

    state.errors = errors

    if (errors.length === 0) {
      console.info('form submitted!')
    }
  }

  return form([
    ...inputs.map(type => userInput(state, type)),
    button('Submit', { onclick }),
    ['ul', state.errors.map((error) => ['li', error])],
  ])
}

function counter(state) {
  return div([
    text(`Count: ${state.count}`),
    button('Decrement', { onclick() { state.count-- } }),
    button('Increment', { onclick() { state.count++ } })
  ])
}

function todos(state) {
  function onclick(ev) {
    if (!state.msg) { return }

    state.list = [
      ...state.list,
      { id: state.list.length + 1, title: state.msg }
    ]
  }

  function oninput(ev) {
    state.msg = ev.target.value
  }

  return div([
    userInput(state, 'msg', { oninput }),
    button('Add to list', { onclick }),
    ['ul', state.list.map((item) => ['li', item.title])]
  ], { className: 'todos' })
}

function userInput(state, type, props) {
  return div([
    input({
      type,
      oninput(ev) {
        state[type] = ev.target.value
      },
      onblur(ev) {
        if (ev.target.value === '') {
          ev.target.classList.add('error')
        } else {
          ev.target.classList.remove('error')
        }
      },
      placeholder: `Type your ${type}...`,
      ...props,
    })
  ])
}
