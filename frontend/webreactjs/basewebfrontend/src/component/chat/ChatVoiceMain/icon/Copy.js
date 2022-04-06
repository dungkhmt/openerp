import { MdOutlineContentCopy } from 'react-icons/md';

export default function CopyIcon({ className, onClick }) {
  return (
    <MdOutlineContentCopy className={className} onClick={onClick} />
  );
}
