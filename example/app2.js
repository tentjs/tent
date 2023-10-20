import {L, R} from '../dist/el'

const Layout = L('div', [
  L('header', [
    L('nav', [
      L('a', ['Home'], {href: '#home'}),
      L('a', ['About us'], {href: '#about-us'}),
    ]),
  ]),
  L('main', [], {view: true}),
  L('footer', ['Footer']),
])

const Home = L(
  'div',
  ({data}) => [
    L('h1', ['Home']),
    L(
      'ul',
      data.items.map((item) =>
        L(
          'li',
          [
            L('strong', [item.name]),
            L('p', [item.description], {style: 'margin: 0'}),
            L('p', [L('span', [item.subtitle])], {
              style: 'margin: 0',
            }),
          ],
          {
            class: 'list-item',
          }
        )
      ),
      {class: 'items-list'}
    ),
    L('button', [data.amount ? `Clicked ${data.amount} times` : 'Click me'], {
      onclick() {
        data.amount = data.amount + 1
        const items = [...data.items]
        items[0].name = 'React'
        items[1].subtitle = 'ReactX'
        data.items = items
      },
    }),
    L('div', [
      L('input', [], {
        type: 'text',
        onblur(e) {
          data.items = [
            ...data.items,
            {
              id: 4,
              name: e.target.value,
              description: 'New item',
              subtitle: 'New item sub',
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

const C1 = ({data}) =>
  L(
    'div',
    [
      L('p', ['Show']),
      L('p', [data.name]),
      L('div', [L('div', [L('span', ['Some span'])])]),
      L('button', ['Swap name'], {
        onclick() {
          data.name = data.name === 'Seb' ? 'Sebastian' : 'Seb'
        },
        styles: {
          background: 'pink',
        },
      }),
    ],
    {
      mounted({el}) {
        console.log('mounted is good', el)
      },
      styles: {
        color: 'pink',
        background: 'red',
        div: {
          color: 'purple',
          background: 'grey',
          span: {
            background: 'orange',
            p: {
              color: 'black',
            },
          },
        },
      },
    }
  )
const C2 = ({data}) => L('div', [L('p', [L('span', [`Hey ${data.lastname}`])])])

const About = L(
  'div',
  ({data}) => [
    L('h1', ['About']),
    data.show ? C1 : C2,
    L('button', ['Toggle'], {
      onclick() {
        data.show = !data.show
      },
    }),
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
    root: document.querySelector('#app'),
    layout: Layout,
  }
)
