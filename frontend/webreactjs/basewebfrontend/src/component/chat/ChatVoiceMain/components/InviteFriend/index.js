import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetListSearchFriend, useInviteFriend } from '../../hooks/meet';

export default function InviteFriend({ meetId }) {
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
  return (
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
  )
}