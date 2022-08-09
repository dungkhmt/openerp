import { Backdrop, Box, Fade, Grid, Modal, TextField } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import PrimaryButton from "component/button/PrimaryButton";
import { useEffect, useState } from "react";
import { styleModal } from "component/chat/ChatVoiceMain/utils/constant";
import TertiaryButton from "component/button/TertiaryButton";

export default function ModalUpdateMeet({
  visible,
  onClose,
  updateMeet,
  openIn: openTimeString,
  closeIn: closeTimeString,
  name: meetName,
  meetId,
}) {
  const [openIn, setOpenIn] = useState(null);
  const [closeIn, setCloseIn] = useState(null);
  const [name, setName] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const now = new Date();
    const openTime = new Date(openTimeString);
    const closeTime = new Date(closeTimeString);
    setOpenIn(openTime <= now ? null : openTime);
    setCloseIn(closeTime <= now ? null : closeTime);
    setName(meetName);
  }, [openTimeString, closeTimeString, meetName]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeOpenIn = (newValue) => {
    setOpenIn(newValue);
  };
  const handleChangeCloseIn = (newValue) => {
    setCloseIn(newValue);
  };
  const update = async () => {
    const trimName = name.trim();
    setName(trimName);
    if (!trimName) {
      setErrorText("Bạn chưa nhập tên cuộc gặp!");
      return;
    }
    if (!openIn) {
      setErrorText("Bạn chưa chọn thời điểm bắt đầu cuộc gặp!");
      return;
    }
    if (!closeIn) {
      setErrorText("Bạn chưa chọn thời điểm kết thúc cuộc gặp!");
      return;
    }
    setErrorText("");
    await updateMeet({ roomName: name, openIn, closeIn, id: meetId });
    setName("");
    setOpenIn(null);
    setCloseIn(null);
  };
  const yesterday = (day) => {
    if (!day) return day;
    const res = new Date(day);
    res.setDate(res.getDate() - 1);
    return res;
  };

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
      <Fade in={visible}>
        <Box sx={styleModal} className="host-modal">
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>
            Cập nhật thông tin cuộc gặp
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item xs={6}>
                  <TextField
                    label="Tên*"
                    variant="standard"
                    value={name}
                    onChange={handleChangeName}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                <DateTimePicker
                  label="Bắt đầu lúc*"
                  value={openIn}
                  onChange={handleChangeOpenIn}
                  fullWidth={true}
                  disablePast={true}
                  shouldDisableDate={(date) =>
                    closeIn ? date > yesterday(closeIn) : false
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                <DateTimePicker
                  label="Kết thúc lúc*"
                  value={closeIn}
                  onChange={handleChangeCloseIn}
                  fullWidth={true}
                  disablePast={true}
                  shouldDisableDate={(date) =>
                    openIn ? date < yesterday(openIn) : false
                  }
                />
              </Grid>
              {errorText && (
                <Grid item xs={12} className="meet__color-red">
                  {errorText}
                </Grid>
              )}
              <Grid container spacing={2} style={{ marginTop: 12 }}>
                <Grid item xs={6}>
                  <TertiaryButton onClick={onClose}>Đóng</TertiaryButton>
                </Grid>
                <Grid item xs={6}>
                  <PrimaryButton onClick={update}>Cập nhật</PrimaryButton>
                </Grid>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
      </Fade>
    </Modal>
  );
}
