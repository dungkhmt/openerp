import * as React from "react";
import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {request} from "./Request";
import Typography from "@mui/material/Typography";
import {Autocomplete, Button, Grid, IconButton, TextField} from "@mui/material";
import StandardTable from "component/table/StandardTable";
import Box from "@mui/material/Box";
import {errorNoti} from "../../../utils/notification";
import ModalAddProblemToContest from "./ModalAddProblemToContest";
import EditIcon from "@mui/icons-material/Edit";
import ModalUpdateProblemInfoInContest from "./ModalUpdateProblemInfoInContest";
import DeleteIcon from "@mui/icons-material/Delete";
import {getColorLevel} from "./lib";
import {getSubmissionModeFromConstant} from "./Constant";

export function ContestManagerManageProblem(props) {
  const contestId = props.contestId;
  const [allProblems, setAllProblems] = useState([]);
  const [contestProblems, setContestProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [searchProblemValue, setSearchProblemValue] = useState("");
  const [chosenProblem, setChosenProblem] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);

  const [openModalAddProblem, setOpenModalAddProblem] = useState(false);
  const [openModalUpdateProblem, setOpenModalUpdateProblem] = useState(false);

  const columns = [
    {
      title: "Problem",
      render: (rowData) => (
        <Link
          to={{
            pathname:
              "/programming-contest/manager-view-problem-detail/" +
              rowData["problemId"],
          }}
          style={{
            textDecoration: "none",
            color: "blue",
            cursor: "",
          }}
        >
          {rowData["problemName"]}
        </Link>
      ),
    },
    {title: "Created By", field: "createdByUserId"},
    {title: "Problem Name in Contest", field: "problemRename"},
    {title: "Problem Code in Contest", field: "problemRecode"},
    {
      title: "Level",
      render: (problem) => (
        <span style={{color: getColorLevel(`${problem.levelId}`)}}>
          {`${problem.levelId}`}
        </span>
      )
    },
    {
      title: "Submission Mode",
      render: (problem) => (
        <span >
          {getSubmissionModeFromConstant(problem?.submissionMode)}
        </span>
      )
    },
    {
      title: "Edit",
      render: (problem) => (
        <IconButton
          onClick={() => {
            setEditingProblem(problem)
            setOpenModalUpdateProblem(true);
          }}
          variant="contained"
          color="success"
        >
          <EditIcon/>
        </IconButton>
      ),
    },
    {
      title: "Remove",
      render: (problem) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => {
            request(
              "delete",
              "/remove-problem-from-contest?contestId=" + contestId + "&problemId=" + problem.problemId,
              () => {
                getAllProblemsInContest()
              },
              {}
            ).then();
          }}
        >
          <DeleteIcon/>
        </IconButton>
      ),
    }
  ];

  const getAllProblems = () => {
    request("get", "/get-all-contest-problems-general-info", (res) => {
      setAllProblems(res.data);
    }).then();
  }

  const getAllProblemsInContest = () => {
    request("get", "/get-contest-detail/" + contestId, (res) => {
      setContestProblems(res.data.list);
    }).then();
  }

  useEffect(() => {
    getAllProblems();
    getAllProblemsInContest()
  }, [])

  function addNewProblem(newProblem) {
    if (contestProblems.filter(problem => problem.problemId === newProblem.problemId).length > 0) {
      errorNoti("Problem is already in contest", 3000);
      return;
    }
    setChosenProblem(newProblem);
    setOpenModalAddProblem(true);
  }

  const handleAddProblemToContestSuccess = () => {
    getAllProblemsInContest();
  }
  const handleCloseModal = () => {
    setOpenModalAddProblem(false);
    setOpenModalUpdateProblem(false);
  }

  return (
    <Box sx={{margin: "14px 0"}}>
      <Box display="flex" justifyContent="space-between" sx={{marginBottom: "16px"}}>
        <Button
          variant="contained"
          sx={{
            width: "14%",
            padding: "2px 16px"
          }}
          onClick={() => window.open("/programming-contest/create-problem")}
        >
          <Typography>{"Create Problem"}</Typography>
        </Button>
        <Autocomplete
          id="problem-select"
          onChange={(event, value) => addNewProblem(value)}
          options={allProblems}
          sx={{width: "85%"}}
          autoHighlight
          getOptionLabel={(option) => option.problemName || ""}
          inputValue={searchProblemValue}
          onInputChange={(event, newInputValue, reason) => {
            if (reason === "reset") setSearchProblemValue("");
            else setSearchProblemValue(newInputValue);
          }}
          renderOption={(props, option) => (
            <Box {...props} key={option.problemId}>
              <Grid container>
                <Grid item xs={6}>
                  {option.problemName}
                </Grid>
                <Grid item xs={6} sx={{display: "flex"}}>
                  <Typography>
                    {" "}
                    {"ID"}: {option.problemId}{" "}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          renderInput={(params) => {
            return <TextField {...params} placeholder="Search problem"/>;
          }}
        />
      </Box>

      <StandardTable
        title={"Problems in Contest"}
        columns={columns}
        data={contestProblems}
        hideCommandBar
        options={{
          selection: false,
          pageSize: 10,
          search: true,
          sorting: true,
        }}
      />

      <ModalAddProblemToContest
        contestId={contestId}
        chosenProblem={chosenProblem}
        isOpen={openModalAddProblem}
        handleSuccess={handleAddProblemToContestSuccess}
        handleClose={handleCloseModal}
      />

      <ModalUpdateProblemInfoInContest
        contestId={contestId}
        editingProblem={editingProblem}
        isOpen={openModalUpdateProblem}
        handleSuccess={handleAddProblemToContestSuccess}
        handleClose={handleCloseModal}
      />
    </Box>
  );
}
