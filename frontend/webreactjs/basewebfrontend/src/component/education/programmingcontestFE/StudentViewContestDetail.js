import * as React from "react";
import {useEffect, useState} from "react";
import {request} from "./Request";
import {useHistory, useParams} from "react-router-dom";
import StudentViewProblemList from "./StudentViewProblemList";
import StudentViewSubmission from "./StudentViewSubmission";

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
      <StudentViewProblemList problems={problems} contestId={contestId} />
      <StudentViewSubmission />
    </div>
  );
}
