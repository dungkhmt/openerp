import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";

export default function Micro(props) {
  if (props.micro) {
    return <BsFillMicFill />;
  }
  return <BsFillMicMuteFill />;
}
