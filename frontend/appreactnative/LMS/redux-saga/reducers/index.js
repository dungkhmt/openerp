import {combineReducers} from 'redux';
import getMenuReducer from './GetMenuReducer';
import studentGetQuizTestListReducer from './StudentGetQuizTestListReducer';
import studentGetQuizTestQuestionListReducer from './StudentGetQuizTestQuestionListReducer';
import studentPostQuizTestQuestionReducer from './StudentPostQuizTestQuestionReducer';
import studentGetQuizTestDetailReducer from './StudentGetQuizTestDetailReducer';
import studentAttendQuizTestReducer from './StudentAttendQuizTestReducer';
import studentGetClassListReducer from './StudentGetClassListReducer';
import studentGetClassInformationReducer from './StudentGetClassInformationReducer';
import studentGetClassSessionListReducer from './StudentGetClassSessionListReducer';
import studentGetActiveQuizOfSessionReducer from './StudentGetActiveQuizOfSessionReducer';
import studentGetClassMemberListReducer from './StudentGetClassMemberListReducer';
import studentGetClassAssignmentListReducer from './StudentGetClassAssignmentListReducer';
import studentGetClassChapterListReducer from './StudentGetClassChapterListReducer';
import studentGetClassChapterDetailReducer from './StudentGetClassChapterDetailReducer';
import studentPostClassChapterDetailSlidesReducer from './StudentPostClassChapterDetailSlidesReducer';
import studentGetClassQuizListReducer from './StudentGetClassQuizListReducer';
import studentPostActiveQuizOfSessionReducer from './StudentPostActiveQuizOfSessionReducer';
import studentGetRegisterClassListReducer from './StudentGetRegisterClassListReducer';
import studentAttendClassReducer from './StudentAttendClassReducer';
import getMyMeetingListReducer from './GetMyMeetingListReducer';
import getInvitedMeetingListReducer from './GetInvitedMeetingListReducer';
import getMeetingParticipantListReducer from './GetMeetingParticipantListReducer';

const rootReducer = combineReducers({
  getMenuReducer,
  studentGetQuizTestListReducer,
  studentGetQuizTestQuestionListReducer,
  studentPostQuizTestQuestionReducer,
  studentGetQuizTestDetailReducer,
  studentAttendQuizTestReducer,
  studentGetClassListReducer,
  studentGetClassInformationReducer,
  studentGetClassSessionListReducer,
  studentGetActiveQuizOfSessionReducer,
  studentGetClassMemberListReducer,
  studentGetClassAssignmentListReducer,
  studentGetClassChapterListReducer,
  studentGetClassChapterDetailReducer,
  studentPostClassChapterDetailSlidesReducer,
  studentGetClassQuizListReducer,
  studentPostActiveQuizOfSessionReducer,
  studentGetRegisterClassListReducer,
  studentAttendClassReducer,
  getMyMeetingListReducer,
  getInvitedMeetingListReducer,
  getMeetingParticipantListReducer,
});

export default rootReducer;
