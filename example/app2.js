import {L} from '../dist/lement';

L('div', {
  mount: document.body,
  data: {
    amount: 0,
    errors: [],
    items: [
      {id: 1, name: 'JS', description: 'JavaScript is nice', subtitle: 'JSX'},
      {id: 2, name: 'Svelte', description: 'Svelte is cool', subtitle: 'SvelteX'},
      {id: 3, name: 'Praxy', description: 'Praxy is awesome', subtitle: 'PraxyX'},
    ],
  },
  children: ({data}) => [
    L('ul', {
      children: data.items.map((item) =>
        L('li', {
          children: [
            L('strong', {children: [item.name]}),
            L('p', {children: [item.description], style: 'margin: 0'}),
            L('p', {
              children: [
                L('span', {children: [item.subtitle]})
              ],
              style: 'margin: 0'
            }),
          ],
          style: 'margin-bottom: 0.5em',
        }),
      ),
    }),
    L('button', {
      name: 'my-button',
      children: [
        data.amount ? `Clicked ${data.amount} times` : 'Click me'
      ],
      onclick() {
        data.amount = data.amount + 1;
        const items = [...data.items];
        items[0].name = 'React';
        items[1].subtitle = 'ReactX';
        data.items = items;
      },
    }),
    L('div', {
      children: [
        L('input', {
          type: 'text',
          onblur(e) {
            data.items = [
              ...data.items,
              {
                id: 4,
                name: e.target.value,
                description: 'New item',
                subtitle: 'New item sub',
              }
            ];
            e.target.value = '';
          },
        }),
      ],
    }),
  ],
});
