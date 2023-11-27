import { html } from '../../../../lib/one'

const TodoItem = {
  name: 'todo-item',
  template: html`
    <li>
      <span o-text="text"></span>
      <span id="done">Done</span>
      <div>
        <button id="toggle">Toggle</button>
        <button id="remove">Remove</button>
      </div>
    </li>
  `,
  setup({ query, state, parent }) {
    const remove = query('#remove')
    const toggle = query('#toggle')
    const done = query('#done')

    const {show, hide} = done.if({ initial: state.done })

    function toggleDone() {
      if (state.done) {
        show()
      } else {
        hide()
      }
    }

    remove.on('click', function () {
      parent.events.delete(state.id)
    })

    toggle.on('click', function () {
      state.done = !state.done

      toggleDone()
    })
  }
}

export { TodoItem }