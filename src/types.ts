export type Component<S> = {
  view: (context: {state: S}) => TentNode;
  state?: S;
  mounted?: (context: {state: S}) => void;
};

export type TentNode = Node & Element & HTMLElement & {
  $tent: {
    attributes: object;
    isComponent: boolean;
  };
  children: TentNode[];
};

export type TentNodeList = NodeListOf<TentNode>;

export type Children = string | number | TentNode | (Node | string | Context)[]
export type Context = [string, Children, object | undefined];
