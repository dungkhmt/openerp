import React, { useState, useEffect } from "react";
import { request } from "../../api";
import { errorNoti } from "../../utils/notification";
import { Card, CardContent } from "@material-ui/core";
import StandardTable from "../table/StandardTable";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
//import { defaultDatetimeFormat } from "../../utils/dateutils";
import { toFormattedDateTime } from "../../utils/dateutils";
import { Button } from "@mui/material";
export default function DataQualityCheckMaster() {
  const columns = [
    { title: "RuleID", field: "ruleId" },
    { title: "MetaData", field: "metaData" },
    { title: "Table", field: "tableName" },
    { title: "UserID", field: "createdByUserLoginId" },
    { title: "Created At", field: "createdStamp" },
    {
      title: "Action",

      render: (rowData) => (
        <Button onClick={() => handleRemove(rowData.id)}>Remove</Button>
      ),
    },
  ];

  const [dataQualityCheckMasters, setDataQualityCheckMasters] = useState([]);

  function handleRemove(id) {
    //alert("remove " + id);
    request("get", "/remove-data-quality-check-master/" + id, (res) => {
      getDataQualityCheckMaster();
    }).then();
  }
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
