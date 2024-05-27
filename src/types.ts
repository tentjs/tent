type ComponentContext<S, A extends Attrs> = {
  state: S;
  el: TentNode<A>;
  // @deprecated Use `el.dataset` instead
  attr: <K extends keyof A>(name: K) => A[K] | undefined;
};

export type Attrs = {} | undefined;
export type Component<S extends {} = {}, A extends Attrs = {}> = {
  view: (context: ComponentContext<S, A>) => TentNode<A>;
  state?: S;
  mounted?: (context: ComponentContext<S, A>) => void;
};

export type TentNode<A extends Attrs = undefined> = Node &
  Element &
  HTMLElement & {
    $tent: {
      attributes: object;
    };
    dataset: A & DOMStringMap;
    children: TentNode<A>[];
  };

export type Children = string | number | TentNode | (Node | string | Context)[];
export type Context = [string, Children, TagAttrs | undefined];

export type TagAttrsValues = string | boolean | number | Function;
type TagAttrs = Record<string, TagAttrsValues> & {
  mounted?: ({ el }: { el: TentNode }) => void;
};
export type Tags = Record<
  string,
  (children: Children, attrs?: TagAttrs) => TentNode
>;
