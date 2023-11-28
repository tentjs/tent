import { html, one } from './one'

const RouterView = {
  name: 'router-view',
  template: html`
    <div>
      <div></div>
    </div>
  `,
  setup({ watch, router, query }) {
    const container = query('div')

    watch('router.current', function (route) {
      container.append(document.createElement(route.component.name))
      one({...route.component})
    })
  },
}

export { RouterView }