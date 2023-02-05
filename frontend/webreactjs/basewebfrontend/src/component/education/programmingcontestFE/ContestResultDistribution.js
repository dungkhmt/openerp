import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import {request} from "./Request";
import {Chart} from "react-google-charts";

export default function ContestResultDistribution(props) {
  const contestId = props.contestId;
  const [ranking, setRanking] = useState([]);

  function getRanking() {
    request(
      "get",
      "/get-ranking-contest-new/" +
      contestId +
      "?getPointForRankingType=" +
      "HIGHEST",
      (res) => {
        let arr = res.data.map(obj => [obj.userId, obj.totalPoint]);
        arr.unshift(['User', 'Point']);
        setRanking(arr);
      }
    ).then();
  }

  useEffect(() => {
    getRanking();
  }, []);

  const options = {
    title: 'Score Distribution in Contest',
    legend: {position: 'none'},
    colors: ['#4285F4'],
  };


  return (
    <Box>
      {ranking.length > 0 && <Chart
        chartType="Histogram"
        width="100%"
        height="400px"
        data={ranking}
        options={options}
      />}

    </Box>
  );
}
