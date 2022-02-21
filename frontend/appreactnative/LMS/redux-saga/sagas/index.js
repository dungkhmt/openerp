import {all} from 'redux-saga/effects';
import watchGetMenu from './GetMenuSaga';
import watchGetQuizTest from './GetQuizTestListSaga';
import watchGetQuizTestDetail from './GetQuizTestDetailSaga';
import watchAttendQuizTest from './AttendQuizTestSaga';
import watchGetStudentClassList from './GetStudentClassListSaga';
import watchGetStudentClassInformation from './GetStudentClassInformationSaga';
import watchGetStudentClassSessions from './GetStudentClassSessionsSaga';
import watchGetActiveQuizOfSessionForStudent from './GetActiveQuizOfSessionForStudentSaga';
import watchGetStudentClassMembers from './GetStudentClassMembersSaga';
import watchGetStudentClassAssignments from './GetStudentClassAssignmentsSaga';
import watchGetStudentClassChapters from './GetStudentClassChaptersSaga';
import watchGetStudentClassQuizzes from './GetStudentClassQuizzesSaga';
import watchPostActiveQuizOfSessionForStudent from './PostActiveQuizOfSessionForStudentSaga';

export default function* rootSaga() {
  yield all([
    watchGetMenu(),
    watchGetQuizTest(),
    watchGetQuizTestDetail(),
    watchAttendQuizTest(),
    watchGetStudentClassList(),
    watchGetStudentClassInformation(),
    watchGetStudentClassSessions(),
    watchGetActiveQuizOfSessionForStudent(),
    watchGetStudentClassMembers(),
    watchGetStudentClassAssignments(),
    watchGetStudentClassChapters(),
    watchGetStudentClassQuizzes(),
    watchPostActiveQuizOfSessionForStudent(),
  ]);
}
