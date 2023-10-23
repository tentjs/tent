import {L, R} from '../dist/l'

const Layout = L('div', [
  L('header', [
    L(
      'nav',
      [
        L('a', ['Home'], {href: '#home'}),
        L('a', ['About us'], {href: '#about-us'}),
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
  L('main', [], {view: true}),
  L('footer', ['Footer']),
])

const Test = L(
  'div',
  ({data}) => [
    L('div', data.props.someProp ? `Test ${data.props.someProp}` : 'Test'),
  ],
  {
    props: ['someProp'],
  }
)

function List(items) {
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
      L('p', [L('span', [item.subtitle])]),
    ],
    {styles: {p: {margin: 0}}}
  )
}

function Home() {
  return L(
    'div',
    ({data}) => [
      L('h1', ['Home']),
      L('button', [data.amount ? `Clicked ${data.amount} times` : 'Click me'], {
        onclick() {
          data.amount = data.amount + 1
          const items = [...data.items]
          items.splice(0, 1)
          data.items = items
        },
      }),
      List(data.items),
      L('div', [
        L('input', [], {
          type: 'text',
          onblur(e) {
            data.items = [
              ...data.items,
              {
                id: 4,
                name: e.target.value,
                description: `${e.target.value} title`,
                subtitle: `${e.target.value} subtitle`,
              },
            ]
            e.target.value = ''
          },
        }),
      ]),
    ],
    {
      data: {
        amount: 0,
        items: [
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
        ],
      },
    }
  )
}

const About = L(
  'div',
  ({data}) => [
    L('h1', ['About']),
    L('p', [`Hello ${data.name} ${data.lastname}`], {
      styles: {
        color: 'purple',
        background: 'yellow',
        padding: '8px',
        'border-radius': '4px',
      },
    }),
    data.name === 'Seb'
      ? L('div', ['test 1'], {styles: {background: 'purple'}})
      : L('div', ['test 2'], {styles: {background: 'green'}}),
    L('button', ['Swap name'], {
      onclick() {
        data.name = data.name === 'Seb' ? 'Sebastian' : 'Seb'
        Test.props.someProp = 'yoyo'
      },
    }),
    Test,
  ],
  {
    data: {
      show: true,
      name: 'Seb',
      lastname: 'Toombs',
    },
  }
)

R(
  [
    {path: '#home', component: Home},
    {path: '#about-us', component: About},
  ],
  {
    fallback: '#home',
    layout: Layout,
    root: document.querySelector('#app'),
  }
)
