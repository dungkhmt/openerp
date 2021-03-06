import {
  Box,
  Button,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { ScrollBox } from "react-scroll-box";
import { a11yProps, TabPanelVertical } from "./TabPanel";
import CodeMirror from "@uiw/react-codemirror";
import { useParams } from "react-router-dom";
import { authGet, authPost } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { Markup } from "interweave";
import { OutputWithLoading } from "./OutputWithLoading";
import { API_URL } from "../../../config/config";
import { SubmitWarming } from "./SubmitWarming";
import { SubmitSuccess } from "./SubmitSuccess";
import { successNoti, warningNoti } from "../../../utils/notification";
import { request } from "./Request";
import { useHistory } from "react-router-dom";

export default function EditTestCase(props) {
  const history = useHistory();
  const [value, setValue] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [screenHeight, setScreenHeight] = useState(
    (window.innerHeight - 300) / 2 + "px"
  );
  const { problemId, testCaseId } = useParams();
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState("");
  const [load, setLoad] = useState(false);
  const [checkTestcaseResult, setCheckTestcaseResult] = useState(false);
  const [point, setPoint] = useState(0);
  const [isPublic, setIsPublic] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log("EditTestCasem testCaseId = ", testCaseId);

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
      "/update-test-case/" + testCaseId,

      (res) => {
        successNoti("Your test case is saved", true);

        history.goBack();
      },
      {},
      body
    ).then(() => history.back);
  };

  useEffect(() => {
    console.log("EditTestCase useEffect start....");

    request("GET", "/get-test-case-detail/" + testCaseId, (res) => {
      console.log("useEffect getTestCaseDetail return res = ", res);
      setDescription(
        res.data.problemDescription != null ? res.data.problemDescription : " "
      );
      setSolution(
        res.data.problemSolution != null ? res.data.problemSolution : " "
      );
      setInput(res.data.testCase != null ? res.data.testCase : " ");
      setResult(res.data.correctAns != null ? res.data.correctAns : " ");
      setPoint(res.data.point != null ? res.data.point : " ");
      setIsPublic(res.data.isPublic != null ? res.data.isPublic : " ");
    }).then(() => {
      console.log("problemId", problemId);
      console.log("testCaseId", testCaseId);
      console.log("isPublic: ", isPublic);
    });
  }, []);

  return (
    <div>
      <Grid container spacing={12}>
        <Grid item xs={6}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Toolbar
              style={{
                height: "0px",
                marginTop: "-12px",
                marginBottom: "-8px",
                border: "1px solid transparent",
                position: "relative",
                width: "100%",
              }}
              color={"default"}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor={"primary"}
                autoFocus
                style={{
                  width: "100%",
                  display: "inline-table",
                  border: "1px solid transparent ",
                  position: "relative",
                  borderBottom: "none",
                }}
                variant={"fullWidth"}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Description"
                  {...a11yProps(0)}
                  style={{ width: "50%" }}
                />
                <Tab
                  label="Solution"
                  {...a11yProps(1)}
                  style={{ width: "50%" }}
                />
              </Tabs>
            </Toolbar>
          </Box>
          <TabPanelVertical value={value} index={0}>
            <ScrollBox
              style={{
                width: "100%",
                overflow: "auto",
                height: window.innerHeight - 180 + "px",
              }}
            >
              <Markup content={description} />
            </ScrollBox>
          </TabPanelVertical>

          <TabPanelVertical value={value} index={1}>
            <ScrollBox
              style={{
                width: "100%",
                overflow: "auto",
                height: window.innerHeight - 180 + "px",
              }}
            >
              <Markup content={solution} />
            </ScrollBox>
          </TabPanelVertical>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={"h5"}>Testcase</Typography>
          <TextField
            autoFocus
            required
            id="point"
            label="Point"
            placeholder="Point"
            value={point}
            onChange={(event) => {
              setPoint(event.target.value);
            }}
          ></TextField>
          <br /> <br />
          <TextField
            autoFocus
            // required
            select
            id="Public TestCase"
            label="Public TestCase"
            placeholder="Public TestCase"
            onChange={(event) => {
              setIsPublic(event.target.value);
            }}
            value={isPublic}
          >
            <MenuItem key={"Y"} value={"Y"}>
              {"Y"}
            </MenuItem>
            <MenuItem key={"N"} value={"N"}>
              {"N"}
            </MenuItem>
          </TextField>
          <br />
          {/*
          <CodeMirror
            height={"200px"}
            width="100%"
            onChange={(value, viewUpdate) => {
              setInput(value);
            }}
            autoFocus={false}
            value={input}
          />
          */}
          <TextField
            style={{
              width: 1.0 * window.innerWidth,

              margin: 20,
            }}
            multiline
            maxRows={4}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          ></TextField>
          <br />
          <br />
          <Typography variant={"h5"}>Result</Typography>
          {result}
          {/*
          <OutputWithLoading
            load={load}
            output={result}
            extension={[]}
            color={"light"}
          />
          */}
          <Button
            variant="contained"
            color="light"
            onClick={getTestCaseResult}
            style={{ marginTop: "10px", marginLeft: "50px" }}
          >
            get testcase result
          </Button>
          <Button
            variant="contained"
            color="light"
            style={{ marginLeft: "50px", marginTop: "10px" }}
            onClick={saveTestCase}
          >
            save test case
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
