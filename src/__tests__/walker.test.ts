import { fireEvent, getByRole, getByText } from '@testing-library/dom';
import { Component } from '../main';
import { mount } from '../mount';
import { tags } from '../tags';

const { div, p, button, ul, li } = tags;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('walker', () => {
  test('that it replaces when tagName differs', () => {
    mount(document.body, {
      state: { count: 0 },
      view: ({ state }) => {
        return div([
          state.count === 0 ? p('Hello, world!') : div('Adios, world!'),
          button('Click me', {
            onclick: () => state.count++,
          }),
        ]);
      },
    });

    const btn = getByRole(document.body, 'button');

    expect(getByText(document.body, /Hello, world!/).tagName).toBe('P');

    fireEvent.click(btn);

    expect(getByText(document.body, /Adios, world!/).tagName).toBe('DIV');
  });

  test('when node type is a text node', () => {
    mount(document.body, {
      state: { count: 0 },
      view: ({ state }) => {
        return div([
          state.count === 0 ? 'Hello, world!' : 'Adios, world!',
          button('Click me', {
            onclick: () => state.count++,
          }),
        ]);
      },
    });

    const btn = getByRole(document.body, 'button');

    expect(getByText(document.body, /Hello, world!/)).toBeDefined();

    fireEvent.click(btn);

    expect(getByText(document.body, /Adios, world!/)).toBeDefined();
  });

  test('attributes are removed', () => {
    mount(document.body, {
      state: { count: 0 },
      view: ({ state }) =>
        button('Click me', {
          onclick: () => state.count++,
          ['data-test']: state.count === 0,
        }),
    });

    const btn = getByRole(document.body, 'button');

    expect(btn.hasAttribute('data-test')).toBe(true);

    fireEvent.click(btn);

    expect(btn.hasAttribute('data-test')).toBe(false);
  });

  test('appending/removing children', () => {
    type State = { items: string[] };

    const Component: Component<State> = {
      state: { items: ['one', 'two', 'three'] },
      view: ({ state }) => {
        return div([
          ul(state.items.map((item) => li(item))),
          button('Add item', {
            onclick: () => {
              if (state.items.length === 4) {
                state.items = ['one'];
              } else {
                state.items = [...state.items, 'four'];
              }
            },
          }),
        ]);
      },
    };

    mount(document.body, Component);

    const btn = getByRole(document.body, 'button');

    expect(getByText(document.body, /one/)).toBeDefined();

    fireEvent.click(btn);

    expect(getByText(document.body, /four/)).toBeDefined();
    expect(document.querySelectorAll('li').length).toBe(4);

    fireEvent.click(btn);

    expect(getByText(document.body, /one/)).toBeDefined();
    expect(document.querySelectorAll('li').length).toBe(1);
  });
});
