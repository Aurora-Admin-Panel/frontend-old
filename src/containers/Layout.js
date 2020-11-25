import React, { useContext, Suspense, useEffect, lazy } from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import routes from "../routes";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Main from "../containers/Main";
import { getMe } from "../redux/actions/users"
import ThemedSuspense from "../components/ThemedSuspense";
import { SidebarContext } from "../context/SidebarContext";

const Page404 = lazy(() => import("../pages/404"));

function Layout() {
  const permission = useSelector((state) => state.auth.permission);
  const me = useSelector(state => state.users.me);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch]);
  useEffect(() => {
    closeSidebar();
  }, [location]);

  if (!me) {
    return <Redirect from={location.pathname} to="/login" />;
  }
  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSidebarOpen && "overflow-hidden"
      }`}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          <Suspense fallback={<ThemedSuspense />}>
            <Switch>
              {routes.map((route, i) => {
                return route.component &&
                  route.permissions.includes(permission) ? (
                  <Route
                    key={i}
                    exact={true}
                    path={`/app${route.path}`}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
              <Redirect exact from="/app" to="/app/servers" />
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  );
}

export default Layout;
