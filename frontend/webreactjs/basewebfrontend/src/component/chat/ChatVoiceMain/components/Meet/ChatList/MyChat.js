import { useState } from "react";
import { handleTime } from '../../../ultis/helpers';

const MyChat = ({ data }) => {
  const [title, setTitle] = useState();
  const handleChangeTime = () => {
    setTitle(handleTime(Number(data.time)));
  }  
  return (
    <div>
      <div className='my-chat' title={title} onMouseEnter={handleChangeTime}>
        <div className='chat-box my-chat-box'>{data.content}</div>
      </div>     
      <div className='my-chat' title={title} onMouseEnter={handleChangeTime}>
        <div className='chat-box my-chat-box-hidden'>{data.content}</div>
      </div>
    </div>
  );
}

export default MyChat;