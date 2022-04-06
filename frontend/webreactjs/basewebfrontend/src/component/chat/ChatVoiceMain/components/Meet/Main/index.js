import { useRef } from "react";
import classNames from 'classnames';
import { displayHostMedia } from "../../../ultis/helpers";
import { BAR_TYPE } from "../../../ultis/constant";

const Main = (props) => {
  const hostRef = useRef();
  const otherPeopleRef = useRef();
  const listParticipantMedia = props.listParticipant.filter(participant => !!participant.mediaStream && participant.id !== 2);
  const renderParticipantMedia = (listParticipantMedia) => {
    return listParticipantMedia.map(() => (
      <video key={listParticipantMedia.id} autoPlay className='other-video' />
    ));
  }

  return (
    <div className={classNames('main-room', 'transition' ,  { 'mini-main': props.display === BAR_TYPE.CHAT || props.display === BAR_TYPE.PARTICIPANT }, { 'full-main': props.display === BAR_TYPE.NONE })}>
      <video className={`host-video-${displayHostMedia(listParticipantMedia)}`} ref={hostRef} autoPlay muted></video>
      <div className={`other-videos other-videos-${listParticipantMedia.length}`} ref={otherPeopleRef}>
        {renderParticipantMedia(listParticipantMedia)}
      </div>
    </div>
  );
}

export default Main;