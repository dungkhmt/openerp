import { useHistory } from 'react-router';
import MicroIcon from '../../../icon/Micro';
import CameraIcon from '../../../icon/Camera';
import ChatIcon from '../../../icon/Chat';
import EndIcon from '../../../icon/End';
import ParticipantIcon from '../../../icon/Participant';
import ShareScreenIcon from '../../../icon/ShareScreen';
import ShareMeetIcon from '../../../icon/ShareMeet';
import CopyIcon from '../../../icon/Copy';
import { BAR_TYPE, MEDIA_TYPE, styleModal } from '../../../ultis/constant';
import { getDisplayMedia, getUserMedia } from '../../../ultis/helpers';
import { Backdrop, Box, Fade, Modal, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';

const FooterControl = (props) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const stopMedia = (type) => {
    if (props.mediaStream) {
      props.setMediaStream(mediaStream => {
        mediaStream.getTracks().forEach(track => {
          if (track.kind === type) {
            mediaStream.removeTrack(track);
            track.stop();
          }
        });
        return mediaStream;
      });
    }
  }
  const handleClickMicro = async () => {
    try {
      props.setMicro(!props.micro);
      if (!props.micro) {
        const srcMicro = await getUserMedia('micro');
        if (props.mediaStream) {
          props.mediaStream.getTracks().forEach(track => srcMicro.addTrack(track));
        }
        props.setMediaStream(srcMicro);
      } else {
        stopMedia(MEDIA_TYPE.AUDIO);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleClickCamera = async () => {
    try {
      props.setCamera(!props.camera);
      if (!props.camera) {
        const srcCamera = await getUserMedia("camera");
        if (props.mediaStream) {
          props.mediaStream.getTracks().forEach(track => srcCamera.addTrack(track));
        }
        stopMedia(MEDIA_TYPE.VIDEO);
        props.setMediaStream(srcCamera);
      } else {
        stopMedia(MEDIA_TYPE.VIDEO);
      }
    } catch (e) {
      console.error(e);
    }
  }
  const handleClickShareScreen = async () => {
    try {
      props.setCamera(false);
      const srcScreen = await getDisplayMedia();
      stopMedia(MEDIA_TYPE.VIDEO);
      props.setMediaStream(mediaStream => mediaStream ?
        srcScreen.getTracks().forEach(track => mediaStream.addTrack(track)) : srcScreen);
    } catch (e) {
      console.error(e);
    }
  }
  const handleClickChat = () => {
    props.setDisplayBar(props.displayBar === BAR_TYPE.CHAT ? BAR_TYPE.NONE : BAR_TYPE.CHAT);
  }
  const handleClickEnd = () => {
    props.sendMessage('leave');
    props.stompClient.disconnect();
    history.push('/chat/voice/main');
  }
  const handleClickParticipant = () => {
    props.setDisplayBar(props.displayBar === BAR_TYPE.PARTICIPANT ? BAR_TYPE.NONE : BAR_TYPE.PARTICIPANT);
  }
  const copyMeetCode = () => {
    navigator.clipboard.writeText(props.meetId);
    setTimeout(() => {
      handleClose();
    }, 200);
  }

  return (
    <div className='footer-control'>
      <div className='element-bottom' onClick={handleClickMicro} title='Micro'>
        <MicroIcon micro={props.micro} />
      </div>
      <div className='element-bottom' onClick={handleClickCamera} title='Camera'>
        <CameraIcon camera={props.camera} />
      </div>
      <div className='element-bottom share-screen-icon' onClick={handleClickShareScreen} title='Share Screen'>
        <ShareScreenIcon />
      </div>
      <div className='element-bottom' onClick={handleClickChat} title='Chat'>
        <ChatIcon />
      </div>
      <div className='element-bottom' onClick={handleClickParticipant} title='Participant'>
        <ParticipantIcon />
      </div>
      <div className='element-bottom' onClick={handleOpen} title='Share Meet'>
        <ShareMeetIcon />
      </div>
      <div id='end-room' onClick={handleClickEnd}>
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
            <Typography id="transition-modal-title" className="meet-code-label" variant="h6" component="h2">
              Meet's code
            </Typography>
            <TextField
              id="standard-read-only-input"
              defaultValue={props.meetId || ''}
              variant="standard"
              className="meet-code-input"
              InputProps={{
                readOnly: true,
              }}
            />
            <CopyIcon className='copy-meet-code' onClick={copyMeetCode} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default FooterControl;