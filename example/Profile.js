import { button, div, h2, p, span } from '../lib/one'
import { getUser } from './services/get-user'
import styles from './styles.module.css'

function view({ state }) {
  async function onclick() {
    state.isLoading = true
    state.user = await getUser(1)
    state.notFound = false
    state.isLoading = false
  }

  return div([
    h2('Profile'),
    !state.user && !state.notFound || state.isLoading ? div([
      skeleton('20px', '100px'),
      skeleton('20px', '80px'),
      skeleton('20px', '180px'),
    ]) : div(
      state.notFound ? [
        div('User not found', { className: styles.warning }),
        button('Try again', { onclick, className: styles.button }),
      ] :
        Object.keys(state.user).map(key => {
          if (key === 'id') return
          return p([
            span(`${uppercaseFirst(key)}: `),
            span(state.user[key], { className: styles.bold }),
          ])
        })
    ),
  ], { className: styles.profile })
}

function uppercaseFirst(str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`
}

async function mounted({ state, props }) {
  const user = await getUser(props.get('id'))

  state.isLoading = false
  state.notFound = !Boolean(user)
  state.user = user ? user : undefined
}

function skeleton(height = '1em', width = '100%') {
  return div([], {
    className: styles.skeleton,
    style: `height: ${height}; width: ${width};`
  })
}

const Profile = {
  selector: '.profile',
  view,
  state: { user: undefined, notFound: false, isLoading: true },
  mounted,
}

export { Profile }
