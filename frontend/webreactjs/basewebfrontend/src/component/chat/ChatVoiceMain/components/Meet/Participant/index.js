import { AiOutlineDoubleRight } from 'react-icons/ai';
import classNames from 'classnames'
import { getRandomStype } from '../../../ultis/helpers';
import { BAR_TYPE } from '../../../ultis/constant';

const Participant = (props) => {
  const renderListParticipant = () => {
    return props.listParticipant.map((participant, index) => (
      <div className='participant-item' key={index}>
        <div className='avatar' style={getRandomStype()}>
          {participant.name[0].toUpperCase()}
        </div>
        <div className='participant-name'>
          {participant.name}
        </div>
    </div>
    ));
  }

  const closeBar = () => {
    props.setDisplay(BAR_TYPE.NONE);
  }

  return (    
    <div className={classNames('room-bar', 'transition', { 'display-bar': props.display === BAR_TYPE.PARTICIPANT }, { 'hidden-bar': props.display !== BAR_TYPE.PARTICIPANT })}>
      <div className='close-bar' onClick={closeBar}>
        <AiOutlineDoubleRight />
      </div>
      <div className="title-bar" onClick={closeBar}>
        Participants
      </div>
      <div className='content-bar participant-bar-content'>
        {renderListParticipant()}
      </div>
    </div>
  );
}

export default Participant;