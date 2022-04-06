import { AiOutlineDoubleRight } from 'react-icons/ai';
import classNames from 'classnames'
import AdminChat from "./AdminChat";
import InputChat from "./InputChat";
import MyChat from "./MyChat";
import OthersChat from "./OthersChat";
import { ADMIN_ID, BAR_TYPE } from "../../../ultis/constant";

const Chat = (props) => {  
  const renderListMsg = () => {
    const userId = localStorage.getItem('userId');
    return props.listMsg.map((msg, index) => {
      const msgId = parseInt(msg.id);
      return (
        <div key={index}>
          {msgId === ADMIN_ID &&  <AdminChat data={msg} />}
          {msgId === userId && <MyChat data={msg} />}
          {msgId !== ADMIN_ID && msg.id !== userId && <OthersChat data={msg} />}
        </div>
      );
    });
  }
  const closeBar = () => {
    props.setDisplay(BAR_TYPE.NONE);
  }
  return (
    <div className={classNames('room-bar', 'transition', { 'display-bar': props.display === BAR_TYPE.CHAT }, { 'hidden-bar': props.display !== BAR_TYPE.CHAT })}>
      <div className='close-bar' onClick={closeBar}>
        <AiOutlineDoubleRight />
      </div> 
      <div className="title-bar">
        Group Chat
      </div>
      <div className='content-bar chat-bar-content'>
        <div className='list-mess'>
          {renderListMsg()}
        </div>
        <div className='input-chat'>
          <InputChat sendMessage={props.sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chat;