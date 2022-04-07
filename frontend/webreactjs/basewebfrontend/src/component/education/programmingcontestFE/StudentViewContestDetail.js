import { useEffect, useState } from "react";
import { request } from "./Request";
import { useHistory, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Button, Grid, Tab, TableHead, Tabs } from "@material-ui/core";
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import { getColorLevel, StyledTableCell, StyledTableRow } from "./lib";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { TabPanelHorizontal } from "./TabPanel";
import { Timer } from "./Timer";
import { ContestProblemComponent } from "./ContestProblemComponent";
import { successNoti } from "../../../utils/notification";
import { WaitScreen } from "./WaitScreen";
import LockScreen from "./LockScreen";
import StudentViewProblemList from "./StudentViewProblemList";

export default function StudentViewContestDetail() {
  const { contestId } = useParams();
  const [value, setValue] = React.useState(0);
  const [contestName, setContestName] = useState();
  const [contestTime, setContestTime] = useState();
  const [problems, setProblems] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const history = useHistory();
  const [wait, setWait] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  function getContestDetail() {
    request(
      "get",
      "/get-contest-detail-solving/" + contestId,
      (res) => {
        console.log("res contest", res);
        setUnauthorized(res.data.unauthorized);
        setContestTime(res.data.contestTime);
        setProblems(res.data.list);
        setContestName(res.data.contestName);
        setIsPublic(res.data.isPublic);
        console.log("res ", res.data);
        let arr = problems.map(() => false);
        setSubmitted(arr);
        for (let i = 0; i < res.data.list.length; i++) {
          let idSource =
            contestId + "-" + res.data.list[i].problemId + "-source";
          let tmpSource = localStorage.getItem(idSource);
          let idLanguage =
            contestId + "-" + res.data.list[i].problemId + "-language";
          let tmpLanguage = localStorage.getItem(idLanguage);
          if (tmpSource == null) {
            localStorage.setItem(idSource, "");
          }
          if (tmpLanguage == null) {
            localStorage.setItem(idLanguage, "CPP");
          }
        }
      },
      {}
    ).then(() => {
      setWait(false);
    });
  }

  useEffect(() => {
    getContestDetail();
  }, []);
  return (
    <div>
      <StudentViewProblemList problems={problems} />
    </div>
  );
}
