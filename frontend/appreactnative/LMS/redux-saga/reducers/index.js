import {combineReducers} from 'redux';
import getMenuReducer from './GetMenuReducer';
import getQuizTestListReducer from './GetQuizTestListReducer';
import getQuizTestDetailReducer from './GetQuizTestDetailReducer';
import attendQuizTestReducer from './AttendQuizTestReducer';
import getStudentClassListReducer from './GetStudentClassListReducer';
import getStudentClassInformationReducer from './GetStudentClassInformationReducer';
import getStudentClassSessionsReducer from './GetStudentClassSessionsReducer';
import getActiveQuizOfSessionForStudentReducer from './GetActiveQuizOfSessionForStudentReducer';
import getStudentClassMembersReducer from './GetStudentClassMembersReducer';
import getStudentClassAssignmentsReducer from './GetStudentClassAssignmentsReducer';
import getStudentClassChaptersReducer from './GetStudentClassChaptersReducer';
import getStudentClassQuizzesReducer from './GetStudentClassQuizzesReducer';
import postActiveQuizOfSessionForStudentReducer from './PostActiveQuizOfSessionForStudentReducer';
import getStudentRegisterClassListReducer from './GetStudentRegisterClassListReducer';
import studentAttendClassReducer from './StudentAttendClassReducer';

const rootReducer = combineReducers({
  getMenuReducer,
  getQuizTestListReducer,
  getQuizTestDetailReducer,
  attendQuizTestReducer,
  getStudentClassListReducer,
  getStudentClassInformationReducer,
  getStudentClassSessionsReducer,
  getActiveQuizOfSessionForStudentReducer,
  getStudentClassMembersReducer,
  getStudentClassAssignmentsReducer,
  getStudentClassChaptersReducer,
  getStudentClassQuizzesReducer,
  postActiveQuizOfSessionForStudentReducer,
  getStudentRegisterClassListReducer,
  studentAttendClassReducer,
});

export default rootReducer;
