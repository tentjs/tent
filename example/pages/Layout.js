import {e, Link} from '../../dist/else'

const Layout = e(
  'div',
  [
    e(
      'header',
      [
        e(
          'nav',
          [
            Link({href: '/', text: 'home'}),
            Link({href: '/about-us', text: 'about us'}),
          ],
          {
            styles: {
              a: {
                margin: '0 10px 0 0',
                'text-decoration': 'none',
              },
              'a:hover': {
                'text-decoration': 'underline',
              },
            },
          }
        ),
      ],
      {
        styles: {
          padding: '60px 0',
        },
      }
    ),
    e('main', [], {view: true, styles: {width: '350px'}}),
    e('footer', '💛 else.js', {
      styles: {
        position: 'fixed',
        bottom: 0,
        padding: '24px 0',
        'font-size': '0.9em',
      },
    }),
  ],
  {
    styles: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      h1: {
        'margin-top': 0,
      },
    },
  }
)

export {Layout}
