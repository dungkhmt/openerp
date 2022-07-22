import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { request } from "../../../api";
import Alert from '@mui/material/Alert';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
    MenuItem,
    Checkbox,
    Tooltip,
  } from "@material-ui/core/";
  import MaterialTable, { MTableToolbar } from "material-table";
  import Delete from '@material-ui/icons/Delete';
  import Add from '@mui/icons-material/Add';
  import ModalLoading from "./ModalLoading"
  import { useLocation,useHistory } from "react-router-dom";

export default function TeacherBelongToPlan(props) {
    const [err,setErr] = useState("");
    const [showSubmitSuccess,setShowSubmitSuccess] = useState(false);
    const [openLoading,setOpenLoading] = useState(false)
    const defensePlanId = props.defensePlanId; 
    const [listTeacher,setListTeacher] = useState([]);
    const history = useHistory();

    const columns = [
        { title: "STT", field: "stt" },
      { title: "Tên giảng viên", field: "teacherName" },
      { title: "ID giảng viên", field: "teacherId" },
      { title: "Keyword", field: "keywords" },
    ];
    async function getAllTeacherBelongToPlan() {
        console.log(defensePlanId)
        request(
            // token,
            // history,
            "GET",
            `/thesis_defense_plan/${defensePlanId}/teachers`,
            (res) => {
                console.log(res.data)
                let teachers = []
                if (res.data != null ){
                    for (let i=0;i<res.data.length;i++){
                        let keys = ""
                        console.log(res.data[i].keywords)
                        if (res.data[i].keywords != null) {
                            for (let j =0;j<res.data[i].keywords.length;j++){
                                if (j==0){
                                    keys = keys.concat("",res.data[i].keywords[j])
                                    continue
                                }
                                keys = keys.concat(",",res.data[i].keywords[j])
                            }
                        }
                        console.log(keys)
                        teachers.push({
                            stt:i+1,
                            teacherId: res.data[i].teacherId,
                            teacherName: res.data[i].teacherName,
                            keywords: keys
                        })
                    }
                    console.log("Teachers",teachers)
                    setListTeacher(teachers)
                    // setOpenLoading(false);
                }
                }
          );
        }
    const handleAssign = () => {
        history.push({
            pathname: `/thesis/defensePlan/${defensePlanId}/assignTeacher`
          });
    }
    
    useEffect(() => {
        getAllTeacherBelongToPlan();
        
      }, []);
  return (
     <Card>
        <MaterialTable
          title={""}
          columns={columns}
        //   actions={[
        //     {
        //         icon: Add,
        //         tooltip: "Add Teacher",
        //         onClick: (event, rowData) => {
        //           console.log("AddTeacher RowData:",rowData)
        //             AddTeacherById(rowData.teacherId,defenseJuryID)
                  
        //         }
        //     }
        //   ]}
          data={listTeacher}
          components={{
            Toolbar: (props) => (
              <div style={{ position: "relative" }}>
                <MTableToolbar {...props} />
                <div
                  style={{ position: "absolute", top: "16px", right: "350px" }}
                >
                    <Button onClick={handleAssign} color="primary">
                    Phân công viên vào đợt bảo vệ
                  </Button>
                </div>
              </div>
            ),
          }}
        />
        {(err!=="") ? <Alert severity={(err!=="")?'error':'success'}>{(err!=="")?err:"Successed"}</Alert> : <></> }
        <ModalLoading openLoading={openLoading} />
      </Card>
  );
}
