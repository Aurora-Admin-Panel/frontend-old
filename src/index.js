import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Windmill } from "@windmill/react-ui";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import "./assets/css/tailwind.output.css";

import App from "./App";
import theme from "./theme";
import { store, persistor } from "./redux/store";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import * as serviceWorker from "./serviceWorker";

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe')
//   axe(React, ReactDOM, 1000)
// }
if (process.env.REACT_APP_VERSION !== "local") {
  Sentry.init({
    release: process.env.REACT_APP_VERSION,
    dsn:
      "https://b7e9b28f500e4ce0bae9a809d7f285f8@sentry.leishi.io/3",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SidebarProvider>
        <Suspense fallback={<ThemedSuspense />}>
          <Windmill theme={theme}>
            <App />
          </Windmill>
        </Suspense>
      </SidebarProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
