import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import LearningSessionStudentViewQuizTestList from "./LearningSessionStudentViewQuizTestList";
import { request } from "../../../../api";

export default function StudentViewLearningSessionDetail() {
  const params = useParams();
  const sessionId = params.sessionId;
  const [sessionDetail, setSessionDetail] = useState(null);
  function getSessionDetail() {
    request(
      // token,
      // history,
      "get",
      "/edu/class/get-session-detail/" + sessionId,
      (res) => {
        setSessionDetail(res.data);
        console.log("get session, res = ", res.data);
      }
    );
  }

  useEffect(() => {
    //getQuestionList();
    getSessionDetail();
  }, []);

  return (
    <div>
      <h1>{sessionDetail ? sessionDetail.sessionName : ""}</h1>
      <LearningSessionStudentViewQuizTestList sessionId={sessionId} />
    </div>
  );
}
