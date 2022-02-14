import {combineReducers} from 'redux';
import getMenuReducer from './GetMenuReducer';

const rootReducer = combineReducers({
  getMenuReducer,
});

export default rootReducer;
