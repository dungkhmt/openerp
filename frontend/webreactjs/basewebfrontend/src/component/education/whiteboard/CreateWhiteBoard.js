import { nanoid } from "nanoid";
import { useHistory } from "react-router-dom";
import { ROLE_STATUS } from "utils/whiteboard/constants";
import { request } from "../../../api";

export default function CreateWhiteBoard() {
  const history = useHistory();

  const whiteboardId = nanoid();
  const onCreateNewWhiteboard = async () => {
    // create new whiteboard
    await request(
      "post",
      "/whiteboards",
      async () => {
        await request(
          "put",
          `/whiteboards/user/${whiteboardId}`,
          (res) => {},
          {},
          { roleId: ROLE_STATUS.WRITE, statusId: ROLE_STATUS.ACCEPTED }
        );
        history.push(`/whiteboard/board/${whiteboardId}`);
      },
      {},
      { whiteboardId }
    );
  };

  return (
    <div>
      <button type="button" onClick={onCreateNewWhiteboard}>
        Create a new board
      </button>
    </div>
  );
}
