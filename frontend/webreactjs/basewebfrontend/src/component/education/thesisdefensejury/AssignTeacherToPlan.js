import { Box, IconButton, Typography } from "@material-ui/core/";
import { grey } from "@material-ui/core/colors";
import { makeStyles, MuiThemeProvider,createMuiTheme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
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
import { useLocation,useHistory } from "react-router-dom";
import Loading from "../../common/Loading"
import LoadingOverlay from "react-loading-overlay";
import ElementDeleteTeacherPlan from "./ElementDeleteTeacherPlan";
import ElementAddTeacherPlan from "./ElementAddTeacherPlan";

function AssignTeacherToPlan(props) {
  // const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [defenseJuryDetail, setDefenseJuryDetail] = useState([]);
  const history = useHistory();
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
  const location = useLocation();
  const [loading,setLoading] = useState(true)
  const [openLoadingAdd,setOpenLoadingAdd] = useState(false)
  const [openLoadingDelete,setOpenLoadingDelete] = useState(false)
  const [defensePlanId,setDefensePlanId] = useState();
 
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

  
  const handlerIsLoad = () => {
    console.log("Loadding: ",loading)
    setLoading(true)
  }
  const handlerNotLoad = () => {
    console.log("Loadding: ",loading)
    setLoading(false)
  }


  async function getAllTeachers(teacher) {
    request(
      // token,
      // history,
      "GET",
      "/teachers",
      (res) => {
        
          console.log("Resp get all:",res.data)
          console.log("Teacher Resp:",teacher)
          let listTeachers = [];
          let listTeachersId = [];
          var data = [];
          for (let i=0;i<teacher.length;i++){
            listTeachersId.push(teacher[i].teacherId);
          }
          listTeachers =  res.data.filter(ele => !listTeachersId.includes(ele.id));
          console.log("List Teachers :",listTeachers)
          for (let j=0;j<listTeachers.length;j++){
            var ele = {
              stt:j+1,
              teacherId:listTeachers[j].id,
              teacherName:listTeachers[j].teacherName,
              // studentName:listTeachers[j].student_name
            }
            data.push(ele)
          }
          
        setListTeacher(data)
        
      }
    );
  }

  async function getListTeacherOfPlan() {
    request(
      // token,
      // history,
      "GET",
      `/thesis_defense_plan/${params.id}/teachers`,
      (res) => {
          console.log("Teacher of Plan",res.data)
          let teachersBelongPlan = []
          if (res.data != null ){
            teachersBelongPlan = res.data
          }
          getAllTeachers(teachersBelongPlan)
          let listTeachers = []
        for (let i=0;i<teachersBelongPlan.length;i++){
          var ele = {
            stt:i+1,
            teacherId:res.data[i].teacherId,
            teacherName:res.data[i].teacherName,
          }
          listTeachers.push(ele)
        }
         setTeacher(listTeachers)
        
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


 
  const handleBack = (e) => {
    e.preventDefault();
    history.push({
        pathname: `/thesis/thesis_defense_plan/${params.id}`,
        state: {
          valueTab:1
      },
    });
  }


  useEffect(() => {
    console.log("Loading")
    getListTeacherOfPlan();
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
  
      </Box>
      <MuiThemeProvider >
      <Button color="primary" type="submit" onClick={handleBack} width="20%">Back</Button>   
       
        <div>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <h2>Danh sách giảng viên trong đợt bảo vệ</h2>
              <ElementDeleteTeacherPlan teacher = {teacher} defensePlanID = {params.id} toggleTeacher={toggleTeacher} handleToggleTeacher={handleToggleTeacher} getListTeacherOfPlan={getListTeacherOfPlan}
                handlerIsLoad = {handlerIsLoad} handlerNotLoad = {handlerNotLoad}
              />
            </Grid>
            <Grid item sm={12} md={6}>
               <h2>Danh sách giảng viên</h2>
               <ElementAddTeacherPlan listTeacher = {listTeacher} 
               defensePlanID = {params.id} toggleTeacher={toggleTeacher} handleToggleTeacher={handleToggleTeacher} getAllTeachers={getAllTeachers}
               handlerIsLoad = {handlerIsLoad} handlerNotLoad = {handlerNotLoad}
               />
            </Grid>
        </Grid>
        </div>
        {/* {loading ?  (<LoadingOverlay
          active={true}
          spinner={true}
          text="Loading your content..."
        > </LoadingOverlay>) :<></>} */}
      </MuiThemeProvider>
    </>
  );
}

export default AssignTeacherToPlan;
