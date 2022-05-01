import ScheduleMeet from './ScheduleMeet';
import ButtonMeetNow from './ButtonMeetNow';
import ListMeet from '../ListMeet';
import { useGetOwnedMeets } from '../../hooks/chatVoiceHome';

export default function Host() {
  const { data } = useGetOwnedMeets({ params: null });
  const listMeet = data?.content.map(meet => ({
    id: meet[0],
    roomName: meet[1],
    openIn: meet[2],
    closeIn: meet[3],
  }))
  return (
    <>
      <ScheduleMeet />
      <ListMeet title='Danh sách cuộc họp của bạn' listMeet={listMeet || []} />
      <ButtonMeetNow />
    </>
  );
}