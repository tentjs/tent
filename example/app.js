import {t, component} from '../dist/else'

let count = 0
let name = ''

component('my-component', function () {
  return t('div', [
    t('p', `Count ${count}`),
    t('p', `Name ${name}`),
    t('button', 'Click me', {
      onclick() {
        count++
      },
    }),
    t('input', [], {
      oninput(ev) {
        name = ev.target.value
      },
    }),
  ])
})
