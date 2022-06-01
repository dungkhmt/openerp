import { Box, Button, MenuItem, TextField } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import CodeMirror from "@uiw/react-codemirror";
import { useHistory, useParams } from "react-router-dom";
import { successNoti, warningNoti } from "../../../utils/notification";
import { request } from "./Request";

export default function CreateTestCase(props) {
  const history = useHistory();
  const [value, setValue] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const { problemId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [description, setDescription] = useState();
  const [solution, setSolution] = useState();
  const [load, setLoad] = useState(false);
  const [checkTestcaseResult, setCheckTestcaseResult] = useState(false);
  const [showSubmitWarming, setShowSubmitWarming] = useState(false);
  const [point, setPoint] = useState(0);
  const [isPublic, setIsPublic] = useState("N");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTestCaseResult = () => {
    console.log("get test case result");
    setLoad(true);
    let body = {
      testcase: input,
    };

    request(
      "POST",
      "/get-test-case-result/" + problemId,
      (res) => {
        console.log("res", res);
        setLoad(false);
        setResult(res.data.result);
        setCheckTestcaseResult(true);
        setShowSubmitWarming(false);
        if (res.data.status != "ok") {
          warningNoti(res.data.status, false);
        }
      },
      {},
      body
    ).then();
  };

  const saveTestCase = () => {
    if (!checkTestcaseResult) {
      // setShowSubmitWarming(true);
      warningNoti("You must test your test case result before save", true);
      return;
    }

    let body = {
      input: input,
      result: result,
      point: point,
      isPublic: isPublic,
    };

    request(
      "POST",
      "/save-test-case/" + problemId,
      (res) => {
        console.log("res", res);
        // setShowSubmitSuccess(true);
        history.goBack();
        successNoti("Your test case is saved", true);
      },
      {},
      body
    ).then();
  };

  useEffect(() => {
    console.log("problemId ", problemId);
    console.log("token ", token);
    /*
    request("GET", "/problem-details/" + problemId, (res) => {
      console.log("res ", res);
      setDescription(res.data.problemDescription);
      setSolution(res.data.solution);
    }).then();
    */
  }, []);

  return (
    <Box>
      <Typography variant={"h4"}>Create new Test case</Typography>
      <Box
        style={{
          width: "400px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextField
          autoFocus
          required
          id="point"
          label="Point"
          placeholder="Point"
          onChange={(event) => {
            setPoint(event.target.value);
          }}
        ></TextField>
        <TextField
          autoFocus
          // required
          select
          id="Public TestCase"
          label="Public TestCase"
          onChange={(event) => {
            setIsPublic(event.target.value);
          }}
          value={isPublic}
          style={{ width: "140px" }}
        >
          <MenuItem key={"Y"} value={"Y"}>
            {"Y"}
          </MenuItem>
          <MenuItem key={"N"} value={"N"}>
            {"N"}
          </MenuItem>
        </TextField>
      </Box>
      <br />
      <TextField
        fullWidth
        style={{
          marginTop: "10px",
          marginBottom: "24px",
        }}
        multiline
        maxRows={4}
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      ></TextField>
      <Button
        variant="contained"
        color="light"
        onClick={getTestCaseResult}
      >
        get testcase result
      </Button>
      <Box fullWidth style={{ height: "20px" }} />
      <Typography variant={"h5"}>Result</Typography>
      <Box fullWidth>{result}</Box>
      <Button
        variant="contained"
        color="light"
        style={{ marginTop: "10px" }}
        onClick={saveTestCase}
      >
        save test case
      </Button>
    </Box>
  );
}
