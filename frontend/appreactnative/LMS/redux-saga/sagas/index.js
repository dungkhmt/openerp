import {all} from 'redux-saga/effects';
import watchGetMenu from './GetMenuSaga';
import watchStudentAttendClass from './StudentAttendClassSaga';
import watchStudentAttendQuizTest from './StudentAttendQuizTestSaga';
import watchStudentGetActiveQuizOfSession from './StudentGetActiveQuizOfSessionSaga';
import watchStudentGetClassAssignmentList from './StudentGetClassAssignmentListSaga';
import watchStudentGetClassChapterList from './StudentGetClassChapterListSaga';
import watchStudentGetClassChapterDetail from './StudentGetClassChapterDetailSaga';
import watchStudentPostClassChapterDetailSlides from './StudentPostClassChapterDetailSlidesSaga';
import watchStudentGetClassInformation from './StudentGetClassInformationSaga';
import watchStudentGetClassList from './StudentGetClassListSaga';
import watchStudentGetClassMemberList from './StudentGetClassMemberListSaga';
import watchStudentGetClassQuizList from './StudentGetClassQuizListSaga';
import watchStudentGetClassSessionList from './StudentGetClassSessionListSaga';
import watchStudentGetQuizTestDetail from './StudentGetQuizTestDetailSaga';
import watchStudentGetQuizTestList from './StudentGetQuizTestListSaga';
import watchStudentGetQuizTestQuestionList from './StudentGetQuizTestQuestionListSaga';
import watchStudentGetRegisterClassList from './StudentGetRegisterClassListSaga';
import watchStudentPostActiveQuizOfSession from './StudentPostActiveQuizOfSessionSaga';
import watchStudentPostQuizTestQuestion from './StudentPostQuizTestQuestionSaga';
import watchGetMyMeetingList from './GetMyMeetingListSaga';
import watchGetInvitedMeetingList from './GetInvitedMeetingListSaga';
import watchgetMeetingParticipantList from './GetMeetingParticipantListSaga';

export default function* rootSaga() {
  yield all([
    watchGetMenu(),
    watchStudentAttendClass(),
    watchStudentAttendQuizTest(),
    watchStudentGetActiveQuizOfSession(),
    watchStudentGetClassAssignmentList(),
    watchStudentGetClassChapterList(),
    watchStudentGetClassChapterDetail(),
    watchStudentPostClassChapterDetailSlides(),
    watchStudentGetClassInformation(),
    watchStudentGetClassList(),
    watchStudentGetClassMemberList(),
    watchStudentGetClassQuizList(),
    watchStudentGetClassSessionList(),
    watchStudentGetQuizTestDetail(),
    watchStudentGetQuizTestList(),
    watchStudentGetQuizTestQuestionList(),
    watchStudentGetRegisterClassList(),
    watchStudentPostActiveQuizOfSession(),
    watchStudentPostQuizTestQuestion(),
    watchGetMyMeetingList(),
    watchGetInvitedMeetingList(),
    watchgetMeetingParticipantList(),
  ]);
}
