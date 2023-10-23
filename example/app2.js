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
    L('div', data.someProp ? `Test ${data.someProp}` : 'Test'),
    L('button', ['Click me'], {
      onclick() {
        console.log('clicked')
        data.someProp = 'clicked'
      },
    }),
  ],
  {
    props: ['someProp'],
    onmount({el}) {
      console.log('mounted', el)
    },
  }
)

const Home = () =>
  L(
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
      L(
        'ul',
        data.items.map((item) =>
          L('li', [
            L('strong', [item.name]),
            L('p', [item.description], {style: 'margin: 0'}),
            L('p', [L('span', [item.subtitle])], {
              style: 'margin: 0',
            }),
          ])
        ),
        {
          styles: {
            'list-style': 'none',
            margin: 0,
            padding: 0,
            li: {
              padding: '8px',
              color: '#333',
              background: '#eee',
              'border-radius': '4px',
              margin: '0 0 4px 0',
            },
          },
        }
      ),
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
        Test.someProp = 'yoyo'
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
