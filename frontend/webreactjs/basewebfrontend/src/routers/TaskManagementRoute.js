import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateProject from "../component/taskmanagement/projects/CreateProject";
import ListProject from "../component/taskmanagement/projects/ListProject";
import CreateTask from "../component/taskmanagement/task/CreateTasks";
import EditTask from "../component/taskmanagement/task/EditTask";
import AddUserToProject from "../component/taskmanagement/projects/AddUserToProject";
import ListTasks from "../component/taskmanagement/task/ListTasks";
import ListAssignedTasks from "component/taskmanagement/assignedtasks/ListAssignedTasks";
import ShowTask from "component/taskmanagement/task/ShowTask";

export default function TaskManagementRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateProject}
          exacts
          path={`${path}/project/type/:type/:projectId?`}
        ></Route>
        <Route
          component={ListProject}
          exact
          path={`${path}/project/list`}
        ></Route>
        <Route
          component={CreateTask}
          exact
          path={`${path}/project/tasks/create/:projectIdUrl?`}
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
        <Route
          component={ShowTask}
          exact
          path={`${path}/tasks/:taskId`}
        ></Route><Route
        component={EditTask}
        exact
        path={`${path}/tasks/:taskId/edit`}
      ></Route>
      </Switch>
    </div>
  );
}
