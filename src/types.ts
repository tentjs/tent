export type Component<S> = {
  view: (context: { state: S; el: HTMLElement | Element }) => TentNode;
  state?: S;
  mounted?: (context: { state: S; el: HTMLElement | Element }) => void;
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
