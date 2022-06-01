import { Paper } from "@mui/material";
import { format } from "date-fns";
import { useHistory } from "react-router";

export default function MeetCard({ meetId, name, openIn, closeIn, onClick }) {
  const history = useHistory();
  const handleClickMeetCard = () => {
    if (!onClick) {
      history.push({
        pathname: `/chat/voice/main/${meetId}`,
      });
    } else {
      onClick({ meetId, name, openIn, closeIn });
    }
  };
  const formatDate = (date) => {
    return date ? format(new Date(date), "Pp") : "N/A";
  };

  return (
    <div onClick={handleClickMeetCard}>
      <Paper className="meet-card-content">
        <div className="meet-card-content__name">{name}</div>
        <div>
          <span>Bắt đầu lúc: {formatDate(openIn)}</span>
          <span className="meet-card-content__close-in">
            Kết thúc lúc: {formatDate(closeIn)}
          </span>
        </div>
      </Paper>
    </div>
  );
}
