import React, { useState, useEffect } from "react";
import { request } from "../../../api";
import { toFormattedDateTime } from "../../../utils/dateutils";
import MaterialTable, { MTableToolbar } from "material-table";
export default function CodeSimilarityCheck(props) {
  const contestId = props.contestId;
  const [codeSimilarity, setCodeSimilarity] = useState([]);

  const columns = [
    { title: "Source1", field: "source1" },
    { title: "user1", field: "userLoginId1" },
    { title: "Submit Date 1", field: "date1" },
    { title: "Problem 1", field: "problemId1" },
    { title: "Source2", field: "source2" },
    { title: "user2", field: "userLoginId2" },
    { title: "Submit Date 2", field: "date2" },
    { title: "Problem 2", field: "problemId2" },
    { title: "Score", field: "score" },
  ];
  function getCodeChecking() {
    request(
      "get",
      "/check-code-similarity/" + contestId,

      (res) => {
        console.log("getCodeChecking, res = ", res.data);
        let data = res.data.codeSimilarityElementList.map((c) => ({
          ...c,
          date1: toFormattedDateTime(c.submitDate1),
          date2: toFormattedDateTime(c.submitDate2),
        }));
        //setCodeSimilarity(res.data.codeSimilarityElementList);
        setCodeSimilarity(data);
      },
      {}
    );
  }
  useEffect(() => {
    getCodeChecking();
  }, []);
  return (
    <div>
      CodeSimilarityCheck {contestId}
      <MaterialTable columns={columns} data={codeSimilarity}></MaterialTable>
    </div>
  );
}
