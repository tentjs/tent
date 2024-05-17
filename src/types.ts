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
      isComponent: boolean;
    };
    dataset: A & DOMStringMap;
    children: TentNode<A>[];
  };

export type Children = string | number | TentNode | (Node | string | Context)[];
export type Context = [string, Children, object | undefined];

export type Tags = Record<
  string,
  (children: Children, attrs?: object) => TentNode
>;
