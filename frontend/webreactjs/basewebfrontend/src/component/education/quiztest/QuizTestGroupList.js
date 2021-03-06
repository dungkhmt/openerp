import {
  Button,
  Checkbox,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import { blue, green, grey } from "@material-ui/core/colors";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MaterialTable from "material-table";
import React, { useEffect, useReducer, useState } from "react";
import SimpleBar from "simplebar-react";
import { request } from "../../../api";
import PrimaryButton from "../../button/PrimaryButton";
import TertiaryButton from "../../button/TertiaryButton";
import CustomizedDialogs from "../../dialog/CustomizedDialogs";
import ErrorDialog from "../../dialog/ErrorDialog";
import QuizTestGroupQuestionList from "./QuizTestGroupQuestionList";
export const style = (theme) => ({
  testBtn: {
    marginLeft: 40,
    marginTop: 32,
  },
  wrapper: {
    padding: "32px 0px",
  },
  answerWrapper: {
    "& label": {
      "&>:nth-child(2)": {
        display: "inline-block",
        "& p": {
          margin: 0,
          textAlign: "justify",
        },
      },
    },
  },
  answer: {
    width: "100%",
    marginTop: 20,
  },
  quizStatement: {
    fontSize: "1rem",
    "&>p:first-of-type": {
      display: "inline",
    },
  },
  list: {
    paddingBottom: 0,
    width: 330,
  },
  dialogContent: { paddingBottom: theme.spacing(1), width: 362 },
  listItem: {
    borderRadius: 6,
    "&:hover": {
      backgroundColor: grey[200],
    },
    "&.Mui-selected": {
      backgroundColor: blue[500],
      color: theme.palette.getContrastText(blue[500]),
      "&:hover": {
        backgroundColor: blue[500],
      },
    },
  },
  btn: {
    textTransform: "none",
  },
});

const useStyles = makeStyles((theme) => style(theme));

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};

let count = 0;

export default function QuizTestGroupList(props) {
  // const classes = useStyles();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedAll, setSelectedAll] = useState(false);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const theme = createTheme({
    palette: {
      primary: green,
    },
  });
  const classes = useStyles();

  const columns = [
    {
      field: "groupCode",
      title: "M?? ?????",
      ...headerProperties,
    },
    {
      field: "note",
      title: "Ghi ch??",
      ...headerProperties,
      width: "40%",
    },
    {
      field: "numStudent",
      title: "S??? sinh vi??n",
      ...headerProperties,
      type: "numeric",
    },
    {
      field: "numQuestion",
      title: "S??? c??u h???i",
      ...headerProperties,
      type: "numeric",
    },
    {
      field: "selected",
      title: "    Ch???n",
      ...headerProperties,
      width: "10%",
      type: "numeric",
      render: (rowData) => (
        <Checkbox
          checked={rowData.selected}
          onChange={(e) => {
            rowData.selected = e.target.checked;
            if (rowData.selected == false) {
              count--;
              setSelectedAll(false);
            } else {
              count++;
            }
            if (count == groupList.length) {
              setSelectedAll(true);
            }
            forceUpdate();
          }}
        />
      ),
    },
  ];

  let testId = props.testId;

  const [groupList, setGroupList] = useState([]);
  const [numberGroups, setNumberGroups] = useState(1);

  const onOpenDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeNumberGroups = (event) => {
    setNumberGroups(event.target.value);
  };
  async function getStudentList() {
    request(
      // token,
      // history,
      "GET",
      "/get-test-groups-info?testId=" + testId,
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          temp.push({
            groupCode: elm.groupCode,
            note: elm.note,
            numStudent: elm.numStudent,
            numQuestion: elm.numQuestion,
            quizGroupId: elm.quizGroupId,
            selected: false,
          });
        });
        setGroupList(temp);
        console.log(res.data);
      }
    );
    count = 0;
  }

  const handleGenerateQuizGroup = (e) => {
    handleClose();
    let data = { quizTestId: testId, numberOfQuizTestGroups: numberGroups };

    request(
      // token,
      // history,
      "post",
      "generate-quiz-test-group",
      (res) => {
        console.log(res);
        alert("Th??m ????? th??nh c??ng");
      },
      { rest: () => setError(true) },

      data
    );
  };

  const handleDeleteQuizGroup = (e) => {
    if (!window.confirm("B???n c?? ch???c mu???n x??a nh???ng ????? thi n??y kh??ng ???")) {
      return;
    }

    let acceptList = [];
    groupList.map((v, i) => {
      if (v.selected == true) {
        acceptList.push(v.quizGroupId);
      }
    });

    if (acceptList.length != 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("testId", testId);
      formData.append("quizTestGroupList", acceptList.join(";"));

      request(
        // token,
        // history,
        "POST",
        "/delete-quiz-test-groups",
        (res) => {
          result = res.data;

          if (result >= 0) {
            let temp = groupList.filter(
              (el) => !acceptList.includes(el.userLoginId)
            );
            setGroupList(temp);
            count = 0;
          }
        },
        {},
        formData
      );
    }
  };

  useEffect(() => {
    getStudentList();
    return () => {};
  }, []);

  return (
    <>
      <MaterialTable
        title=""
        columns={columns}
        data={groupList}
        //icons={tableIcons}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: "Kh??ng c?? b???n ghi n??o ????? hi???n th???",
            filterRow: {
              filterTooltip: "L???c",
            },
          },
        }}
        options={{
          search: true,
          actionsColumnIndex: -1,
          pageSize: 10,
          tableLayout: "fixed",
          //selection: true
        }}
        actions={[
          {
            icon: () => {
              return (
                <Tooltip
                  title="Th??m ????? m???i"
                  aria-label="Th??m ????? m???i"
                  placement="top"
                >
                  <ThemeProvider theme={theme}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        //handleGenerateQuizGroup(e);
                        onOpenDialog();
                      }}
                      style={{ color: "white" }}
                    >
                      <AddCircleOutlineIcon
                        style={{ color: "white" }}
                        fontSize="default"
                      />
                      &nbsp;&nbsp;&nbsp;Th??m ?????&nbsp;&nbsp;
                    </Button>
                  </ThemeProvider>
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Tooltip
                  title="X??a ????? ???????c ch???n"
                  aria-label="X??a ????? ???????c ch???n"
                  placement="top"
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      handleDeleteQuizGroup(e);
                    }}
                  >
                    <Delete style={{ color: "white" }} fontSize="default" />
                    &nbsp;&nbsp;&nbsp;X??a&nbsp;&nbsp;
                  </Button>
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Tooltip
                  title="Ch???n t???t c???"
                  aria-label="Ch???n t???t c???"
                  placement="top"
                >
                  <Checkbox
                    checked={selectedAll}
                    onChange={(e) => {
                      let tempS = e.target.checked;
                      setSelectedAll(e.target.checked);

                      if (tempS) count = groupList.length;
                      else count = 0;

                      groupList.map((value, index) => {
                        value.selected = tempS;
                      });
                    }}
                  />
                  {/* <div>&nbsp;&nbsp;&nbsp;Ch???n t???t c???&nbsp;&nbsp;</div> */}
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
        ]}
      />
      <QuizTestGroupQuestionList testId={testId} />

      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        title="Sinh th??m ?????"
        content={
          <>
            <Typography color="textSecondary" gutterBottom>
              Nh???p s??? l?????ng ????? c???n sinh th??m
            </Typography>
            <SimpleBar
              style={{
                height: "100%",
                maxHeight: 400,
                width: 330,
                overflowX: "hidden",
                overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu's scrollbar reach end
              }}
            ></SimpleBar>
            <TextField
              required
              id="standard-required"
              label="Required"
              defaultValue="1"
              onChange={handleChangeNumberGroups}
            />
          </>
        }
        actions={
          <>
            <TertiaryButton onClick={handleClose}>Hu???</TertiaryButton>
            <PrimaryButton onClick={handleGenerateQuizGroup}>
              Sinh th??m ?????
            </PrimaryButton>
          </>
        }
        style={{ content: classes.dialogContent }}
      />
      <ErrorDialog open={error} />
    </>
  );
}
