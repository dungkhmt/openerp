import { Accordion, AccordionDetails, AccordionSummary, Alert, Grid, Snackbar, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { request } from "../../../../../../api";
import PrimaryButton from "../../../../../button/PrimaryButton";
import { useCallback, useState } from 'react';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";

export default function ScheduleMeet() {
  const now = new Date();
  const [openIn, setOpenIn] = useState(now);
  const [closeIn, setCloseIn] = useState(now);
  const [name, setName] = useState('');
  const [expandedScheduleMeet, setExpandedScheduleMeet] = useState(false);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);
  const [displayFailedMessage, setDisplayFailedMessage] = useState(false);

  const handleChangeOpenIn = useCallback((newValue) => {
    setOpenIn(newValue);
  }, []);
  const handleChangeCloseIn = useCallback((newValue) => {
    setCloseIn(newValue);
  }, []);
  const handleChangeName = useCallback((e) => {
    setName(e.target.value);
  }, []);
  const handleChangeExpandedScheduleMeet = useCallback(() => {
    setExpandedScheduleMeet(!expandedScheduleMeet);
  }, [expandedScheduleMeet])
  const handleCloseSuccessMessage = useCallback(() => {
    setDisplaySuccessMessage(false);
  }, []);
  const handleCloseFailedMessage = useCallback(() => {
    setDisplayFailedMessage(false);
  })
  const handleSuccessScheduleMeet = useCallback(() => {
    setName('');
    setDisplaySuccessMessage(true);
    setExpandedScheduleMeet(false);
  }, []);
  const handleFailedScheduleMeet = useCallback(() => {
    setDisplayFailedMessage(true);
  })
  const scheduleMeet = () => {
    request('post', '/room/create', handleSuccessScheduleMeet, handleFailedScheduleMeet, {
      openIn,
      closeIn,
      roomName: name,
    });
  }
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        expanded={expandedScheduleMeet}
        onChange={handleChangeExpandedScheduleMeet}
      >
        <Typography>Lên lịch một cuộc họp</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid item xs={6} >
                <TextField label='Tên*' variant='standard' value={name} onChange={handleChangeName} fullWidth />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <DateTimePicker label='Bắt đầu lúc*' value={openIn} onChange={handleChangeOpenIn} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <DateTimePicker label='Kết thúc lúc*' value={closeIn} onChange={handleChangeCloseIn} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <PrimaryButton onClick={scheduleMeet} id='schedule-meet-btn'>
                Lên lịch
              </PrimaryButton>
            </Grid>
          </Grid>
          <Snackbar open={displaySuccessMessage} autoHideDuration={6000} onClose={handleCloseSuccessMessage}>
            <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>
              Lên lịch thành công!
            </Alert>
          </Snackbar>
          <Snackbar open={displayFailedMessage} autoHideDuration={6000} onClose={handleCloseFailedMessage}>
            <Alert onClose={handleCloseSuccessMessage} severity="error" sx={{ width: '100%' }}>
              Lên lịch thất bại!
            </Alert>
          </Snackbar>
        </MuiPickersUtilsProvider>
      </AccordionDetails>
    </Accordion>
  );
}