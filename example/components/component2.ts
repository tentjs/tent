import {App} from '../App';

const MyComponent2 = {
  name: 'myComponent2',
  template: /* html */ `
    <div>My other love is books, and this is my favorite: {{book}}</div>
    <input name="test-input2" />
    <div id="async-component"></div>
  `,
  data: {
    book: '...',
  },
};

const AsyncComponent = {
  data: {
    testAsync: 'it works!',
  },
  name: 'asyncComponent',
  template: /* html */ `
    Hello from async component! Does it work? {{testAsync}}
  `,
  target: '#async-component',
};

App.component(MyComponent2)
  .on('input', '[name="test-input2"]', ({self, target}) => {
    self.set('name', target.value);
  })
  .on('click', '.button', async ({self}) => {
    self.bind(['name', '[name="test-input2"]'], 'Sebastian');

    const res = await fetch('https://www.anapioficeandfire.com/api/books', {
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    });
    const books = await res.json();

    self.set('book', books[0].name);

    if (!self.componentExists(AsyncComponent.name)) {
      self.component(AsyncComponent);
    }
  });
