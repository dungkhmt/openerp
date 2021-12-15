import React from "react";
import { useHistory, useParams } from "react-router";
import LearningSessionStudentViewQuizTestList from "./LearningSessionStudentViewQuizTestList";
export default function StudentViewLearningSessionDetail() {
  const params = useParams();
  const sessionId = params.sessionId;
  return (
    <div>
      <h1>Session detail {sessionId}</h1>
      <LearningSessionStudentViewQuizTestList sessionId={sessionId} />
    </div>
  );
}
