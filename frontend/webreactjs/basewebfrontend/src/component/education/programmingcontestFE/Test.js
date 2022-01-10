import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";
import { ScrollBox } from "react-scroll-box";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import { Markup } from "interweave";
import * as React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { getExtension } from "./lib";

export function Test() {
  return (
    <div>
      {
        <SplitPane split="vertical" allowResize={true}>
          <Pane initialSize="200px">You can use a Pane component</Pane>
          <div>or you can use a plain old div</div>
          <Pane initialSize="70%" minSize="60%">
            Using a Pane allows you to specify any constraints directly
          </Pane>
        </SplitPane>
      }
    </div>
  );
}
