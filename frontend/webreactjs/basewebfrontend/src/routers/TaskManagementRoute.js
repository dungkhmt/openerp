import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateProject from "../component/taskmanagement/CreateProject";
import ListProject from "../component/taskmanagement/ListProject";
import CreateTask from "../component/taskmanagement/CreateTasks";
import AddUserToProject from "../component/taskmanagement/AddUserToProject";
import ListTasks from "../component/taskmanagement/ListTasks";
import ListAssignedTasks from "component/taskmanagement/assignedtasks/ListAssignedTasks";

export default function TaskManagementRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateProject}
          exacts
          path={`${path}/project/create`}
        ></Route>
        <Route
          component={ListProject}
          exact
          path={`${path}/project/list`}
        ></Route>
        <Route
          component={CreateTask}
          exact
          path={`${path}/project/tasks/create`}
        ></Route>
        <Route
          component={AddUserToProject}
          exact
          path={`${path}/project/members/add`}
        ></Route>
        <Route
          component={ListTasks}
          exact
          path={`${path}/project/:projectId/tasks`}
        ></Route>
        <Route
          component={ListAssignedTasks}
          exact
          path={`${path}/tasks/members/assigned`}
        ></Route>
      </Switch>
    </div>
  );
}
