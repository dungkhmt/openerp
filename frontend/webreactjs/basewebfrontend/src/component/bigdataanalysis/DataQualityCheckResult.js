import React, { useState, useEffect } from "react";
import { request } from "../../api";
import { errorNoti } from "../../utils/notification";
import { Card, CardContent } from "@material-ui/core";
import StandardTable from "../table/StandardTable";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
//import { defaultDatetimeFormat } from "../../utils/dateutils";
import { toFormattedDateTime } from "../../utils/dateutils";

export default function DataQualityCheckResult() {
  const [rules, setRules] = useState([]);
  const columns = [
    { title: "Entity", field: "entity" },
    { title: "Instance", field: "instance" },
    { title: "RuleID", field: "ruleId" },
    { title: "Value", field: "value" },
    {
      title: "Status",
      field: "status",
      cellStyle: (status) => {
        switch (status) {
          case "OK":
            return { color: "green" };
          case "FAILED":
            return { color: "red" };
          default:
            return { color: "red" };
        }
      },
    },
    { title: "Table", field: "tableName" },
    { title: "Link", field: "linkSource" },
    { title: "Created At", field: "createdStamp" },
  ];

  function getRules() {
    request("get", "/get-data-quality-check-result-list", (res) => {
      const content = res.data.map((c) => ({
        ...c,
        createdStamp: toFormattedDateTime(c.createdStamp),
      }));
      setRules(content);
    }).then();
  }
  useEffect(() => {
    try {
      var refreshIntervalId = setInterval(async () => {
        getRules();
      }, 3000);
    } catch (e) {
      console.log("FOUND exception", e);
    }

    return function cleanInterval() {
      clearInterval(refreshIntervalId);
    };
    //getRules();
  }, []);
  return (
    <div>
      <StandardTable
        title={"Check Result"}
        columns={columns}
        data={rules}
        hideCommandBar
        options={{
          selection: false,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
}
