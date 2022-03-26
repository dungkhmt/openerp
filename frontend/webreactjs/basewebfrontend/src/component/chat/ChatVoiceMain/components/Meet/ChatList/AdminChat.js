import { useState } from "react";
import { ADMIN_CHAT_TYPE } from "../../../ultis/constant";
import { handleTime } from '../../../ultis/helpers';

const AdminChat = ({ data }) => {
  const userId = localStorage.getItem('userId');
  const content = JSON.parse(data.content);
  const [title, setTitle] = useState();
  return (
    <div className='admin-chat' title={title} onMouseEnter={() => setTitle(handleTime(Number(data.time)))}>
      {content.id === userId && ADMIN_CHAT_TYPE.JOIN === content.type  && `Welcome ${content.name} to the chat room`}
      {content.id !== userId &&  ADMIN_CHAT_TYPE.JOIN === content.type && `${content.name} has joined the room`}
      {ADMIN_CHAT_TYPE.LEAVE === content.type && `${content.name} has left the room`}
    </div>
  );
}

export default AdminChat;