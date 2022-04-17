import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
export default function ListMeet() {

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography>Danh sách cuộc họp của bạn</Typography>
      </AccordionSummary>
      <AccordionDetails>Danh sach o day</AccordionDetails>
    </Accordion>
  );
}