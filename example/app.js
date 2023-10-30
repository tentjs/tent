import {createRouter} from '../dist/else'
import {Home, About, Layout, Form} from './pages'

createRouter(
  [
    {path: '/', component: Home},
    {path: '/about-us', component: About},
    {path: '/about-us/:id', component: About},
    {path: '/form', component: Form},
    {path: '/test/:id', component: About},
    {path: '/some/:param/:id', component: About},
  ],
  {
    fallback: '/',
    layout: Layout,
    root: document.querySelector('#app'),
  }
)
