import { useState } from "react";
import { ADMIN_CHAT_TYPE } from "../../../utils/constant";
import { handleTime } from "../../../utils/helpers";

const AdminChat = ({ data }) => {
  const userId = localStorage.getItem("userId");
  const content = JSON.parse(data.content);
  const [title, setTitle] = useState();
  return (
    <div
      className="admin-chat"
      title={title}
      onMouseEnter={() => setTitle(handleTime(Number(data.time)))}
    >
      {content.id === userId &&
        ADMIN_CHAT_TYPE.JOIN === content.type &&
        `Chào mừng bạn đã tham gia vào cuộc gặp`}
      {content.id !== userId &&
        ADMIN_CHAT_TYPE.JOIN === content.type &&
        `${content.name} đã tham gia vào cuộc gặp `}
      {ADMIN_CHAT_TYPE.LEAVE === content.type &&
        `${content.name} đã rời khỏi cuộc gặp`}
    </div>
  );
};

export default AdminChat;
