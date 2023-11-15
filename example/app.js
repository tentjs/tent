import { O } from '../dist/one'

const Component = new O('[hello-world]', function () {
  this.setState({
    name: 'John Doe',
    count: 0,
    text: 'Click me'
  })
})

const Button = new O('button', function () {
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
