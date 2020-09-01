import {createStore, applyMiddleware, compose} from "redux";
import {routerMiddleware} from "react-router-redux";
import {middleware as awaitMiddleware} from 'redux-await';
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { createBrowserHistory } from "history";
import rootReducer from "../redux/reducers";

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const middleware = [thunk, awaitMiddleware, promise, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
const store = createStore(rootReducer, /*window.__initialData__,*/initialState,  composedEnhancers);

export default store;
