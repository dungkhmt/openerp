import {Box, LinearProgress} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import XLSX from "xlsx";
import {request} from "./Request";
import HustContainerCard from "../../common/HustContainerCard";
import StandardTable from "../../table/StandardTable";

export default function ContestManagerRankingNew(props) {
  const contestId = props.contestId;
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getPointForRankingType, setGetPointForRankingType] =
    useState("HIGHEST");

  const downloadHandler = (event) => {
    if (ranking.length === 0) {
      return;
    }

    var wbcols = [];

    wbcols.push({wpx: 80});
    wbcols.push({wpx: 120});
    let numOfProblem = ranking[0].mapProblemsToPoints.length;
    for (let i = 0; i < numOfProblem; i++) {
      wbcols.push({wpx: 50});
    }
    wbcols.push({wpx: 50});

    let datas = [];

    for (let i = 0; i < ranking.length; i++) {
      let data = {};
      data["Username"] = ranking[i].userId;
      data["Fullname"] = ranking[i].fullname;
      for (let j = 0; j < numOfProblem; j++) {
        const problem = ranking[i].mapProblemsToPoints[j].problemId;
        const problemPoint = ranking[i].mapProblemsToPoints[j].point;
        data[problem] = problemPoint;
      }
      data["TOTAL"] = ranking[i].totalPoint;

      datas[i] = data;
    }

    var sheet = XLSX.utils.json_to_sheet(datas);
    var wb = XLSX.utils.book_new();
    sheet["!cols"] = wbcols;

    XLSX.utils.book_append_sheet(wb, sheet, "ranking");
    XLSX.writeFile(
      wb,
      contestId + "-RANKING-" + getPointForRankingType + ".xlsx"
    );
  };


  function getRanking() {
    setLoading(true);
    request(
      "get",
      "/get-ranking-contest-new/" +
      contestId +
      "?getPointForRankingType=" +
      getPointForRankingType,
      (res) => {
        setRanking(res.data.sort((a, b) => b.totalPoint - a.totalPoint));
      }
    ).then(() => setLoading(false));
  }

  const generateColumns = () => {
    const columns = [
      {title: "Username", field: "userId"},
      {
        title: "Fullname", render: (rankingRecord) => (
          <span>
            <em>{`${rankingRecord.fullname}`}</em>
          </span>
        )
      },
      {
        title: "TOTAL", render: (rankingRecord) => (
          <span style={{fontWeight: 600, color: "#2e7d32"}}>
            {`${rankingRecord.totalPoint}`}
          </span>
        )
      }
    ];

    ranking.length > 0 && ranking[0].mapProblemsToPoints.forEach((problem, i) => {
      columns.push({
        title: problem.problemId,
        render: (rankingRecord) => (
          <span style={{color: "#2e7d32"}}>
            {`${rankingRecord.mapProblemsToPoints[i].point}`}
          </span>
        )
      });
    });

    return columns;
  }

  useEffect(() => {
    getRanking();
  }, []);

  useEffect(() => {
    getRanking();
  }, [getPointForRankingType]);

  return (
    <HustContainerCard title={"Contest Ranking"}>
      <Box
        sx={{
          width: "100%",
          marginBottom: "20px",
          paddingLeft: "4px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">
          {getPointForRankingType} Submission
        </Typography>
        <Box>
          {getPointForRankingType === "HIGHEST" ? (
            <Button
              variant="contained"
              onClick={() => setGetPointForRankingType("LATEST")}
            >
              Switch to Latest Submission Score
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setGetPointForRankingType("HIGHEST")}
            >
              Switch to Highest Submission Score
            </Button>
          )}
          <Button variant="contained" onClick={downloadHandler} color="success" sx={{marginLeft: "12px"}}>
            Export
          </Button>
        </Box>

      </Box>

      <Box>
        {loading && <LinearProgress/>}
        <StandardTable
          // title={"Contest Ranking"}
          columns={generateColumns()}
          data={ranking}
          hideCommandBar
          options={{
            selection: false,
            pageSize: 10,
            search: true,
            sorting: true,
          }}
        />
      </Box>
    </HustContainerCard>
  );
}
