import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Users = lazy(() => import('../pages/Users'))
const Servers = lazy(() => import('../pages/Servers'))
const ServerPorts = lazy(() => import('../pages/ServerPorts'))
const About = lazy(() => import('../pages/About'))
const Me = lazy(() => import('../pages/Me'))
const User = lazy(() => import('../pages/User'))
const ServerUsers = lazy(() => import('../pages/ServerUsers'))
const Artifacts = lazy(() => import('../pages/Artifacts'))

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
    permissions: ['admin', 'ops', 'user']
  },
  {
    path: '/servers/:server_id/ports',
    component: ServerPorts,
    permissions: ['admin', 'ops', 'user']
  },
  {
    path: '/servers/:server_id/users',
    component: ServerUsers,
    permissions: ['admin', 'ops']
  },
  {
    path: '/servers/:server_id/:port_id/artifacts',
    component: Artifacts,
    permissions: ['admin', 'ops', 'user']
  },
  {
    path: '/users/:user_id',
    component: User,
    permissions: ['admin']
  },
  {
    path: '/about',
    component: About,
    permissions: ['admin', 'ops', 'user']
  },
  {
    path: '/me',
    component: Me,
    permissions: ['admin', 'ops', 'user']
  },
]

export default routes
