import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import ContestManagerViewSubmissionOfAUser from "./ContestManagerViewSubmissionOfAUser";
export default function ContestManagerViewSubmissionOfAUserDialog(props) {
  const { contestId, userId, open, onClose } = props;
  function handleClick() {
    //alert("userId = " + userId + " contestId = " + contestId);
    onClose();
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submissions</DialogTitle>
      <DialogContent>
        <ContestManagerViewSubmissionOfAUser
          contestId={contestId}
          userId={userId}
        />
        <Button onClick={handleClick}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
