import {
  AiOutlineAudio,
  AiOutlineAudioMuted
} from 'react-icons/ai';

export default function Micro(props) {
  if (props.micro) {
    return (
      <AiOutlineAudio />
    )
  }
  return (
    <AiOutlineAudioMuted />
  );
}
