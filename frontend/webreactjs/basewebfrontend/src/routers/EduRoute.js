import { Route, Switch, useRouteMatch } from "react-router";
import AssignmentList from "../component/education/AssignmentList";
import ClassCreate from "../component/education/class/ClassCreate";
import { MainBoard } from "../component/education/whiteboard/MainBoard";
// import ClassesList from "../component/education/class/ClassesList";
import PlanDetail from "../component/education/classteacherassignment/assignmentPlan/PlanDetail";
import ClassTeacherAssignmentPlanList from "../component/education/classteacherassignment/PlanList";
import AddNewCourse from "../component/education/course/AddNewCourse";
import CourseDetail from "../component/education/course/CourseDetail";
import CourseList from "../component/education/course/CourseList";
import CreateChapterMaterialOfCourse from "../component/education/course/CreateChapterMaterialOfCourse";
import CreateChapterOfCourse from "../component/education/course/CreateChapterOfCourse";
import CreateQuizChoiceAnswerOfCourse from "../component/education/course/CreateQuizChoiceAnswerOfCourse";
import CreateQuizOfCourse from "../component/education/course/CreateQuizOfCourse";
import CreateTopicOfCourse from "../component/education/course/CreateTopicOfCourse";
import StudentCourseChapterDetail from "../component/education/course/StudentCourseChapterDetail";
import StudentCourseChapterMaterialDetail from "../component/education/course/StudentCourseChapterMaterialDetail";
import TeacherCourseChapterDetail from "../component/education/course/TeacherCourseChapterDetail";
import TeacherCourseChapterMaterialDetail from "../component/education/course/TeacherCourseChapterMaterialDetail";
import TeacherCourseDetail from "../component/education/course/TeacherCourseDetail";
import TeacherCourseList from "../component/education/course/TeacherCourseList";
import TeacherCourseQuizChoiceAnswerDetail from "../component/education/course/TeacherCourseQuizChoiceAnswerDetail";
import TeacherCourseQuizDetail from "../component/education/course/TeacherCourseQuizDetail";
import TeacherCourseTopicDetail from "../component/education/course/TeacherCourseTopicDetail";
import TeacherViewCourseQuizDetail from "../component/education/course/TeacherViewCourseQuizDetail";
// import CreateSemester from "../component/education/CreateSemester";
import CreateQuizTest from "../component/education/quiztest/CreateQuizTest";
import QuizTestDetail from "../component/education/quiztest/QuizTestDetail";
import QuizTestEdit from "../component/education/quiztest/QuizTestEdit";
import QuizTestList from "../component/education/quiztest/QuizTestList";
import StudentQuizDetail from "../component/education/quiztest/StudentQuizDetail";
import StudentQuizList from "../component/education/quiztest/StudentQuizTestList";
import ResourceCreate from "../component/education/resourcelink/ResourceCreate";
import ResourceDomainCreate from "../component/education/resourcelink/ResourceDomainCreate";
import ResourceDomainEdit from "../component/education/resourcelink/ResourceDomainEdit";
import ResourceDomainList from "../component/education/resourcelink/ResourceDomainList";
import ResourceList from "../component/education/resourcelink/ResourceList";
import AddTeacher from "../component/education/teacher/AddTeacher";
import TeacherDetail from "../component/education/teacher/TeacherDetail";
// import TeacherList from "../component/education/teacher/TeacherList";
import ClassRegistration from "../views/Education/ClassManagement/Student/ClassRegistration";
import SAssignmentDetail from "../views/Education/ClassManagement/Student/SAssignmentDetail";
import SClassDetail from "../views/Education/ClassManagement/Student/SClassDetail";
import SClassList from "../views/Education/ClassManagement/Student/SClassList";
import StudentViewLearningSessionDetail from "../views/Education/ClassManagement/Student/StudentViewLearningSessionDetail";
import CreateAssignment from "../views/Education/ClassManagement/Teacher/CreateAssignment";
import StudentLearningProgressDetail from "../views/Education/ClassManagement/Teacher/StudentLearningProgressDetail";
import TAssignmentDetail from "../views/Education/ClassManagement/Teacher/TAssignmentDetail";
import TClassDetail from "../views/Education/ClassManagement/Teacher/TClassDetail";
import TClassList from "../views/Education/ClassManagement/Teacher/TClassList";
import TeacherViewDetailClass from "../views/Education/ClassManagement/Teacher/TeacherViewDetailClass";
import TeacherViewLearningSessionDetail from "../views/Education/ClassManagement/Teacher/TeacherViewLearningSessionDetail";
import TeacherViewQuestionsOfParticipant from "../component/education/quiztest/TeacherViewQuestionsOfParticipant";

import NotFound from "../views/errors/NotFound";
import StudentCreateThesis from "../component/education/thesisdefensejury/StudentCreateThesis"

export default function EduRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={StudentLearningProgressDetail}
          path={`${path}/student/learning/detail/:id`}
          exact
        />

        <Route
          component={TeacherCourseList}
          path={`${path}/teacher/course/list`}
        />
        <Route
          component={TeacherCourseDetail}
          path={`${path}/course/detail/:id`}
          exact
        />
        <Route
          component={CreateChapterOfCourse}
          path={`${path}/course/detail/chapter/create/:courseId`}
          exact
        />
        <Route
          component={CreateQuizOfCourse}
          path={`${path}/course/detail/quiz/create/:courseId`}
          exact
        />
        <Route
          component={CreateTopicOfCourse}
          path={`${path}/course/detail/topic/create/:courseId`}
          exact
        />

        <Route
          component={TeacherCourseChapterDetail}
          path={`${path}/teacher/course/chapter/detail/:chapterId`}
          exact
        />
        <Route
          component={TeacherCourseQuizDetail}
          path={`${path}/teacher/course/quiz/detail/:questionId/:courseId`}
          exact
        />
        <Route
          component={TeacherCourseTopicDetail}
          path={`${path}/teacher/course/topic/detail/:quizCourseTopicId/:courseId`}
          exact
        />

        <Route
          component={TeacherViewCourseQuizDetail}
          path={`${path}/teacher/course/quiz/view/detail/:questionId/:courseId`}
          exact
        />

        <Route
          component={StudentCourseChapterDetail}
          path={`${path}/student/course/chapter/detail/:chapterId`}
          exact
        />

        <Route
          component={CreateChapterMaterialOfCourse}
          path={`${path}/course/detail/chapter/material/create/:chapterId`}
          exact
        />
        <Route
          component={CreateQuizChoiceAnswerOfCourse}
          path={`${path}/course/detail/quiz/choiceanswer/create/:questionId/:courseId`}
          exact
        />
        <Route
          component={TeacherCourseQuizChoiceAnswerDetail}
          path={`${path}/teacher/course/quiz/choiceanswer/detail/:choiceAnswerId`}
          exact
        />
        <Route
          component={TeacherCourseChapterMaterialDetail}
          path={`${path}/teacher/course/chapter/material/detail/:chapterMaterialId`}
          exact
        />

        <Route
          component={TeacherViewLearningSessionDetail}
          path={`${path}/teacher/class/session/detail/:sessionId`}
          exact
        />
        <Route
          component={ResourceDomainList}
          path={`${path}/teach/resource-links/list`}
        />
        <Route
          component={ResourceDomainCreate}
          path={`${path}/domain/create`}
        />
        <Route
          component={ResourceCreate}
          path={`${path}/domains/:id/resource`}
        />
        <Route
          component={ResourceDomainEdit}
          path={`${path}/domains/:id/edit`}
        />
        <Route
          component={ResourceList}
          path={`${path}/domains/:id/resources`}
        />

        <Route
          component={PlanDetail}
          path={`${path}/teaching-assignment/plan/:planId/`}
        />

        <Route
          component={ClassTeacherAssignmentPlanList}
          path={`${path}/teaching-assignment/plan`}
        />

        <Route component={ClassCreate} path={`${path}/class/add`} />

        <Route
          component={StudentCourseChapterMaterialDetail}
          path={`${path}/student/course/chapter/material/detail/:chapterMaterialId`}
          exact
        />

        <Route
          component={CourseList}
          path={`${path}/teaching-assignment/courses`}
        />

        <Route component={CourseDetail} path={`${path}/course/detail`} />

        <Route component={AddNewCourse} path={`${path}/course/create`} />

        {/* <Route component={TeacherList} path={`${path}/teachers/list`} /> */}

        <Route component={TeacherDetail} path={`${path}/teacher/detail`} />

        <Route component={AddTeacher} path={`${path}/teacher/create`} />

        {/* <Route component={ClassesList} path={`${path}/classes-list`} /> */}

        <Route component={AssignmentList} path={`${path}/assignment`} />

        {/* <Route component={CreateSemester} path={`${path}/semester`} /> */}

        <Route component={ClassCreate} path={`${path}/class/add`} />

        {/**
         * route for quiz test
         */}
        {/* Quiztest-001 */}
        <Route component={QuizTestList} path={`${path}/class/quiztest/list`} />
        {/* Quiztest-002 */}
        <Route
          component={QuizTestDetail}
          path={`${path}/class/quiztest/detail/:id`}
          exact
        />
        <Route
          component={TeacherViewQuestionsOfParticipant}
          path={`${path}/class/quiztest/teacher-view-questions-of-participant/:participantid/:quiztestgroupid/:testid`}
          exact
        />

        <Route
          component={QuizTestEdit}
          path={`${path}/class/quiztest/edit/:id`}
          exact
        />
        <Route
          component={CreateQuizTest}
          path={`${path}/class/quiztest/create-quiz-test`}
        />
        <Route
          component={StudentQuizList}
          path={`${path}/class/student/quiztest/list`}
        />
        <Route
          component={StudentQuizDetail}
          path={`${path}/class/student/quiztest/detail`}
        />

        {/* Class management. */}
        <Route
          component={ClassRegistration}
          path={`${path}/class/register`}
          exact
        />

        <Route
          component={SClassList}
          path={`${path}/student/class/list`}
          exact
        />

        <Route
          component={SAssignmentDetail}
          path={`${path}/student/class/:classId/assignment/:assignmentId`}
          exact
        />

        <Route
          component={SClassDetail}
          path={`${path}/student/class/:id`}
          exact
        />
        <Route
          component={StudentViewLearningSessionDetail}
          path={`${path}/student/class/session/detail/:sessionId`}
          exact
        />
        <Route
          component={MainBoard}
          path={`${path}/student/class/session/detail/:sessionId/whiteboard/:whiteboardId`}
          exact
        />

        <Route
          component={TClassList}
          path={`${path}/teacher/class/list`}
          exact
        />

        <Route
          component={TeacherViewDetailClass}
          path={`${path}/teacher/class/detail/:classId`}
          exact
        />
        <Route
          component={MainBoard}
          path={`${path}/teacher/class/session/detail/:sessionId/whiteboard/:whiteboardId`}
          exact
        />

        <Route
          component={CreateAssignment}
          path={`${path}/teacher/class/:classId/assignment/create`}
          exact
        />

        <Route
          component={CreateAssignment}
          path={`${path}/teacher/class/:classId/assignment/:assignmentId/edit`}
          exact
        />

        <Route
          component={TAssignmentDetail}
          path={`${path}/teacher/class/:classId/assignment/:assignmentId`}
          exact
        />

        <Route
          component={TClassDetail}
          path={`${path}/teacher/class/:id`}
          exact
        />

        <Route
          component={StudentCreateThesis}
          path={`${path}/student/thesis/create`}
          exact
        />

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
