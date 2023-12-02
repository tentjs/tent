import { mount, form, input, button, text, container } from '../lib/two'

function view({ el, state }) {
  return pageLayout([
    ["h1", "Hello, world!"],
    userForm(state),
    counter(state),
    todos(state),
  ])
}

function pageLayout(children) {
  return container([
    container([
      container([
        ["nav", [
          ["a", "Home", { href: '/' }],
          ["a", "About", { href: '/about' }],
          ["a", "Contact", { href: '/contact' }],
        ]],
      ], { className: 'sidebar' }),
      container([
        ["main", children],
        ["footer", ["This is the footer!"]],
      ], { className: 'content' })
    ], { className: 'page-container' }),
  ], { className: 'page-layout' })
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

  return container([
    userInput(state, "msg", { oninput }),
    button("Add to list", { onclick }),
    ["ul", state.list.map((item) => ["li", item.title])]
  ], { className: 'todos' })
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
      console.info("form submitted!")
    }
  }

  return form([
    ...inputs.map(type => userInput(state, type)),
    button("Submit", { onclick }),
    ["ul", state.errors.map((error) => ["li", error])],
  ])
}

function counter(state) {
  return container([
    text(`Count: ${state.count}`),
    button("Decrement", { onclick() { state.count-- } }),
    button("Increment", { onclick() { state.count++ } })
  ])
}

function userInput(state, type, props) {
  return container([
    input({
      type,
      oninput(ev) {
        state[type] = ev.target.value
      },
      onblur(ev) {
        if (ev.target.value === "") {
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

mount({
  el: document.querySelector('#app'),
  state: {
    count: 0,
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    msg: "",
    errors: [],
    list: [
      { id: 1, title: "Title #1" },
      { id: 2, title: "Title #2" },
      { id: 3, title: "Title #3" }
    ],
  },
  view
})
