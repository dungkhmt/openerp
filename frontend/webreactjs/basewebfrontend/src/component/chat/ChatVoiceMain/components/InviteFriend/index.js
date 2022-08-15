import { Snackbar } from "@material-ui/core";
import { Alert, Autocomplete, TextField } from "@mui/material";
import PrimaryButton from "component/button/PrimaryButton";
import { useState } from "react";
import { useGetListSearchFriend, useInviteFriend } from "../../hooks/meet";

const SEVERITY_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
};

export default function InviteFriend({ meetId }) {
  const initialParams = {
    searchString: "",
    roomId: meetId,
  };
  const [displayMessage, setDisplayMessage] = useState(false);
  const [severity, setSeverity] = useState();
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(initialParams);

  const onSuccess = () => {
    setSeverity(SEVERITY_TYPE.SUCCESS);
    setDisplayMessage(true);
    setSearchText("");
  };
  const onError = () => {
    setSeverity(SEVERITY_TYPE.ERROR);
    setDisplayMessage(true);
  };
  const inviteFriendQuery = useInviteFriend({ meetId, onSuccess, onError });
  const { data: dataSearch } = useGetListSearchFriend({ params });

  const onInputChange = (event, newInputValue) => {
    setSearchText(newInputValue);
    setParams({ ...params, searchString: newInputValue });
  };
  const handleInvite = (e) => {
    if (e.key === "Enter") {
      inviteFriendQuery.mutateAsync({ userId: searchText });
    }
  };
  const handleClick = () => {
    inviteFriendQuery.mutateAsync({ userId: searchText });
  };
  const handleCloseMessage = () => {
    setDisplayMessage(false);
  };

  return (
    <div className="invite-friend">
      <Autocomplete
        options={dataSearch?.content || []}
        isOptionEqualToValue={() => true}
        value={searchText}
        onInputChange={onInputChange}
        renderInput={(params) => (
          <TextField {...params} label="Mời bạn" variant="standard" />
        )}
        onKeyDown={handleInvite}
        freeSolo
      />
      <PrimaryButton className="invite-button" onClick={handleClick}>
        Mời
      </PrimaryButton>
      <Snackbar
        open={displayMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        className="invite-friend__snackbar"
      >
        <Alert
          onClose={handleCloseMessage}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {severity === SEVERITY_TYPE.SUCCESS
            ? `Bạn đã mời ${searchText} thành công`
            : "Đã có lỗi xảy ra, vui lòng thử lại"}
        </Alert>
      </Snackbar>
    </div>
  );
}
