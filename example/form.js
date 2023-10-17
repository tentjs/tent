import {App} from './app';

App.component(
  'my-form',
  {
    data: {
      form: {
        name: '',
        email: '',
        phone: '',
      },
      errors: [],
    },
  },
  ({on, data}) => {
    const ul = document.createElement('ul');
    const errorsMap = new Map();

    on('input', '#my-form input', ({target}) => {
      if (data.form[target.name] != null) {
        data.form[target.name] = target.value;
      }
    });
    on('submit', '#my-form', ({target}) => {
      data.errors = [];
      for (const key in data.form) {
        if (data.form[key] === '') {
          const li = document.createElement('li');
          data.errors = [...data.errors, `${key} is required`];
          li.setAttribute('key', key);
          li.textContent = `${key} is required`;
          if (!errorsMap.has(key)) {
            errorsMap.set(key, li);
            ul.appendChild(li);
          }
        } else {
          errorsMap.delete(key);
          ul.querySelector(`li[key="${key}"]`)?.remove();
        }
      }
      if (errorsMap.size > 0) {
        if (!target.contains(ul)) {
          target.appendChild(ul);
        }
      } else {
        ul.remove();
      }
      console.log(JSON.stringify(data));
      console.log(errorsMap);
    });
  }
);
