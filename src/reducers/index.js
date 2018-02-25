import {
    combineReducers,
} from 'redux-immutable';

// import { combineReducers } from 'redux';
import * as commonReducers from './common';
import * as flowReducers from './flow';

const rootReducer = combineReducers({
    ...commonReducers,
    ...flowReducers,
});

export default rootReducer;
