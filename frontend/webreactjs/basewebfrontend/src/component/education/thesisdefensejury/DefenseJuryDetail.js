import { Box, IconButton, Typography } from "@material-ui/core/";
import { grey } from "@material-ui/core/colors";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart, request } from "../../../api";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ElementDeleteThesis from  './ElementDeleteThesis';
import ElementAddThesis from  './ElementAddThesis';
import ElementAddTeacher from  './ElementAddTeacher';
import ElementDeleteTeacher from  './ElementDeleteTeacher';
import {
  components,
  localization,
  theme,
} from "../../../utils/MaterialTableUtils";
import TertiaryButton from "../../button/TertiaryButton";
import { GiNuclearPlant } from "react-icons/gi";

const useStyles = makeStyles((theme) => ({
  commandButton: {
    marginLeft: theme.spacing(2),
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  tableToolbarHighlight: { backgroundColor: "transparent" },
}));

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};
// const theme = createMuiTheme({
//   palette: {
//     primary: green,
//   },
// });

let count = 0;
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function DefenseJuryDetail(props) {
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [defenseJuryDetail, setDefenseJuryDetail] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openModelExcel, setOpenModelExcel] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const params = useParams();
  const statusDeleteEle = true;
  const [toggle,setToggle] = useState(false);
  const [toggleTeacher,setToggleTeacher] = useState(false);
  const [thesis, setThesis] = useState([]);
  const [notBelongThesis,setNotBelongThesis] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [notBelongTeacher,setNotBelongTeacher] = useState([]);
  const [listTeacher,setListTeacher] = React.useState([]);
  //const [selectedFile, setSelectedFile] = useState(null);

  // Table
  const cellStyles = { headerStyle: { padding: 8 }, cellStyle: { padding: 8 } };
  const alignRightCellStyles = {
    headerStyle: { padding: 8, textAlign: "right" },
    cellStyle: { padding: 8, textAlign: "right" },
  };
  const columns = [
    { title: "Tên HĐ", field: "name", ...cellStyles },
    { title: "Số lượng ĐA tối đa", field: "maxThesis", ...cellStyles },
    { title: "Người tạo", field: "userLoginID", ...cellStyles },
    { title: "Tên kế hoạch", field: "thesisPlanName", ...cellStyles },
    { title: "Chương trình", field: "program_name", ...cellStyles },
    {title:"Ngày bảo vệ",field:"defenseDate",...cellStyles },
    {
      title: "",
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onUpdateHourLoad(rowData["classId"]);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
      ...cellStyles,
    },
  ];

  async function getListThesisOfDefenseJury() {
    request(
      // token,
      // history,
      "GET",
      `/defense_jury/${params.id}/thesiss`,
      (res) => {
          // console.log(res.data)
        getAllThesisNotBelongToDefenseJury(res.data)
        let listThesis = []
        for (let i=0;i<res.data.length;i++){
          var ele = {
            stt:i+1,
            id:res.data[i].id,
            thesisName:res.data[i].thesisName,
            studentName:res.data[i].studentName
          }
          listThesis.push(ele)
        }
        setThesis(listThesis);
      }
    );
  }

  async function getAllThesisNotBelongToDefenseJury(thesis) {
    request(
      // token,
      // history,
      "GET",
      `/thesis`,
      (res) => {
          console.log("Resp:",res.data.content)
          console.log("Thesis Resp:",thesis)
          let listThesis = [];
          let listThesisId = [];
          var data = [];
          for (let i=0;i<thesis.length;i++){
            listThesisId.push(thesis[i].id);
          }
          listThesis =  res.data.content.filter(ele => !listThesisId.includes(ele.id));
          console.log("List Thesis :",listThesis)
          for (let j=0;j<listThesis.length;j++){
            var ele = {
              stt:j+1,
              id:listThesis[j].id,
              thesisName:listThesis[j].name,
              studentName:listThesis[j].student_name
            }
            data.push(ele)
          }
          
          // console.log(data)
        setNotBelongThesis(data);
      }
    );
  }

  async function getAllTeacherNotBelongToDefenseJury() {
    request(
      // token,
      // history,
      "GET",
      "/teachers",
      (res) => {
          console.log("Teachers",res.data)
          setListTeacher(res.data)
        
      }
    );
  }

  async function getListTeacherOfDefenseJury() {
    request(
      // token,
      // history,
      "GET",
      `/defense_jury/${params.id}/teachers`,
      (res) => {
          console.log("List Teachers",res.data)
         setTeacher(res.data.result)
        
      }
    );
  }

  async function getDefenseJury() {
    request(
      // token,
      // history,
      "GET",
      "/defense_jury/" + params.id,
      (res) => {
        // console.log(res.data)
        setDefenseJuryDetail([res.data]);
      }
    );
  }

  const handleToggle = () => {
    // console.log("First:",toggle)
    setToggle(!toggle)
    // console.log("Last:",toggle)
  }
  const handleToggleTeacher = () => {
    // console.log("First:",toggle)
    setToggleTeacher(!toggleTeacher)
    // console.log("Last:",toggle)
  }
  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpenModelExcel = () => {
    setOpenModelExcel(true);
  };

  const handleModalCloseModelExcel = () => {
    setOpenModelExcel(false);
  };
  useEffect(() => {
    getDefenseJury();
  },[])

  useEffect(() => {
   
    getListThesisOfDefenseJury();
    getListTeacherOfDefenseJury();
    getAllTeacherNotBelongToDefenseJury();
    // getAllThesisNotBelongToDefenseJury();
  }, [toggle,toggleTeacher]);
  return (
    <>
      <Box
        width="100%"
        height={40}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        borderBottom={1}
        mt={-3}
        mb={3}
        style={{ borderColor: "#e8e8e8" }}
      >
    
        {/* {selectedRows.length > 0 && (
          <>
            <TertiaryButton
              className={classes.commandButton}
              color="default"
              startIcon={<DeleteRoundedIcon />}
              // disableRipple
              onClick={handleRemoveClassFromAssignmentPlan}
            >
              Xoá
            </TertiaryButton>
            <Typography
              component="span"
              style={{ marginLeft: "auto", marginRight: 32 }}
            >{`Đã chọn ${selectedRows.length} mục`}</Typography>
          </>
        )} */}
      </Box>
      <MuiThemeProvider theme={theme}>
        {/* <MaterialTable
          title={"Chi tiết HĐ Bảo vệ"}
          columns={columns}
          data={defenseJuryDetail}
          localization={{
            ...localization,
            toolbar: { ...localization.toolbar, nRowsSelected: "" },
          }}
          options={{
            selection: true,
            pageSize: 20,
            headerStyle: {
              backgroundColor: "transparent",
            },
            // rowStyle: (rowData) => ({
            //   backgroundColor: rowData.tableData.checked
            //     ? grey[200]
            //     : "#FFFFFF",
            // }),
          }}
          onSelectionChange={(rows) => {
            setSelectedRows(rows);
          }}
          components={{
            Toolbar: (props) => (
              <MTableToolbar
                {...props}
                classes={{
                  highlight: classes.tableToolbarHighlight,
                }}
                searchFieldVariant="outlined"
                searchFieldStyle={{
                  height: 40,
                }}
              />
            ),
          }}
        /> */}
        <div>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <h2>Danh sach luan van trong HD</h2>
              <ElementDeleteThesis thesis = {thesis} defenseJuryID = {params.id} toggle={toggle} handleToggle={handleToggle} getListThesisOfDefenseJury={getListThesisOfDefenseJury}/>
            </Grid>
            <Grid item sm={12} md={6}>
               <h2>Danh sach luan van</h2>
               <ElementAddThesis notBelongThesis = {notBelongThesis} 
               defenseJuryID = {params.id} toggle={toggle} handleToggle={handleToggle} getAllThesisNotBelongToDefenseJury={getAllThesisNotBelongToDefenseJury}

               />
            </Grid>
        </Grid>
        </div>
        <div>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <h2>Danh sach giảng viên trong HD</h2>
              <ElementDeleteTeacher teacher = {teacher} defenseJuryID = {params.id} toggleTeacher={toggleTeacher} handleToggleTeacher={handleToggleTeacher} getListTeacherOfDefenseJury={getListTeacherOfDefenseJury}/>
            </Grid>
            <Grid item sm={12} md={6}>
               <h2>Danh sach giảng viên</h2>
               <ElementAddTeacher listTeacher = {listTeacher} 
               defenseJuryID = {params.id} toggleTeacher={toggleTeacher} handleToggleTeacher={handleToggleTeacher} getAllTeacherNotBelongToDefenseJury={getAllTeacherNotBelongToDefenseJury}

               />
            </Grid>
        </Grid>
        </div>
      </MuiThemeProvider>
    </>
  );
}

export default DefenseJuryDetail;
