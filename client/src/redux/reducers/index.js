import {combineReducers}from "redux";
import {routerReducer} from 'react-router-redux';
import {reducer as awaitReducer} from 'redux-await';

import sample from './sample';

const rootReducer = combineReducers({
    await: awaitReducer, routing: routerReducer,
    sample
})

export default rootReducer;