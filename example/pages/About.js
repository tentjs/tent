import {e} from '../../dist/else'

const TestProps = e(
  'div',
  ({context}) => [
    e(
      'div',
      context.props.someProp ? `Test ${context.props.someProp}` : 'Test'
    ),
  ],
  {
    props: ['someProp'],
  }
)

const About = e(
  'div',
  ({context}) => [
    e('h1', 'About'),
    e(
      'p',
      `Hello ${context.name} ${
        context.route.params?.id ? context.route.params.id : ''
      }`,
      {
        styles: {
          color: 'purple',
          background: 'yellow',
          padding: '8px',
          'border-radius': '4px',
        },
      }
    ),
    context.name === 'Seb'
      ? e('div', 'test 1', {styles: {background: 'purple'}})
      : e('div', 'test 2', {styles: {background: 'green'}}),
    e('button', 'Swap name', {
      onclick() {
        context.name = context.name === 'Seb' ? 'Sebastian' : 'Seb'
        TestProps.props.someProp = 'yoyo'
      },
    }),
    TestProps,
  ],
  {
    data() {
      return {
        show: true,
        name: 'Seb',
      }
    },
  }
)

export {About}
