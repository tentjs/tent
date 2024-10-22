type ComponentContext<S, A extends Attrs> = {
  state: S;
  el: TentNode<A>;
};

export type Attrs = {} | undefined;
export type Component<S extends {} = {}, A extends Attrs = {}> = {
  view: (context: ComponentContext<S, A>) => TentNode<A>;
  mounted?: (context: ComponentContext<S, A>) => void;
} & State<S>;
type State<S> = {} extends S ? {} : { state: S };

export type TentNode<A extends Attrs = undefined> = Node &
  Element &
  HTMLElement & {
    $tent: {
      attributes: Record<string, TagAttrsValues> & {
        mounted?: ({ el }: { el: TentNode }) => void;
        keep?: boolean;
      };
      isComponent?: boolean;
    };
    dataset: A & DOMStringMap;
    children: TentNode<A>[];
  };

export type Children =
  | string
  | number
  | TentNode
  | Element
  | (Node | string | Context)[];
export type Context = [string, Children, TagAttrs | undefined];

export type TagAttrsValues = string | boolean | number | Function;
type TagAttrs = Record<string, TagAttrsValues> & {
  mounted?: ({ el }: { el: TentNode }) => void;
  keep?: boolean;
};
export type Tags = Record<
  string,
  (children: Children, attrs?: TagAttrs) => TentNode
>;
