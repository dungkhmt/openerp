import { useState } from "react";
import { handleTime } from "../../../utils/helpers";

const OthersChat = ({ data }) => {
  const [title, setTitle] = useState();
  const handleChangeTime = () => {
    setTitle(handleTime(Number(data.time)));
  };
  return (
    <div className="other-chat" title={title} onMouseEnter={handleChangeTime}>
      <div className="chat-title">{data.name}</div>
      <div className="chat-box others-chat-box">{data.content}</div>
    </div>
  );
};

export default OthersChat;
