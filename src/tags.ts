import { addAttribute } from './attributes';
import { type Tags, type Context, type TentNode } from './types';

function createTag(context: Context) {
  const [tag, children, attributes] = context;

  const el = document.createElement(tag) as TentNode;

  el.$tent = {
    attributes: {},
  };

  for (const key in attributes) {
    const value = attributes[key];

    el.$tent.attributes[key] = value;

    addAttribute(el, key, value);
  }

  if (Array.isArray(children)) {
    children.forEach((c) => {
      el.append(Array.isArray(c) ? createTag(c) : c);
    });
  } else {
    el.append(typeof children === 'number' ? children.toString() : children);
  }

  return el;
}

const tags: Tags = {};
[
  'div',
  'p',
  'ul',
  'li',
  'button',
  'input',
  'label',
  'form',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'img',
  'video',
  'audio',
  'canvas',
  'table',
  'tr',
  'td',
  'th',
  'thead',
  'tbody',
  'tfoot',
  'select',
  'option',
  'textarea',
  'pre',
  'code',
  'blockquote',
  'hr',
  'br',
  'iframe',
  'nav',
  'header',
  'footer',
  'main',
  'section',
  'article',
  'aside',
  'small',
  'b',
].forEach(
  (tag) => (tags[tag] = (children, attrs) => createTag([tag, children, attrs])),
);

export { tags, createTag };
