import { One } from '../dist/one'

const Component = new One('[hello-world]', async function () {
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
    checked: false
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

  // Registering a component inside another component
  // will make the inner component(s) inehrit state, methods, etc.
  this.register([Button, Test1])
})

const Test1 = new One('[test-1]', function () {
  this.state = {
    title: this.state.name
  }
})

const Button = new One('#btn', function () {
  console.log('Button', this.scope.state)

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
})

Component.mount()

function getSubtitle (count) {
  const start = count < 2 ? 'is' : 'are'
  const end = count > 1 ? 'items' : 'item'

  return `There ${start} ${count} ${end}`
}
