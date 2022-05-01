import { AiOutlineDoubleRight } from 'react-icons/ai';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { BAR_TYPE } from '../../../ultis/constant';
import { Autocomplete, TextField } from '@mui/material';
import { useGetListSearchFriend, useInviteFriend } from '../../../hooks/meet';


const Participant = ({ meetId, display, setDisplay, listParticipant }) => {
  const initialParams = {
    searchString: '',
    roomId: meetId
  }
  const [searchText, setSearchText] = useState('');
  const [invitedFriend, setInvitedFriend] = useState('');
  const [params, setParams] = useState(initialParams);
  const inviteFriendQuery = useInviteFriend({ userId: searchText, meetId });
  const { data: dataSearch } = useGetListSearchFriend({ params });
  useEffect(() => {
    if (invitedFriend) {
      inviteFriendQuery.mutate();
    }
  }, [invitedFriend]);

  const onInputChange = (event, newInputValue) => {
    setSearchText(newInputValue);
    setParams({ ...params, searchString: newInputValue });
  }
  const inviteFriend = (event, value) => {
    setInvitedFriend(value);
    // setSearchText('');
  }
  const closeBar = () => {
    setDisplay(BAR_TYPE.NONE);
  }

  const renderListParticipant = useCallback(() => {
    return listParticipant.map((participant, index) => (
      <div className='participant-item' key={index}>
        <div className='avatar'>
          {participant.name[0].toUpperCase()}
        </div>
        <div className='participant-name'>
          {participant.name}
        </div>
      </div>
    ));
  }, [listParticipant]);

  return (
    <div className={classNames('room-bar', 'transition', { 'display-bar': display === BAR_TYPE.PARTICIPANT }, { 'hidden-bar': display !== BAR_TYPE.PARTICIPANT })}>
      <div className='close-bar' onClick={closeBar}>
        <AiOutlineDoubleRight />
      </div>
      <div className="title-bar" onClick={closeBar}>
        Participants
      </div>
      <div className='content-bar participant-bar-content'>
        {renderListParticipant()}
      </div>
      <div className='invite-friend'>
        <Autocomplete
          options={dataSearch?.content || []}
          isOptionEqualToValue={() => true}
          value={searchText}
          onChange={inviteFriend}
          onInputChange={onInputChange}
          renderInput={(params) => (
            <TextField {...params} label="Invite Friend" variant="standard" />
          )}
        />
      </div>
    </div>
  );
}

export default Participant;