import { useEffect, useMemo, useRef } from "react";
import classNames from 'classnames';
import { displayHostMedia } from "../../../ultis/helpers";
import { BAR_TYPE } from "../../../ultis/constant";

const Main = ({ mediaStream, listParticipant, display, myId }) => {
  const hostRef = useRef();
  const otherPeopleRef = useRef();
  const listParticipantMedia = useMemo(() => listParticipant.filter(participant => !!participant?.mediaStream && participant.id !== myId));
  const renderParticipantMedia = (listParticipantMedia) => {
    return listParticipantMedia.map(() => (
      <video key={listParticipantMedia.id} autoPlay className='other-video' />
    ));
  }

  useEffect(() => {
    if (mediaStream) {
      hostRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  useEffect(() => {
    listParticipantMedia.map((participantMedia, index) => {
      otherPeopleRef.current.children[index].srcObject = participantMedia.mediaStream;
    });
  }, [listParticipantMedia])

  return (
    <div className={classNames('main-room', 'transition', { 'mini-main': display === BAR_TYPE.CHAT || display === BAR_TYPE.PARTICIPANT }, { 'full-main': display === BAR_TYPE.NONE })}>
      <video className={`host-video-${displayHostMedia(listParticipantMedia)}`} ref={hostRef} autoPlay muted></video>
      <div className={`other-videos other-videos-${listParticipantMedia.length}`} ref={otherPeopleRef}>
        {renderParticipantMedia(listParticipantMedia)}
      </div>
    </div>
  );
}

export default Main;