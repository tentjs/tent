import { O } from '../dist/one'

const Component = new O('[hello-world]', function () {
  this.setState({
    name: 'John Doe',
    count: 0,
    text: 'Click me',
    items: [
      { title: 'Item 1' },
      { title: 'Item 2' },
      { title: 'Item 3' }
    ]
  })
})

const Button = new O('button', function () {
  this.setScope(Component)

  this.on('click', function (data) {
    const count = data.count + 1

    this.setState({
      count,
      text: `Clicked ${count}`,
      items: [
        { title: 'Item 1' }
      ]
    })
  })
})

console.log('Component', Component, 'Button', Button)
