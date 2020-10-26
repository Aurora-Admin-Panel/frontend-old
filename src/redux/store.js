import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

import rootReducer from "./reducers";

const persistConfig = {
    key: 'root',
    storage,
  }
const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [thunkMiddleware, createLogger()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middlewares)
));
const persistor = persistStore(store)

export { persistor, store }
