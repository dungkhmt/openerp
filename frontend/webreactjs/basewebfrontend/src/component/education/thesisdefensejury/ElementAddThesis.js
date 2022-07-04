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

export default function ElementAddThesis({notBelongThesis,defenseJuryID,toggle,handleToggle,getAllThesisNotBelongToDefenseJury}) {
    const [err,setErr] = useState("");
    const [showSubmitSuccess,setShowSubmitSuccess] = useState(false);
    const [openLoading,setOpenLoading]= useState(false);
   
    async function AddThesisById(thesisID,defenseJuryID) {
      setOpenLoading(true)
      var body = {
        thesisId:thesisID
      }
      request(
        "post",
        `/defense_jury/${defenseJuryID}/addJury`,
        (res) => {
            console.log(res.data)
            if (res.data.ok) {
              handleToggle()
              
            }else if (res.data.err !== ""){
                // setShowSubmitSuccess(true)
                setErr(res.data.err)
                setTimeout(
                  () => setErr(""), 
                  5000
                );
                
            }
            
            setOpenLoading(false)
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
      { title: "Tên luận văn", field: "thesisName" },
      { title: "Người tạo", field: "studentName" },
    ];
    useEffect(() => {
      getAllThesisNotBelongToDefenseJury();
        
      }, []);
  return (
     <Card>
        <MaterialTable
          title={""}
          columns={columns}
          actions={[
            {
                icon: Add,
                tooltip: "Add Thesis",
                onClick: (event, rowData) => {
                  AddThesisById(rowData.id,defenseJuryID)
                  
                }
            }
          ]}
          data={notBelongThesis}
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
       <ModalLoading openLoading={openLoading} />
      </Card>
  );
}
