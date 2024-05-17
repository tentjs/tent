import { getAttribute } from './attributes';
import {
  type Children,
  type Context,
  type Component,
  type TentNode,
  type Attrs,
} from './types';
import { createTag, tags } from './tags';
import { walker } from './walker';

function mount<S extends {} = {}, A extends Attrs = {}>(
  element: HTMLElement | Element | TentNode<A> | null,
  component: Component<S, A>,
) {
  if (element == null) {
    return;
  }

  let node: TentNode<A>;
  const { state = {} as S, view, mounted } = component;
  const el = element as TentNode<A>;

  el.$tent = {
    attributes: {},
    isComponent: true,
  };

  const handler = {
    get(obj: S, key: string) {
      if (typeof obj[key] === 'object' && obj[key] != null) {
        return new Proxy(obj[key], handler);
      } else {
        return obj[key];
      }
    },
    set(obj: S, prop: string, value: unknown) {
      if (!obj.hasOwnProperty(prop)) {
        throw new Error(
          `The property "${String(prop)}" does not exist on the state object.`,
        );
      }
      if (obj[prop] === value) return true;

      const s = Reflect.set(obj, prop, value);

      walker(node, view({ state: proxy, el, attr: getAttribute<A>(el) }));

      return s;
    },
  };

  const proxy = new Proxy<S>({ ...state }, handler);

  node = view({ state: proxy, el, attr: getAttribute<A>(el) });
  node.$tent = {
    attributes: {},
    isComponent: false,
  };

  el.append(node);

  mounted?.({ state: proxy, el, attr: getAttribute<A>(el) });
}

export {
  mount,
  tags,
  createTag,
  type Component,
  type Children,
  type Context,
  type TentNode,
};
