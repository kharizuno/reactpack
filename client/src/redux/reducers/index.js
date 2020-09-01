import {combineReducers}from "redux";
import {routerReducer} from 'react-router-redux';
import {reducer as awaitReducer} from 'redux-await';

const rootReducer = combineReducers({
    await: awaitReducer, routing: routerReducer
})

export default rootReducer;