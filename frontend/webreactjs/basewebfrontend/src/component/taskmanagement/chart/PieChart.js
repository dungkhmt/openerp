import { Pie } from "react-chartjs-2";
import React, { useState } from "react";

function PieChart({labels, datasets}) {
  return (
    <Pie
      options={{
        width: "400",
        height: "400"
      }}
      data={{
        labels: labels,
        datasets: datasets
      }}
    />
  );
}

export default PieChart;
