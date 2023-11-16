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
    bool: false,
    selected: 'two',
    buttonText: 'Click me',
    items,
    subtitle: getSubtitle(items.length),
    checked: false
  }

  this.register([Button])
})

const Button = new One('button', function () {
  this.on('click', function ({ state }) {
    const count = state.count + 1
    const items = state.items.filter(i => i.id === 1)

    this.state = {
      buttonText: `Clicked ${count} times`,
      count,
      bool: !state.bool,
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
