import { mount, watch, Input, Button, Text, Container } from '../lib/two'

function view({ el, state }) {
  return PageLayout([
    Form(state),
    Counter(state),
    Todos(state),
  ])
}

function PageLayout(children) {
  return Container([
    ["header", [["h1", "Hello, world!"]]],
    ["main", children],
    ["footer", [Text("This is the footer!")]],
  ], { className: 'page-layout' })
}

function Todos(state) {
  function handleOnClick(ev) {
    if (!state.msg) {
      return
    }

    state.list = [
      ...state.list,
      { id: state.list.length + 1, title: state.msg }
    ]
  }

  return Container([
    UserInput(state, "msg", { oninput(ev) { state.msg = ev.target.value } }),
    Button("Add to list", { onclick: handleOnClick }),
    ["ul", state.list.map((item) => ["li", item.title])]
  ], { className: 'todos' })
}

function Form(state) {
  const inputs = [
    'firstname',
    'lastname',
    'phone',
    'email',
  ]

  function handleOnClick(ev) {
    ev.preventDefault()

    const errors = []

    inputs.forEach(input => {
      if (!state[input]) {
        errors.push(`${input} is required`)
      }
    })

    state.errors = errors

    if (errors.length === 0) {
      console.info("Form submitted!")
    }
  }

  return ["form", [
    ...inputs.map(type => UserInput(state, type)),
    Button("Submit", { onclick: handleOnClick }),
    ["ul", state.errors.map((error) => ["li", error])],
  ]]
}

function Counter(state) {
  return Container([
    Text(`Count: ${state.count}`),
    Button("Decrement", { onclick() { state.count-- } }),
    Button("Increment", { onclick() { state.count++ } })
  ])
}

function UserInput(state, type, props) {
  return Container([
    Input({
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
  el: document.body,
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
