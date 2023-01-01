import React, { useState, useEffect } from "react";
import { request } from "../../api";
import { errorNoti } from "../../utils/notification";
import { Card, CardContent } from "@material-ui/core";
import StandardTable from "../table/StandardTable";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { defaultDatetimeFormat } from "../../utils/dateutils";

export default function DataQualityCheck() {
  const [rules, setRules] = useState([]);
  const columns = [
    { title: "RuleID", field: "ruleId" },
    { title: "Description", field: "ruleDescription" },
    { title: "Params", field: "params" },
  ];

  function getRules() {
    request("get", "/get-data-quality-check-rules", (res) => {
      setRules(res.data);
    }).then();
  }
  useEffect(() => {
    getRules();
  }, []);
  return (
    <div>
      <StandardTable
        title={"Check Rules"}
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
