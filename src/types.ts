type ComponentContext<S, A> = {
  state: S;
  el: HTMLElement | Element;
  attr: <K extends keyof A>(name: K) => A[K] | undefined;
};

export type Attrs = {} | undefined;
export type Component<S = {}, A extends Attrs = undefined> = {
  view: (context: ComponentContext<S, A>) => TentNode;
  state?: S;
  mounted?: (context: ComponentContext<S, A>) => void;
};

export type TentNode = Node &
  Element &
  HTMLElement & {
    $tent: {
      attributes: object;
      isComponent: boolean;
    };
    children: TentNode[];
  };

export type Children = string | number | TentNode | (Node | string | Context)[];
export type Context = [string, Children, object | undefined];
