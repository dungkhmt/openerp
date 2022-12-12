import React, { useState, useEffect } from "react";
import { request } from "../../api";
import { errorNoti, successNoti } from "../../utils/notification";
import { Card, CardContent } from "@material-ui/core";
import StandardTable from "../table/StandardTable";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { defaultDatetimeFormat } from "../../utils/dateutils";
import { TextField, Button } from "@mui/material";

export default function DataQualityCheckDefineRules() {
  const [rules, setRules] = useState([]);
  const [params, setParams] = useState([]);
  const [selectRuleId, setSelectRuleId] = useState(null);
  const [selectTableName, setSelectTableName] = useState(null);
  const [indexTableName, setIndexTableName] = useState(null);
  const [paramValues, setParamValues] = useState([]);

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
    for (let i = 0; i < values.length; i++) values[i] = "";

    let P = [];
    //alert("select rule " + ruleId);
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].ruleId === ruleId) {
        //setParams(rules[i].listParams);
        values = [];

        for (let j = 0; j < rules[i].listParams.length; j++) {
          //values.push(j);
          if (rules[i].listParams[j] === "table_name") {
            setIndexTableName(j);
          }
          //else {
          values.push(" ");
          P.push(rules[i].listParams[j]);
          //}
        }
        break;
      }
    }

    setParamValues(values);
    setParams(P);
    setSelectRuleId(ruleId);
    console.log(
      "select rule ",
      ruleId,
      " P = ",
      P,
      " paramValues = ",
      paramValues
    );
  }
  function getRules() {
    request("get", "/get-data-quality-check-rules", (res) => {
      setRules(res.data);
    }).then();
  }
  function setParamValue(i, e) {
    //alert("setParamValue(" + i + "," + e.target.value + ")");
    values[i] = e.target.value;
    console.log(
      "setParamValue, before paramValues = ",
      paramValues,
      " length = ",
      paramValues.length
    );
    let d = [];
    for (let j = 0; j < paramValues.length; j++) {
      d.push(paramValues[j]);
    }
    d[i] = e.target.value;
    //alert(d);
    setParamValues(d);
    console.log("d = ", d, "paramValues = ", paramValues);
  }
  function addRule() {
    let s = "[";
    //for (let i = 0; i < values.length; i++) {
    for (let i = 0; i < paramValues.length; i++) {
      //alert("field " + rules[i].ruleId + " values " + i + " = " + values[i]);
      //s = s + '"' + params[i] + '"' + ":" + '"' + values[i] + '"';
      s = s + '"' + params[i] + '"' + ":" + '"' + paramValues[i] + '"';
      //if (i < values.length - 1) s = s + ",";
      if (i < paramValues.length - 1) s = s + ",";
    }
    s = s + "]";
    //alert("params " + s);
    let body = {
      ruleId: selectRuleId,
      //tableName: values[indexTableName],
      tableName: paramValues[indexTableName],
      metaData: s,
    };
    alert("body " + JSON.stringify(body));

    let successHandler = (res) => {
      successNoti("Define Rule Successfully", 3000);
    };
    let errorHandlers = {
      onError: (error) => errorNoti("Error when Create Rule Master", 3000),
    };

    request(
      "POST",
      "/create-data-quality-check-master",
      successHandler,
      errorHandlers,
      body
    );
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
          pageSize: 5,
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
                value={paramValues[i]}
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
        ADD RULE
      </Button>
    </div>
  );
}
