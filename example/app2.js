import { L, R } from '../dist/l'

const Layout = L('div', [
  L('header', [
    L(
      'nav',
      [
        L('a', ['Home'], { href: '#home' }),
        L('a', ['About us'], { href: '#about-us' }),
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
  L('footer', ['Footer']),
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

function List(items, isLoading) {
  if (isLoading) {
    return L('p', ['Loading...'])
  }
  return L(
    'ul',
    items.map((item) => ListItem(item)),
    {
      styles: {
        margin: 0,
        padding: 0,
        'list-style': 'none',
        li: {
          padding: '8px',
          color: '#333',
          background: '#eee',
          margin: '0 0 4px 0',
          'border-radius': '4px',
        },
      },
    }
  )
}

function ListItem(item) {
  return L(
    'li',
    [
      L('strong', [item.name]),
      L('p', [item.description]),
      item.subtitle && L('p', [L('span', [item.subtitle])]),
    ],
    { styles: { p: { margin: 0 } } }
  )
}

const Home = L(
  'div',
  ({ data }) => [
    L('h1', ['Home']),
    L('button', 'Click me', {
      onclick() {
        const items = [...data.items]
        items.splice(0, 1)
        data.items = items
      },
    }),
    List(data.items, data.isLoading),
    L('label', [
      L('span', 'Title'),
      L('input', [], {
        type: 'text',
        name: 'title',
        placeholder: 'Insert title...',
        onkeyup(event) {
          if (event.keyCode === 13) {
            data.items = [
              ...data.items,
              {
                id: 5,
                name: event.target.value,
                description: `${event.target.value} title`,
              },
            ]
            event.target.value = ''
          }
        },
      }),
    ]),
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
    L('h1', ['About']),
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
    { path: '#home', component: Home },
    { path: '#about-us', component: About },
  ],
  {
    fallback: '#home',
    layout: Layout,
    root: document.querySelector('#app'),
  }
)

async function getItems() {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'JS',
          description: 'JavaScript is nice',
          subtitle: 'JSX',
        },
        {
          id: 2,
          name: 'Svelte',
          description: 'Svelte is cool',
          subtitle: 'SvelteX',
        },
        {
          id: 3,
          name: 'Praxy',
          description: 'Praxy is awesome',
          subtitle: 'PraxyX',
        },
      ])
    }, 1500)
  })
}
