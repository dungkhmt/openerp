import { AiOutlineDoubleRight } from "react-icons/ai";
import classNames from "classnames";
import { useCallback } from "react";
import InviteFriend from "../../InviteFriend";
import { BAR_TYPE } from "../../../utils/constant";

const Participant = ({ meetId, display, setDisplay, listParticipant }) => {
  const closeBar = () => {
    setDisplay(BAR_TYPE.NONE);
  };
  const renderListParticipant = useCallback(() => {
    return listParticipant.map((participant, index) => (
      <div className="participant-item" key={index}>
        <div className="avatar">{participant.name[0].toUpperCase()}</div>
        <div className="participant-name">{participant.name}</div>
      </div>
    ));
  }, [listParticipant]);

  return (
    <div
      className={classNames(
        "room-bar",
        "transition",
        { "display-bar": display === BAR_TYPE.PARTICIPANT },
        { "hidden-bar": display !== BAR_TYPE.PARTICIPANT }
      )}
    >
      <div className="close-bar" onClick={closeBar}>
        <AiOutlineDoubleRight />
      </div>
      <div className="title-bar" onClick={closeBar}>
        Người tham gia
      </div>
      <div className="content-bar participant-bar-content">
        {renderListParticipant()}
      </div>
      <InviteFriend meetId={meetId} />
    </div>
  );
};

export default Participant;
