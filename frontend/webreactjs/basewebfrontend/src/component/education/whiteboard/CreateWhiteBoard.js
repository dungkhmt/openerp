import React from "react";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";
import { nanoid } from 'nanoid'

export default function CreateWhiteBoard() {
  const history = useHistory();

  const whiteboardId = nanoid();
  const onCreateNewWhiteboard = async () => {
    // create new whiteboard
    await request("post", "/whiteboards", () => {
      history.push(`/whiteboard/board/${whiteboardId}`)
    }, {}, { whiteboardId });
  }

  return <div>
    <button type="button" onClick={onCreateNewWhiteboard}>Create a new board</button>
  </div>;
}
