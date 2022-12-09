import React, { useState, useEffect } from "react";
import { request } from "../../api";
import { errorNoti } from "../../utils/notification";
import { Card, CardContent } from "@material-ui/core";
import StandardTable from "../table/StandardTable";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { defaultDatetimeFormat } from "../../utils/dateutils";
import { TextField, Button } from "@mui/material";
export default function DataQualityCheckDefineRules() {
  const [rules, setRules] = useState([]);
  const [params, setParams] = useState([]);
  //const [values, setValues] = useState([]);
  let values = [];
  const columns = [
    { title: "RuleID", field: "ruleId" },
    { title: "Description", field: "ruleDescription" },
    { title: "Params", field: "params" },
    {
      title: "Select",
      field: "ruleId",
      render: (rowData) => (
        <Button
          color="primary"
          aria-label="Select"
          onClick={() => {
            selectRule(rowData["ruleId"]);
          }}
        >
          Select
        </Button>
      ),
    },
  ];

  function selectRule(ruleId) {
    //alert("select rule " + ruleId);
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].ruleId === ruleId) {
        setParams(rules[i].listParams);
        values = [];
        for (let j = 0; j < rules[i].listParams.length; j++) {
          values.push(j);
        }
        break;
      }
    }
  }
  function getRules() {
    request("get", "/get-data-quality-check-rules", (res) => {
      setRules(res.data);
    }).then();
  }
  function setParamValue(i, e) {
    //alert("setParamValue(" + i + "," + e.target.value + ")");
    values[i] = e.target.value;
  }
  function addRule() {
    let s = "[";
    for (let i = 0; i < values.length; i++) {
      //alert("field " + rules[i].ruleId + " values " + i + " = " + values[i]);
      s = s + '"' + params[i] + '"' + ":" + '"' + values[i] + '"';
      if (i < values.length - 1) s = s + ",";
    }
    s = s + "]";
    alert("params " + s);
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
      <div>
        {params.map((p, i) => {
          return (
            <div>
              <h3>{p}: </h3>
              <TextField
                autoFocus
                required
                id="value"
                label="value"
                placeholder="Value"
                onChange={(event) => {
                  setParamValue(i, event);
                }}
              />
            </div>
          );
        })}
      </div>
      <Button
        onClick={() => {
          addRule();
        }}
      >
        OK
      </Button>
    </div>
  );
}
