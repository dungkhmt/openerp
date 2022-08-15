import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MeetCard from "../MeetCard";

export default function ListMeet({ title, listMeet, onClickMeet }) {
  const renderListCard = () => {
    return listMeet.map((meet, index) => (
      <MeetCard
        key={index}
        meetId={meet?.id}
        name={meet?.roomName}
        openIn={meet?.openIn}
        closeIn={meet?.closeIn}
        onClick={onClickMeet}
      />
    ));
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1} style={{ width: "100%" }}>
          {renderListCard()}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
