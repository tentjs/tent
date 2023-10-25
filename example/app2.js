import { L, R, Link } from '../dist/l'
import { getItems } from './services/getItems'

const Layout = L('div', [
  L('header', [
    L(
      'nav',
      [
        Link({ href: '/', text: 'Home' }),
        Link({ href: '/about-us', text: 'About us' }),
      ],
      {
        styles: {
          a: {
            margin: '0 10px 0 0',
          },
        },
      }
    ),
  ]),
  L('main', [], { view: true }),
  L('footer', ['Footer'], { styles: { margin: '120px 0 0 0' } }),
])

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
    return L('p', ['Loading...'])
  }
  return L(
    'ul',
    data.items.map((item) => ListItem(item, data)),
    {
      styles: {
        margin: '0 auto',
        padding: 0,
        width: '350px',
        'list-style': 'none',
        display: 'flex',
        'flex-direction': 'column',
        gap: '4px',
        li: {
          padding: '8px',
          color: '#333',
          background: '#eee',
          'border-radius': '4px',
        },
        'li.done': {
          background: 'green',
        },
      },
    }
  )
}

function ListItem(item, data) {
  return L(
    'li',
    [
      L('div', `Id: ${item.id}`),
      L('strong', [item.name]),
      L('p', [item.description]),
      item.subtitle && L('p', [L('span', [item.subtitle])]),
      L('div', [
        L('button', 'Done', {
          onclick() {
            item.done = !item.done
            data.items = data.items
          },
        }),
        L('button', 'Delete', {
          onclick() {
            console.log('delete', data.items, item)
            data.items = data.items.filter(x => x.id !== item.id)
          }
        })
      ], 
        {
          styles: {
            display: 'flex',
            gap: '4px',
            margin: '6px 0 0 0',
            button: {
              cursor: 'pointer'
            }
          }
        }
      ),
    ],
    {
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
    L('h1', 'Home'),
    L('div', [
      L('button', 'Click me', {
        onclick() {
          const items = [...data.items]
          items.splice(0, 1)
          data.items = items
        },
        styles: {
          background: 'bisque',
          border: 'none',
          'border-radius': '4px',
          padding: '4px 8px',
          cursor: 'pointer',
        },
      }),
    ]),
    L(
      'label',
      [
        L('input', [], {
          type: 'text',
          'aria-label': 'Insert title...',
          placeholder: 'Insert title...',
          disabled: data.isLoading,
          onkeyup(event) {
            if (event.keyCode === 13) {
              data.items = [
                ...data.items,
                {
                  id: data.items[data.items.length - 1].id + 1,
                  name: event.target.value,
                  description: `${event.target.value} title`,
                },
              ]
              event.target.value = ''
            }
          },
          styles: {
            'box-sizing': 'border-box',
            padding: '8px',
            width: '100%',
            'border-radius': '4px',
            border: 'none',
          },
        }),
      ],
      {
        styles: {
          padding: '8px 0',
          margin: '0 auto',
          display: 'block',
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
    ({ data }) => List(data),
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
    L('p', [`Hello ${data.name}`], {
      styles: {
        color: 'purple',
        background: 'yellow',
        padding: '8px',
        'border-radius': '4px',
      },
    }),
    data.name === 'Seb'
      ? L('div', ['test 1'], { styles: { background: 'purple' } })
      : L('div', ['test 2'], { styles: { background: 'green' } }),
    L('button', ['Swap name'], {
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

R(
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
