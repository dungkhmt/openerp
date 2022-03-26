import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ChatMessengerMain from "../component/chat/ChatMessengerMain";
import ChatVoiceHome from "../component/chat/ChatVoiceMain/pages/ChatVoiceHome";
import Meet from "../component/chat/ChatVoiceMain/pages/Meet";
export default function ChatRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={ChatMessengerMain}
          exact
          path={`${path}/messenger/main`}
        ></Route>
        <Route
          component={ChatVoiceHome}
          exact
          path={`${path}/voice/main`}
        ></Route>
        <Route component={Meet} exact path={`${path}/voice/main/:id`}></Route>
      </Switch>
    </div>
  );
}
