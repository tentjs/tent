import { Component, tags } from '../main';
import { mount } from '../mount';

describe('mount', () => {
  test('`null` element', () => {
    const el = document.querySelector('.not-defined');

    expect(mount(el, {} as Component)).toBe(undefined);
  });

  test('setting an unknown state property', () => {
    const el = document.createElement('div');

    expect(() =>
      mount(el, {
        state: { count: 0 },
        view: () => tags.div(''),
        mounted: ({ state }) => {
          state['unknown']++;
        },
      }),
    ).toThrow();
  });

  test('setting a state property to the same value', () => {
    const el = document.createElement('div');

    expect(() =>
      mount(el, {
        state: { count: 0 },
        view: () => tags.div(''),
        mounted: ({ state }) => {
          state.count = 0;
        },
      }),
    ).not.toThrow();
  });
});
