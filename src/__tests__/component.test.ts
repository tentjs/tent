import { mount } from '../mount';
import { tags } from '../tags';
import { type Component } from '../types';
import {
  getByText,
  getByTestId,
  fireEvent,
  getByRole,
  queryByText,
} from '@testing-library/dom';

const { div, p, button } = tags;

beforeEach(() => {
  document.body.innerHTML = '';
});

const Counter: Component<{ count: number }> = {
  state: { count: 0 },
  view: ({ state }) =>
    div(
      [
        p(`Count: ${state.count}`),
        button('Increment', {
          onclick: () => state.count++,
          className: `${state.count > 0 ? 'positive' : 'negative'}`,
          autofocus: state.count === 0,
          ['data-testid']: 'increment',
        }),
      ],
      { ['data-testid']: 'counter' },
    ),
};

describe('components', () => {
  test('counter', () => {
    mount(document.body, Counter);

    const el = getByTestId(document.body, 'counter');
    const btn = getByTestId(document.body, 'increment');

    expect(getByText(el, /Count: 0/));
    expect(btn.className).toBe('negative');
    expect(btn.hasAttribute('autofocus')).toBe(true);

    fireEvent.click(btn);

    expect(getByText(el, /Count: 1/));
    expect(btn.className).toBe('positive');
    expect(btn.hasAttribute('autofocus')).toBe(false);
  });

  test('mounted', () => {
    const mounted = jest.fn();

    mount(document.body, { ...Counter, mounted });

    expect(mounted).toHaveBeenCalledTimes(1);
  });

  test('with state', () => {
    const WithState: Component<{ count: number }> = {
      state: { count: 0 },
      view: ({ state }) => div(p(`Count: ${state.count}`)),
    };

    mount(document.body, WithState);

    const el = getByText(document.body, /Count: 0/);

    expect(el).toBeDefined();
  });

  test('without state', () => {
    const WithoutState: Component = {
      view: () => div(p(`No state`)),
    };

    mount(document.body, WithoutState);

    const el = getByText(document.body, /No state/);

    expect(el).toBeDefined();
  });

  test('keep', () => {
    const KeepComponent: Component<{ count: number }> = {
      state: { count: 0 },
      view({ state }) {
        return div(
          div(
            [
              `Don't change me ${state.count}`,
              button('Increment', {
                onclick: () => state.count++,
              }),
            ],
            { keep: true },
          ),
        );
      },
    };

    mount(document.body, KeepComponent);

    const btn = getByRole(document.body, 'button');

    expect(btn).toBeDefined();

    fireEvent.click(btn);

    expect(queryByText(document.body, /Don't change me 0/)).toBeTruthy();
    expect(queryByText(document.body, /Don't change me 1/)).toBeNull();
  });
});
