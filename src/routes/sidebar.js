/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
    permissions: ['admin'],
  },
  {
    path: '/app/users',
    icon: 'HomeIcon',
    name: 'Users',
    permissions: ['admin'],
  },
  {
    path: '/app/servers',
    icon: 'CardsIcon',
    name: 'Servers',
    permissions: ['admin', 'user'],
  },
  {
    path: '/app/forms',
    icon: 'FormsIcon',
    name: 'Forms',
    permissions: ['admin'],
  },
  {
    path: '/app/cards',
    icon: 'CardsIcon',
    name: 'Cards',
    permissions: ['admin'],
  },
  {
    path: '/app/charts',
    icon: 'ChartsIcon',
    name: 'Charts',
    permissions: ['admin'],
  },
  {
    path: '/app/buttons',
    icon: 'ButtonsIcon',
    name: 'Buttons',
    permissions: ['admin'],
  },
  {
    path: '/app/modals',
    icon: 'ModalsIcon',
    name: 'Modals',
    permissions: ['admin'],
  },
  {
    path: '/app/tables',
    icon: 'TablesIcon',
    name: 'Tables',
    permissions: ['admin'],
  },
  {
    icon: 'PagesIcon',
    name: 'Pages',
    permissions: ['admin'],
    routes: [
      // submenu
      {
        path: '/login',
        name: 'Login',
    permissions: ['admin'],
      },
      {
        path: '/create-account',
        name: 'Create account',
    permissions: ['admin'],
      },
      {
        path: '/forgot-password',
        name: 'Forgot password',
    permissions: ['admin'],
      },
      {
        path: '/app/404',
        name: '404',
    permissions: ['admin'],
      },
      {
        path: '/app/blank',
        name: 'Blank',
    permissions: ['admin'],
      },
    ],
  },
]

export default routes
