function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $98079f913a3af338$exports = {};

$parcel$export($98079f913a3af338$exports, "Praxy", () => $98079f913a3af338$export$b2a4668b848075f7);
class $98079f913a3af338$export$b2a4668b848075f7 {
    constructor(context){
        this.listeners = {
        };
        this.components = {
        };
        this.data = context?.data ?? {
        };
        this.proxy = new Proxy(this.data, {
            set: (data, _key, value)=>{
                const key = String(_key);
                if (this.listeners[key] != null && data[key] != value) this.listeners[key]({
                    data: data,
                    key: key,
                    value: value,
                    self: this
                });
                data[key] = value;
                return true;
            }
        });
    }
    set(key, value, listener) {
        if (this.listeners[key] == null && listener != null) this.listeners[key] = listener;
        this.update(`[a-text="${key}"]`, value);
        this.proxy[key] = value;
    }
    get(key) {
        return this.proxy[key];
    }
    /**
   * Listen for data changes
   * @param key
   * @param listener
   *
   * @example
   * App.listen('name', ({value}) => {
   *   console.log('Value of "name" changed to: ', value);
   * });
   */ listen(key, listener) {
        if (this.listeners[key] != null) return;
        this.set(key, this.get(key), listener);
    }
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
   */ on(event, target1, fire) {
        const events = [
            'click',
            'input',
            'change',
            'select'
        ];
        const els = document.querySelectorAll(target1);
        if (els == null || els.length === 0 || fire == null) {
            console.error(`Praxy->on: No possible matches for ${target1}`);
            return this;
        }
        if (!events.includes(event)) throw new Error(`${event} is not a valid event`);
        els.forEach((el)=>{
            el.addEventListener(event, async ({ target: target  })=>await fire({
                    self: this,
                    target: target
                })
            );
        });
        return this;
    }
    /**
   * Bind a value to multiple targets
   * @param targets DOM selector or key in data
   * @param value
   *
   * @example
   * App.bind(['name', '[name="input-1"]'], 'some value');
   */ bind(targets, value) {
        targets.forEach((target)=>{
            if (this.data[target] != null) this.set(target, value);
            if (this.getElements(target) != null) this.update(target, value);
        });
    }
    /**
   * Update DOM elements' value by target
   * @param target
   * @param value
   *
   * @example
   * App.update('[name="test"]', 'some value');
   */ update(target, value) {
        const els = this.getElements(target);
        if (els == null) return;
        els.forEach((el)=>{
            switch(el.nodeName){
                case 'INPUT':
                    el.value = `${value}`;
                    break;
                default:
                    el.textContent = `${value}`;
            }
        });
    }
    component(cmpt) {
        if (this.componentExists(cmpt.name)) throw new Error(`Component "${cmpt.name}" already exists`);
        this.components[cmpt.name] = cmpt;
        for(const key in this.components[cmpt.name].data){
            if (this.data[key] != null) throw new Error(`You are not allowed to override data for property \`${key}\` with "${this.components[key].data[key]}" in ${this.components[key].name}.`);
            this.data[key] = this.components[cmpt.name].data[key];
        }
        const el = document.querySelector(cmpt.target ?? '#app');
        if (el == null) throw new Error(`Your target parent ${cmpt.target} does not exist`);
        const regex = /{{[A-Z]+}}/gi;
        const regexMatches = cmpt.template.match(regex);
        if (regexMatches == null || regexMatches.length === 0) {
            el.insertAdjacentHTML('beforeend', cmpt.template);
            return this;
        }
        const matches = regexMatches.map((x)=>x.replace('{{', '').replace('}}', '')
        );
        const exists = matches.every((x)=>this.data[x] != null
        );
        if (!exists) throw new Error('Some of your interpolation keys does not exist');
        let template;
        matches.forEach((x)=>{
            template = (template ?? cmpt.template).replaceAll(`{{${x}}}`, `<span a-text="${x}">${this.get(x)}</span>`);
        });
        el.insertAdjacentHTML('beforeend', template);
        return this;
    }
    componentExists(name) {
        return this.components[name] != null;
    }
    getElements(target) {
        const els = document.querySelectorAll(target);
        if (els == null || els.length === 0) return;
        return els;
    }
}


$parcel$exportWildcard(module.exports, $98079f913a3af338$exports);


//# sourceMappingURL=main.js.map
