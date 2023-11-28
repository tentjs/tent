// @flow

export type Store = {
  state?: { [string]: mixed },
  get: (key: string) => mixed,
  set: (key: string, value: mixed) => void,
  length: number
}

export type OneElement = HTMLElement & {
  // TODO Should the setup and created functions be here?
  $one: Config,
  on?: Function,
  if?: Function,
  for?: Function,
  [string]: Function
}

export type Props = Array<string> | { [string]: mixed }
export type State = Object
export type Computed = { [string]: Function }
export type Key = string | number | boolean

export type Config = {
  // TODO `el` is not defined when using one({ ... })
  el: OneElement,
  key?: Key,
  uid?: number,
  // TODO Consider renaming this to `selector`
  name?: string,
  template?: TrustedHTML,
  computed?: Computed,
  props?: Props,
  state?: State,
  parent?: Config,
  store?: Store,
  setup?: Function,
  created?: Function,
  components?: Array<Config>,
  render?: boolean,
  events?: { [string]: (mixed, Config) => void },
  router?: Router,
  loop?: {
    parent: OneElement,
    el: OneElement,
    items: string,
    key: ?Key,
    fn: Function
  }
}

// TODO Consider saving `setup` and `created` on each component,
// [string]: { setup: Function, created: Function, configs: Array<Config> }
export type Components = {
  [string]: Array<Config>
}

export type Route = {
  path: string,
  component: Config,
}
export type Router = {
  routes: Array<Route>,
  current: ?Route,
  add: (path: string, component: Config) => void,
  navigate: (path: string) => void,
}