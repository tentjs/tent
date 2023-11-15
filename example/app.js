import { O } from '../dist/one'

const Component = new O(function () {
  this.el = '[hello-world]'
  this.setState({
    name: 'John Doe',
    count: 0,
    text: 'Click me'
  })
})

const Button = new O(function () {
  this.el = 'button'
  this.setScope(Component)

  this.on('click', function (data) {
    const count = data.count + 1

    this.setState({
      count,
      text: `Clicked ${count}`
    })
  })
})

console.log('Component', Component, 'Button', Button)
