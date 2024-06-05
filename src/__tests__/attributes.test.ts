import { addAttribute, addAttributes } from '../attributes';
import { tags } from '../tags';

describe('attributes.ts', () => {
  test('adds a simple attribute', () => {
    const el = document.createElement('div');

    addAttribute(el, 'id', 'test');

    expect(el.getAttribute('id')).toBe('test');
  });

  test('adds a custom attribute', () => {
    const el = document.createElement('div');

    addAttribute(el, 'data-test', 'test');

    expect(el.getAttribute('data-test')).toBe('test');
  });

  test('adds and removes a boolean attribute', () => {
    const el = document.createElement('input');

    addAttribute(el, 'disabled', true);
    expect(el.hasAttribute('disabled')).toBe(true);

    addAttribute(el, 'disabled', false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  test('adds an assignment', () => {
    const el = document.createElement('input');

    addAttribute(el, 'value', 'test');

    expect(el.value).toBe('test');
  });

  test("doesn't add `mounted` as an attribute", () => {
    const el = document.createElement('div');

    addAttribute(el, 'mounted', 'test');

    expect(el.hasAttribute('mounted')).toBe(false);
  });

  test('addAttributes adds all attributes', () => {
    const el = tags.div([]);

    addAttributes(el, {
      id: 'test',
      foo: 'bar',
    });

    expect(el.getAttribute('id')).toBe('test');
    expect(el.getAttribute('foo')).toBe('bar');
  });
});
