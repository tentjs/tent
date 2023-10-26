import { L, Link, createRouter } from '../dist/else'
import { getItems } from './services/getItems'

const Layout = L(
  'div',
  [
    L(
      'header',
      [
        L(
          'nav',
          [
            Link({ href: '/', text: 'home' }),
            Link({ href: '/about-us', text: 'about us' }),
          ],
          {
            styles: {
              a: {
                margin: '0 10px 0 0',
                'text-decoration': 'none',
              },
              'a:hover': {
                'text-decoration': 'underline',
              },
            },
          }
        ),
      ],
      {
        styles: {
          padding: '60px 0',
        },
      }
    ),
    L('main', [], { view: true, styles: { width: '350px' } }),
    L('footer', '💛 else.js', {
      styles: {
        position: 'fixed',
        bottom: 0,
        padding: '24px 0',
        'font-size': '0.9em',
      },
    }),
  ],
  {
    styles: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      h1: {
        'margin-top': 0,
      },
    },
  }
)

const TestProps = L(
  'div',
  ({ data }) => [
    L('div', data.props.someProp ? `Test ${data.props.someProp}` : 'Test'),
  ],
  {
    props: ['someProp'],
  }
)

function List(data) {
  if (data.isLoading) {
    return L('p', 'Loading...')
  }
  if (!data.items.length && !data.isLoading) {
    return L('p', 'Yay! You rock 🎉')
  }
  return L(
    'ul',
    data.items.map((item) => ListItem(item, data)),
    {
      styles: {
        margin: '0 auto',
        padding: 0,
        'list-style': 'none',
        display: 'flex',
        'flex-direction': 'column',
        gap: '6px',
        li: {
          padding: '8px',
          color: '#eee',
          background: '#444',
          'border-radius': '4px',
          opacity: 1,
        },
        'li.done': {
          opacity: 0.5,
          background: 'seagreen',
        },
      },
    }
  )
}

function ListItem(item, data) {
  const Buttons = L(
    'div',
    [
      L('button', '✅', {
        onclick() {
          item.done = !item.done
          data.items = data.items
        },
      }),
      L('button', '🗑️', {
        onclick() {
          data.items = data.items.filter((x) => x.id !== item.id)
        },
      }),
    ],
    {
      styles: {
        display: 'flex',
        gap: '6px',
        margin: '12px 0 0 0',
        button: {
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
        },
      },
    }
  )

  return L(
    'li',
    [
      L('div', `#${item.id}`, {
        styles: { 'font-size': '0.8em', margin: '0 0 4px 0' },
      }),
      L('strong', item.name, {
        styles: { 'font-size': '1.2em', margin: '0 0 4px 0', display: 'block' },
      }),
      !item.done
        ? L(
            'div',
            [
              item.subtitle && L('p', item.subtitle),
              L('p', item.description),
              Buttons,
            ],
            { styles: { p: { 'font-size': '0.85em' } } }
          )
        : Buttons,
    ],
    {
      key: item.id,
      class: `${item.done ? 'done' : ''}`,
      styles: {
        p: { margin: 0 },
      },
    }
  )
}

const Home = L(
  'div',
  ({ data }) => [
    L(
      'label',
      [
        L('input', [], {
          type: 'text',
          'aria-label': 'What is up next?',
          placeholder: 'What is up next?',
          disabled: data.isLoading,
          onkeyup(event) {
            if (event.keyCode === 13) {
              const id = data.items.length
                ? data.items[data.items.length - 1].id + 1
                : 1
              data.items = [
                ...data.items,
                {
                  id,
                  name: event.target.value,
                  description: `${event.target.value} description`,
                },
              ]
              event.target.value = ''
            }
          },
          styles: {
            'box-sizing': 'border-box',
            padding: '16px',
            width: '100%',
            'border-radius': '4px',
            'font-size': '1em',
            border: 'none',
          },
        }),
      ],
      {
        styles: {
          padding: '8px 0',
          display: 'block',
          'margin-bottom': '1em',
          width: '350px',
          span: {
            display: 'block',
            margin: '0 0 2px 0',
            'font-size': '12px',
            'text-transform': 'uppercase',
          },
        },
      }
    ),
    List(data),
  ],
  {
    async onmount({ data }) {
      data.items = await getItems()
      data.isLoading = false
    },
    data() {
      return {
        amount: 0,
        items: [],
        isLoading: true,
      }
    },
  }
)

const About = L(
  'div',
  ({ data }) => [
    L('h1', 'About'),
    L('p', `Hello ${data.name}`, {
      styles: {
        color: 'purple',
        background: 'yellow',
        padding: '8px',
        'border-radius': '4px',
      },
    }),
    data.name === 'Seb'
      ? L('div', 'test 1', { styles: { background: 'purple' } })
      : L('div', 'test 2', { styles: { background: 'green' } }),
    L('button', 'Swap name', {
      onclick() {
        data.name = data.name === 'Seb' ? 'Sebastian' : 'Seb'
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

createRouter(
  [
    { path: '/', component: Home },
    { path: '/about-us', component: About },
  ],
  {
    fallback: '/',
    layout: Layout,
    root: document.querySelector('#app'),
  }
)
