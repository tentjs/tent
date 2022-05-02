type Data = Record<string, unknown>;
type OnEvents = 'click' | 'input' | 'change' | 'select';
type OnFire = (context: {
    self: Praxy;
    target: HTMLInputElement;
}) => void | Promise<void>;
type AppContext = {
    data?: Data;
};
type IListener = {
    self: Praxy;
    data: Data;
    key: string;
    value: unknown;
};
type Component = {
    name: string;
    data: Data;
    template: string;
    target?: string;
};
export class Praxy {
    constructor(context?: AppContext);
    set(key: string, value: unknown, listener?: (context: IListener) => unknown): void;
    get(key: string): unknown;
    /**
     * Listen for data changes
     * @param key
     * @param listener
     *
     * @example
     * App.listen('name', ({value}) => {
     *   console.log('Value of "name" changed to: ', value);
     * });
     */
    listen(key: string, listener: (context: IListener) => void): void;
    /**
     * Bind an event on a `HTMLInputElement` to some actions
     * @param event
     * @param target
     * @param fire
     *
     * @example
     * .on('input', '[name="test-input"]', ({self, target}) => {
     *   self.set('name', target.value);
     * });
     */
    on(event: OnEvents, target: string, fire: OnFire): Praxy;
    /**
     * Bind a value to multiple targets
     * @param targets DOM selector or key in data
     * @param value
     *
     * @example
     * App.bind(['name', '[name="input-1"]'], 'some value');
     */
    bind(targets: string[], value: unknown): void;
    component(cmpt: Component): Praxy;
    componentExists(name: string): boolean;
}

//# sourceMappingURL=types.d.ts.map
