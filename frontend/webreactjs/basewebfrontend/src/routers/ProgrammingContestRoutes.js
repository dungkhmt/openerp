import { Route, Switch, useRouteMatch } from "react-router";
import ListProblem from "../component/education/programmingcontestFE/ListProblem";
import CreateProblem from "../component/education/programmingcontestFE/CreateProblem";
import IDE from "../component/education/programmingcontestFE/IDE";
import ProblemDetail from "../component/education/programmingcontestFE/ProblemDetail";
import CreateTestCase from "../component/education/programmingcontestFE/CreateTestCase";
import EditProblem from "../component/education/programmingcontestFE/EditProblem";
import ProblemSubmissionDetail from "../component/education/programmingcontestFE/ProblemSubmissionDetail";
import CreateContest from "../component/education/programmingcontestFE/CreateContest";
import ListContest from "../component/education/programmingcontestFE/ListContest";
import SolvingContest from "../component/education/programmingcontestFE/SolvingContest";
import {StudentContestNotRegistered} from "../component/education/programmingcontestFE/StudentContestNotRegistered";
import {ListContestManager} from "../component/education/programmingcontestFE/ListContestManager";
import {ContestManager} from "../component/education/programmingcontestFE/ContestManager";
import {StudentContestRegistered} from "../component/education/programmingcontestFE/StudentContestRegistered";
import {Test} from "../component/education/programmingcontestFE/Test";
import EditContest from "../component/education/programmingcontestFE/EditContest";
import ListPracticalProblem from "../component/education/programmingcontestFE/ListPracticalProblem";
import EditTestCase from "../component/education/programmingcontestFE/EditTestCase";
import ContestProblemSubmissionDetail from "../component/education/programmingcontestFE/ContestProblemSubmissionDetail";

export default function ProgrammingContestRoutes(){
  let { path } = useRouteMatch();
  return(
    <div>
      <Switch>
        <Route
          component={ListProblem}
          path={`${path}/list-problems`}
        />
        <Route
          component={CreateProblem}
          path={`${path}/create-problem`}
          />
        <Route
          component={EditProblem}
          path={`${path}/edit-problem/:problemId`}/>
        <Route
          component={IDE}
          path={`${path}/ide`}
          />
        <Route
          component={ProblemDetail}
          path={`${path}/problem-detail/:problemId`}
        />
        <Route
          component={CreateTestCase}
          path={`${path}/problem-detail-create-test-case/:problemId`}
          />
        <Route
          component={ProblemSubmissionDetail}
          path={`${path}/problem-submission-detail/:problemSubmissionId`}
        />
        <Route
          component={CreateContest}
          path={`${path}/create-contest`}
          />
        <Route
          component={ListContest}
          path={`${path}/list-contest`}
        />
        <Route
          component={SolvingContest}
          path={`${path}/solving-contest/:contestId`}
        />
        <Route
          component={StudentContestNotRegistered}
          path={`${path}/student-list-contest-not-registered`}
          />
        <Route
          component={StudentContestRegistered}
          path={`${path}/student-list-contest-registered`}
        />
        <Route
          component={ListContestManager}
          path={`${path}/teacher-list-contest-manager`}
          />
        <Route
          component={ContestManager}
          path={`${path}/contest-manager/:contestId`}
          />
        <Route
          component={Test}
          path={`${path}/test/`}
        />
        <Route
          component={EditContest}
          path={`${path}/contest-edit/:contestId`}
        />
        <Route
          component={ListPracticalProblem}
          path={`${path}/student-public-problem`}
          />

        <Route
          component={EditTestCase}
          path={`${path}/edit-testcase/:problemId/:testCaseId`}
        />

        <Route
          component={ContestProblemSubmissionDetail}
          path={`${path}/contest-problem-submission-detail/:problemSubmissionId`}
          />
      </Switch>
    </div>
  )
}