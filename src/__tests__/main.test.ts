import { fireEvent, getByRole, getByTestId } from '@testing-library/dom';
import { mount, tags, type Component } from '../main';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('main', () => {
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

  test('that attributes are set when using `mount` with attrs set', () => {
    const target = document.createElement('div');
    target.setAttribute('data-testid', 'test');
    document.body.append(target);

    const TestComponent: Component = {
      view: () => tags.div('Hey, this is me!'),
    };

    mount(target, TestComponent, {
      id: 'foo',
      foo: 'bar',
    });

    const el = getByTestId(document.body, 'test');

    expect(el.getAttribute('id')).toBe('foo');
    expect(el.getAttribute('foo')).toBe('bar');
  });

  test('that attributes are set when using `mount` and dynamic mounting', () => {
    const target = document.createElement('div');
    target.setAttribute('data-testid', 'test');
    document.body.append(target);

    const modalTarget = document.createElement('div');
    modalTarget.setAttribute('data-testid', 'modal');
    document.body.append(modalTarget);

    const Parent: Component = {
      view: () =>
        tags.button('Click me', {
          onclick() {
            mount(modalTarget, Modal, { modalId: 'foo' });
          },
        }),
    };

    const Modal: Component = {
      view: () => tags.p('I am a modal'),
    };

    mount(target, Parent, {
      id: 'foo',
      foo: 'bar',
    });

    const el = getByTestId(document.body, 'test');

    expect(el.getAttribute('id')).toBe('foo');
    expect(el.getAttribute('foo')).toBe('bar');

    const btn = getByRole(document.body, 'button');

    fireEvent.click(btn);

    const modal = getByTestId(document.body, 'modal');

    expect(modal.getAttribute('modalId')).toBe('foo');
  });
});
