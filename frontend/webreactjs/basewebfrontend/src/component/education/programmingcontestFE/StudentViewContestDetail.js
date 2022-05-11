import Box from "@mui/material/Box";
import * as React from "react";
import StudentViewProblemList from "./StudentViewProblemList";
import StudentViewSubmission from "./StudentViewSubmission";

export default function StudentViewContestDetail() {
  return (
    <div>
      <StudentViewProblemList />
      <Box height="30px" />
      <StudentViewSubmission />
    </div>
  );
}
