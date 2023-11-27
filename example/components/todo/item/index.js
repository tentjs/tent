import { html } from '../../../../lib/one'

const TodoItem = {
  name: 'todo-item',
  template: html`
    <li>
      <span o-text="text"></span>
      <span class="done">Done</span>
      <div>
        <button class="toggleBtn">Toggle</button>
        <button class="removeBtn">Remove</button>
      </div>
    </li>
  `,
  setup({ query, state, parent }) {
    const removeBtn = query('.removeBtn')
    const toggleBtn = query('.toggleBtn')
    const done = query('.done')

    const {show, hide, toggle} = done.if({ initial: state.done })

    removeBtn.on('click', function () {
      parent.events.delete(state.id)
    })

    toggleBtn.on('click', function () {
      state.done = !state.done

      toggle()
    })
  }
}

export { TodoItem }