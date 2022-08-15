import {
  Backdrop,
  Box,
  Fade,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";
import PrimaryButton from "../../../../button/PrimaryButton";
import {
  useGetInvitedMeets,
  useGetPresentMeets,
} from "../../hooks/chatVoiceHome";
import { ENTER_KEY, styleModal } from "../../utils/constant";
import ListMeet from "../ListMeet";

const Join = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const { data } = useGetInvitedMeets({ params: null });
  const { data: presentMeets } = useGetPresentMeets({ params: null });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChangeInputCode = (e) => {
    setInputCode(e.target.value);
  };
  const joinMeet = async (e) => {
    if (e.key === ENTER_KEY) {
      try {
        history.push("/chat/voice/main/" + inputCode);
      } catch (e) {
        console.error(e);
      }
    }
  };
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <ListMeet
            title="Danh sách cuộc gặp mà bạn được mời"
            listMeet={data?.content || []}
          />
          <ListMeet
            title="Cuộc gặp đang diễn ra"
            listMeet={presentMeets?.content || []}
          />
          <PrimaryButton onClick={handleOpen} id="button-meet-now">
            Tham gia một cuộc gặp khác
          </PrimaryButton>
        </Grid>
      </Grid>
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
              Please type meet's code here
            </Typography>
            <TextField
              id="filled-search"
              label="Meet's Code"
              type="search"
              variant="filled"
              className="meet-code-input"
              value={inputCode}
              onChange={handleChangeInputCode}
              onKeyDown={joinMeet}
              autoFocus={true}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Join;
