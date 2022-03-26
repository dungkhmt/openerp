import {
  BsFillCameraVideoOffFill,
  BsFillCameraVideoFill
} from 'react-icons/bs';

export default function Camera(props) {
  if (props.camera) {
    return (
      <BsFillCameraVideoFill />
    )
  }
  return (
    <BsFillCameraVideoOffFill />
  );
}
