import { useState } from "react";
import { useHistory } from "react-router";
import MicroIcon from "../../../icon/Micro";
import CameraIcon from "../../../icon/Camera";
import ChatIcon from "../../../icon/Chat";
import EndIcon from "../../../icon/End";
import ParticipantIcon from "../../../icon/Participant";
import ShareScreenIcon from "../../../icon/ShareScreen";
import ShareMeetIcon from "../../../icon/ShareMeet";
import CopyIcon from "../../../icon/Copy";
import { BAR_TYPE, MEDIA_TYPE, styleModal } from "../../../utils/constant";
import { getDisplayMedia, getUserMedia } from "../../../utils/helpers";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";

const FooterControl = (props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickChat = () => {
    props.setDisplayBar(
      props.displayBar === BAR_TYPE.CHAT ? BAR_TYPE.NONE : BAR_TYPE.CHAT
    );
  };

  const handleClickParticipant = () => {
    props.setDisplayBar(
      props.displayBar === BAR_TYPE.PARTICIPANT
        ? BAR_TYPE.NONE
        : BAR_TYPE.PARTICIPANT
    );
  };
  const copyMeetCode = () => {
    navigator.clipboard.writeText(props.meetId);
    setTimeout(() => {
      handleClose();
    }, 200);
  };

  return (
    <div className="footer-control">
      <div id="footer-control-1">
        <div
          className="element-bottom"
          onClick={props.handleClickMicro}
          title="Micro"
        >
          <MicroIcon micro={props.micro} />
        </div>
        <div
          className="element-bottom"
          onClick={props.handleClickCamera}
          title="Camera"
        >
          <CameraIcon camera={props.camera} />
        </div>
      </div>
      <div id="footer-control-2">
        <div
          className="element-bottom"
          onClick={props.handleClickShareScreen}
          title="Share Screen"
        >
          <ShareScreenIcon />
        </div>
        <div className="element-bottom" onClick={handleClickChat} title="Chat">
          <ChatIcon />
        </div>
        <div
          className="element-bottom"
          onClick={handleClickParticipant}
          title="Participant"
        >
          <ParticipantIcon />
        </div>
        <div className="element-bottom" onClick={handleOpen} title="Share Meet">
          <ShareMeetIcon />
        </div>
      </div>
      <div id="end-room" onClick={props.leaveMeet}>
        <EndIcon />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={styleModal}>
            <Typography
              id="transition-modal-title"
              className="meet-code-label"
              variant="h6"
              component="h2"
            >
              Meet's code
            </Typography>
            <TextField
              id="standard-read-only-input"
              defaultValue={props.meetId || ""}
              variant="standard"
              className="meet-code-input"
              InputProps={{
                readOnly: true,
              }}
            />
            <CopyIcon className="copy-meet-code" onClick={copyMeetCode} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default FooterControl;
