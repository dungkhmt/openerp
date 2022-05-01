import { Paper } from "@mui/material";
import { format } from "date-fns";
import { useHistory } from "react-router";

export default function MeetCard({ meetId, name, openIn, closeIn }) {
  const history = useHistory();
  const handleClickMeetCard = () => {
    history.push({
      pathname: `main/${meetId}`
    });
  }
  const formatDate = (date) => {
    return date ? format(new Date(date), 'Pp') : 'N/A'
  }

  return (
    <div onClick={handleClickMeetCard}>
      <Paper className="meet-card-content">
        <div className="meet-card-content__name">{name}</div>
        <div>
          <span>Open In: {formatDate(openIn)}</span>
          <span className="meet-card-content__close-in">Close In: {formatDate(closeIn)}</span>
        </div>
      </Paper>
    </div>
  );
}