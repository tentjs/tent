import { One } from '../dist/one'
import { getItems } from './services/get-items'

const Component = new One('[hello-world]', async function () {
  this.state = {
    name: 'John Doe',
    count: 0,
    bool: false,
    selected: 'two',
    buttonText: 'Click me',
    items: [],
    checked: false
  }

  const items = await getItems()

  this.state = {
    items,
    subtitle: getSubtitle(items.length)
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
