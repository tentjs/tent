import { tags, createTag } from '../tags';

describe('tags.ts', () => {
  test('creating a custom tag', () => {
    const el = createTag(['div', 'test', { id: 'test' }]);

    expect(el.tagName).toBe('DIV');
    expect(el.textContent).toBe('test');
    expect(el.getAttribute('id')).toBe('test');
  });

  test('creating a tag with children', () => {
    const { p, div } = tags;

    const el = createTag([
      'div',
      [p('foo'), p('bar'), div([p('baz')])],
      { id: 'foo' },
    ]);

    expect(el.tagName).toBe('DIV');
    expect(el.children.length).toBe(3);
    expect(el.getAttribute('id')).toBe('foo');
    expect(el.children[2].tagName).toBe('DIV');
    expect(el.children[2].children.length).toBe(1);
    expect(el.children[2].children[0].tagName).toBe('P');
    expect(el.children[2].children[0].textContent).toBe('baz');
  });

  test('creating a tag with a number as a child', () => {
    const el = createTag(['div', 42, {}]);

    expect(el.tagName).toBe('DIV');
    expect(el.textContent).toBe('42');
  });

  test('create a tag with a Context as child', () => {
    const el = createTag([
      'div',
      [
        // Not sure passing a Context as a child is a good idea.
        // TODO: Maybe this shouldn't be supported.
        ['p', 'test', {}],
      ],
      {},
    ]);

    expect(el.tagName).toBe('DIV');
    expect(el.children.length).toBe(1);
    expect(el.children[0].tagName).toBe('P');
    expect(el.children[0].textContent).toBe('test');
  });

  test('have $tent.attributes properties', () => {
    const fn = jest.fn();
    const el = createTag([
      'button',
      'test',
      { id: 'foo', 'data-bar': 'baz', onclick: fn },
    ]);

    expect(el.$tent.attributes['id']).toBe('foo');
    expect(el.$tent.attributes['data-bar']).toBe('baz');
    expect(el.$tent.attributes['onclick']).toBe(fn);
  });

  test('mounted', () => {
    const fn = jest.fn();
    const el = createTag(['div', 'test', { mounted: fn }]);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ el });
  });
});
