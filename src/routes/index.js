import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Users = lazy(() => import('../pages/Users'))
const Servers = lazy(() => import('../pages/Servers'))
const Server = lazy(() => import('../pages/Server'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const Tables = lazy(() => import('../pages/Tables'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))
const About = lazy(() => import('../pages/About'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
    permissions: ['admin'],
  },
  {
    path: '/users',
    component: Users,
    permissions: ['admin']
  },
  {
    path: '/servers',
    component: Servers,
    permissions: ['admin', 'user']
  },
  {
    path: '/servers/:server_id',
    component: Server,
    permissions: ['admin', 'user']
  },
  {
    path: '/about',
    component: About,
    permissions: ['admin', 'user']
  },
  {
    path: '/forms',
    component: Forms,
    permissions: ['admin'],
  },
  {
    path: '/cards',
    component: Cards,
    permissions: ['admin'],
  },
  {
    path: '/charts',
    component: Charts,
    permissions: ['admin'],
  },
  {
    path: '/buttons',
    component: Buttons,
    permissions: ['admin'],
  },
  {
    path: '/modals',
    component: Modals,
    permissions: ['admin'],
  },
  {
    path: '/tables',
    component: Tables,
    permissions: ['admin'],
  },
  {
    path: '/404',
    component: Page404,
    permissions: ['admin'],
  },
  {
    path: '/blank',
    component: Blank,
    permissions: ['admin'],
  },
]

export default routes
