import { Accordion, AccordionDetails, AccordionSummary, Alert, Grid, Snackbar, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import PrimaryButton from "../../../../../button/PrimaryButton";
import { useScheduleMeet } from '../../../hooks/chatVoiceHome';

export default function ScheduleMeet({ refetchOwnedMeets }) {
  const now = new Date();
  const [openIn, setOpenIn] = useState(now);
  const [closeIn, setCloseIn] = useState(now);
  const [name, setName] = useState('');
  const [expandedScheduleMeet, setExpandedScheduleMeet] = useState(false);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);
  const [displayFailedMessage, setDisplayFailedMessage] = useState(false);

  const handleChangeOpenIn = (newValue) => {
    setOpenIn(newValue);
  };
  const handleChangeCloseIn = (newValue) => {
    setCloseIn(newValue);
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleCloseMessage = () => {
    setDisplayFailedMessage(false);
    setDisplaySuccessMessage(false);
  };
  const handleSuccessScheduleMeet = () => {
    setName('');
    setDisplaySuccessMessage(true);
    setExpandedScheduleMeet(false);
    refetchOwnedMeets();
  };
  const handleChangeExpandedScheduleMeet = () => {
    setExpandedScheduleMeet(!expandedScheduleMeet);
  };
  const handleFailedScheduleMeet = () => {
    setDisplayFailedMessage(true);
  };
  const scheduleMeetMutation = useScheduleMeet({ params: { roomName: name, openIn, closeIn }, onSuccess: handleSuccessScheduleMeet, onError: handleFailedScheduleMeet });
  const scheduleMeet = () => {
    scheduleMeetMutation.mutate();
  }

  return (
    <>
      <Accordion
        expanded={expandedScheduleMeet}
        onChange={handleChangeExpandedScheduleMeet}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>L??n l???ch m???t cu???c h???p</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item xs={6} >
                  <TextField label='T??n*' variant='standard' value={name} onChange={handleChangeName} fullWidth />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <DateTimePicker label='B???t ?????u l??c*' value={openIn} onChange={handleChangeOpenIn} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <DateTimePicker label='K???t th??c l??c*' value={closeIn} onChange={handleChangeCloseIn} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <PrimaryButton onClick={scheduleMeet} id='schedule-meet-btn'>
                  L??n l???ch
                </PrimaryButton>
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </AccordionDetails>
      </Accordion>
      <Snackbar open={displaySuccessMessage} autoHideDuration={6000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity="success" sx={{ width: '100%' }}>
          L??n l???ch th??nh c??ng!
        </Alert>
      </Snackbar>
      <Snackbar open={displayFailedMessage} autoHideDuration={6000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity="error" sx={{ width: '100%' }}>
          L??n l???ch th???t b???i!
        </Alert>
      </Snackbar>
    </>
  );
}