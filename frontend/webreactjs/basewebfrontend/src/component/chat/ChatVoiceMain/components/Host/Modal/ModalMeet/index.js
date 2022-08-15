import { Backdrop, Fade, Modal } from "@material-ui/core";

export default function ModalMeet({ visible, onClose, children }) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={visible}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableRestoreFocus={true}
    >
      <Fade in={visible}>{children}</Fade>
    </Modal>
  );
}
