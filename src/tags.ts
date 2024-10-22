import { addAttribute } from './attributes';
import { mount } from './mount';
import {
  type Tags,
  type Context,
  type TentNode,
  Component,
  Children,
} from './types';

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
    for (let i = 0; i < children.length; i++) {
      const c = children[i];

      if (Array.isArray(c)) {
        el.append(createTag(c));
      } else if (isComponent(c)) {
        mount(el, c);
      } else {
        el.append(c);
      }
    }
  } else {
    if (isComponent(children)) {
      mount(el, children);
    } else {
      el.append(typeof children === 'number' ? children.toString() : children);
    }
  }

  attributes?.mounted?.({ el });

  return el;
}

function isComponent(children: Children): children is Component<any, any> {
  return typeof children === 'object' && 'view' in children;
}

const tags: Tags = {};
const tagsArray = [
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
];

for (let i = 0; i < tagsArray.length; i++) {
  const tag = tagsArray[i];

  tags[tag] = (children, attrs) => createTag([tag, children, attrs]);
}

export { tags, createTag };
