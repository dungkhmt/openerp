import React, { useState, useEffect } from "react";
import { request } from "../../api";
import { errorNoti } from "../../utils/notification";
import { Card, CardContent } from "@material-ui/core";
import StandardTable from "../table/StandardTable";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
//import { defaultDatetimeFormat } from "../../utils/dateutils";
import { toFormattedDateTime } from "../../utils/dateutils";

export default function DataQualityCheckMaster() {
  const columns = [
    { title: "RuleID", field: "ruleId" },
    { title: "MetaData", field: "metaData" },
    { title: "Table", field: "tableName" },
    { title: "UserID", field: "createdByUserLoginId" },
    { title: "Created At", field: "createdStamp" },
  ];

  const [dataQualityCheckMasters, setDataQualityCheckMasters] = useState([]);

  function getDataQualityCheckMaster() {
    request("get", "/get-list-data-quality-check-master", (res) => {
      const content = res.data.map((c) => ({
        ...c,
        createdStamp: toFormattedDateTime(c.createdStamp),
      }));
      setDataQualityCheckMasters(content);
    }).then();
  }
  useEffect(() => {
    getDataQualityCheckMaster();
  }, []);

  return (
    <div>
      <StandardTable
        title={"Data Quality Check Master"}
        columns={columns}
        data={dataQualityCheckMasters}
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
