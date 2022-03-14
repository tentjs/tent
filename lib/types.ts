import {Praxy} from './Praxy';

export type Data = Record<string, unknown>;
export type Listeners = Record<string, (context: IListener) => void>;
export type Components = Record<string, Component>;
export type OnEvents = 'click' | 'input' | 'change' | 'select';
export type OnFire = (context: {
  self: Praxy;
  target: HTMLInputElement;
}) => void | Promise<void>;

export type AppContext = {
  data?: Data;
};

export type IListener = {
  self: Praxy;
  data: Data;
  key: string;
  value: unknown;
};

export type Component = {
  name: string;
  data: Data;
  template: string;
  target?: string;
};
