import {L, R} from '../dist/lement';

const Layout = L('div', [
  L('header', [
    L('nav', [L('a', ['Home'], {href: '#home'}), L('a', ['About us'], {href: '#about-us'})]),
  ]),
  L('main', [], {view: true}),
  L('footer', ['Footer']),
]);

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
            style: 'margin-bottom: 0.5em',
          }
        )
      )
    ),
    L('button', [data.amount ? `Clicked ${data.amount} times` : 'Click me'], {
      onclick() {
        data.amount = data.amount + 1;
        const items = [...data.items];
        items[0].name = 'React';
        items[1].subtitle = 'ReactX';
        data.items = items;
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
          ];
          e.target.value = '';
        },
      }),
    ]),
  ],
  {
    data: {
      amount: 0,
      items: [
        {id: 1, name: 'JS', description: 'JavaScript is nice', subtitle: 'JSX'},
        {id: 2, name: 'Svelte', description: 'Svelte is cool', subtitle: 'SvelteX'},
        {id: 3, name: 'Praxy', description: 'Praxy is awesome', subtitle: 'PraxyX'},
      ],
    },
  }
);

const AboutContent = L('div', [L('p', ['This is the about us page.'])]);
const About = L('div', [L('h1', ['About']), AboutContent]);

R(
  [
    {path: '#home', component: Home, layout: Layout},
    {path: '#about-us', component: About, layout: Layout},
  ],
  {
    fallback: '#home',
  }
);
