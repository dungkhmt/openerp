import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { request } from "../../../api";
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

export default function ElementDeleteTeacher({teacher,defenseJuryID,toggleTeacher,handleToggleTeacher,getListTeacherOfDefenseJury}) {
    const [err,setErr] = useState("");
    const [showSubmitSuccess,setShowSubmitSuccess] = useState(false);
  
    async function DeleteTeacherById(teacherID,defenseJuryID) {
      var body = {
        teacherId:teacherID
      }
      request(
        "post",
        `/defense_jury/${defenseJuryID}/deleteTeacher`,
        (res) => {
            console.log(res.data)
            if (res.data.ok) {
                handleToggleTeacher()
              }else if (res.data.err !== ""){
                  setShowSubmitSuccess(true)
                  setErr(res.data.err)
                  setTimeout(
                    () => setErr(""), 
                    5000
                  );
                  
              }
          // setShowSubmitSuccess(true);
        //   history.push(`/thesis/defense_jury/${res.data.id}`);
        },
        {
            onError: (e) => {
                // setShowSubmitSuccess(false);
                console.log(e)
            }
        },
        body
      ).then();
    }
    
        
    const columns = [
        { title: "STT", field: "stt" },
      { title: "Tên giảng viên", field: "teacherName" },
    ];
    useEffect(() => {
    //   getListTeacherOfDefenseJury();
        
      }, []);
  return (
     <Card>
        <MaterialTable
          title={""}
          columns={columns}
          actions={[
            {
              icon: Delete,
              tooltip: "Delete Thesis",
              onClick: (event, rowData) => {
                console.log(rowData.teacherId)
                DeleteTeacherById(rowData.teacherId,defenseJuryID)
                
                // setToggle(true)
              }
            }
          ]}
          data={teacher}
          components={{
            Toolbar: (props) => (
              <div style={{ position: "relative" }}>
                <MTableToolbar {...props} />
                <div
                  style={{ position: "absolute", top: "16px", right: "350px" }}
                >
            
                </div>
              </div>
            ),
          }}
        />
         {(err!=="") ? <Alert severity={(err!=="")?'error':'success'}>{(err!=="")?err:"Successed"}</Alert> : <></> }
      </Card>
  );
}
