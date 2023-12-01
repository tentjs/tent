import { mount, watch, Input, Button, Text, Container } from '../lib/two'

function view({ el, state }) {
  return PageLayout([
    ["form", [
      UserInput('firstname', state),
      UserInput('lastname', state, { disabled: state.firstname === '' }),
      UserInput('phone', state),
      UserInput('email', state),
      Button("Submit", {
        onclick(ev) {
          ev.preventDefault()

          const errors = []

          if (!state.firstname) { errors.push("Firstname is required") }
          if (!state.lastname) { errors.push("Lastname is required") }
          if (!state.phone) { errors.push("Phone is required") }
          if (!state.email) { errors.push("Email is required") }

          state.errors = errors

          if (errors.length === 0) {
            console.info("Form submitted!")
          }
        }
      })
    ]],
    Container([
      ["ul", state.errors.map((error) => ["li", error])],
    ]),
    Text(`Hey ${state.firstname} ${state.lastname}!`),
    CountText(state.count),
    Text(`Count: ${state.count}`),
    Button("Decrement", {
      onclick() {
        state.count--
      }
    }),
    Button("Increment", {
      onclick() {
        state.count++

        if (state.count > 5) {
          state.list = [
            ...state.list,
            { id: 4, title: "Title #4" }
          ]
        }
      }
    }),
    UserInput("msg", state, {
      oninput(ev) {
        state.msg = ev.target.value
      },
    }),
    Button("Add to list", {
      onclick() {
        state.list = [
          ...state.list,
          { id: state.list.length + 1, title: state.msg }
        ]
      }
    }),
    ["ul", state.list.map((item) => ["li", item.title])],
  ])
}

function PageLayout(children) {
  return Container([
    ["header", [
      ["h1", "Hello, world!"],
    ]],
    ["main", children],
    ["footer", [
      ["p", "This is the footer!"],
    ]],
  ], { className: 'page-layout' })
}

function UserInput(type, state, props) {
  return Container([
    Input({
      type,
      oninput(ev) {
        state[type] = ev.target.value
      },
      onblur(ev) {
        if (!ev.target.checkValidity()) {
          ev.target.classList.add('error')
        } else {
          ev.target.classList.remove('error')
        }
      },
      pattern: type === 'phone' ? '[0-9]{3}-[0-9]{3}-[0-9]{4}' : '',
      required: true,
      placeholder: `Type your ${type}...`,
      ...props,
    })
  ])
}

function CountText(count) {
  if (count < 0) {
    return Text("Count is pretty low, don't you think?")
  }

  if (count === 2) {
    return Text("Count is exactly 2")
  }

  return count > 2 ? Text("Count is above 2") : Text("Count is below 2")
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
