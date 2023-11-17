import { One } from '../dist/one'

const Component = new One(
  '[hello-world]',
  async function () {
    const items = [
      { id: 1, title: 'one' },
      { id: 2, title: 'two' },
      { id: 3, title: 'three' }
    ]

    this.state = {
      name: 'John Doe',
      count: 0,
      selected: 'two',
      items,
      subtitle: getSubtitle(items.length),
      checked: false,
      test () {
        return this.state.selected.toUpperCase()
      }
    }

    this.methods = {
      test: () => {
        this.state = {
          name: 'Jane Doe'
        }
      },
      test2: (e) => {
        this.state = {
          name: e.target.value
        }
      }
    }

    this.computed = {
      test3 () {
        return this.state.name.toUpperCase()
      }
    }

    // Registering a component inside another component
    // will make the inner component(s) inherit state, computed, methods, etc.
    this.register([Button])
  }
)

const Test1 = new One(
  '[test-1]',
  function () {
    this.state = {
      title: 'This is the title'
    }
  }
)
Test1.mount()

const Button = new One(
  '#btn',
  function () {
    this.on('click', function ({ state }) {
      const count = state.count + 1
      const items = state.items.filter(i => i.id === 1)

      this.state = {
        buttonText: `Clicked ${count} times`,
        count,
        items,
        subtitle: getSubtitle(items.length)
      }
    })
  }
)

Component.mount()

function getSubtitle (count) {
  const start = count < 2 ? 'is' : 'are'
  const end = count > 1 ? 'items' : 'item'

  return `There ${start} ${count} ${end}`
}
