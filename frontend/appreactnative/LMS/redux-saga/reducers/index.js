import {combineReducers} from 'redux';
import getMenuReducer from './GetMenuReducer';
import getQuizTestListReducer from './GetQuizTestListReducer';
import getQuizTestDetailReducer from './GetQuizTestDetailReducer';
import attendQuizTestReducer from './AttendQuizTestReducer';

const rootReducer = combineReducers({
  getMenuReducer,
  getQuizTestListReducer,
  getQuizTestDetailReducer,
  attendQuizTestReducer,
});

export default rootReducer;
