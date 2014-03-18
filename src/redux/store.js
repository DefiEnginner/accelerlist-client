import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import rootSaga from './sagas'
import LogRocket from 'logrocket';

const history = createHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
let middlewares = [sagaMiddleware, routeMiddleware]
if(process.env.REACT_APP_LOG_ROCKET_ENV === 'production') middlewares.push(LogRocket.reduxMiddleware());

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  process.env.NODE_ENV !== 'production' ? composeWithDevTools(applyMiddleware(...middlewares)) : applyMiddleware(...middlewares)
)

sagaMiddleware.run(rootSaga)
export { store, history }
