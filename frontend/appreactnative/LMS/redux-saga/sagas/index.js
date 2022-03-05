import {all} from 'redux-saga/effects';
import watchGetMenu from './GetMenuSaga';
import watchStudentAttendClass from './StudentAttendClassSaga';
import watchStudentAttendQuizTest from './StudentAttendQuizTestSaga';
import watchStudentGetActiveQuizOfSession from './StudentGetActiveQuizOfSessionSaga';
import watchStudentGetClassAssignmentList from './StudentGetClassAssignmentListSaga';
import watchStudentGetClassChapterList from './StudentGetClassChapterListSaga';
import watchStudentGetClassInformation from './StudentGetClassInformationSaga';
import watchStudentGetClassList from './StudentGetClassListSaga';
import watchStudentGetClassMemberList from './StudentGetClassMemberListSaga';
import watchStudentGetClassQuizList from './StudentGetClassQuizListSaga';
import watchStudentGetClassSessionList from './StudentGetClassSessionListSaga';
import watchStudentGetQuizTestDetail from './StudentGetQuizTestDetailSaga';
import watchStudentGetQuizTestList from './StudentGetQuizTestListSaga';
import watchStudentGetRegisterClassList from './StudentGetRegisterClassListSaga';
import watchStudentPostActiveQuizOfSession from './StudentPostActiveQuizOfSessionSaga';

export default function* rootSaga() {
  yield all([
    watchGetMenu(),
    watchStudentAttendClass(),
    watchStudentAttendQuizTest(),
    watchStudentGetActiveQuizOfSession(),
    watchStudentGetClassAssignmentList(),
    watchStudentGetClassChapterList(),
    watchStudentGetClassInformation(),
    watchStudentGetClassList(),
    watchStudentGetClassMemberList(),
    watchStudentGetClassQuizList(),
    watchStudentGetClassSessionList(),
    watchStudentGetQuizTestDetail(),
    watchStudentGetQuizTestList(),
    watchStudentGetRegisterClassList(),
    watchStudentPostActiveQuizOfSession(),
  ]);
}
