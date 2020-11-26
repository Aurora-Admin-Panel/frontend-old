import React from 'react'
import { useSelector } from 'react-redux'

import * as Icons from "phosphor-react"
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import SidebarSubmenu from './SidebarSubmenu'

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} weight="bold" />
}

function SidebarContent() {
  const permission = useSelector(state => state.auth.permission)

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <span className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200">
        极光面板
      </span>
      <ul className="mt-6">
        {routes.map((route) =>
          route.routes && route.permissions.includes(permission) ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            route.permissions.includes(permission) ? (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          ) : null )
        )}
      </ul>
    </div>
  )
}

export default SidebarContent
