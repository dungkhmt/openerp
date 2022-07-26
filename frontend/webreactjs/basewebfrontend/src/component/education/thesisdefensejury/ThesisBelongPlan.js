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
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { authPost, authGet, authPostMultiPart } from "../../../api";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router";
  import MaterialTable, { MTableToolbar } from "material-table";
  import { Link } from "react-router-dom";
  import AddIcon from "@material-ui/icons/Add";
  import { request } from "../../../api";
  import ModalLoading from "./ModalLoading"
  import ModalDelete from "./ModalDelete"
  import Delete from '@material-ui/icons/Delete';
  import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

  
  function ThesisBelongPlan(props) {
    const defensePlanId = props.defensePlanId; 
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const history = useHistory();
    const [toggle,setToggle] = useState(false)
    const [thesiss, setThesiss] = useState([]);
    const [thesisId, setThesisId] = useState();
    const [loginID, setLoginID] = useState();
    const [openLoading, setOpenLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [searchString, setSearchString] = React.useState("");
  
    const columns = [
        { title: "ID", field: "id" },
      { title: "Tên luận văn", field: "thesisName" },
      { title: "Mô tả", field: "thesisAbstract" },
      {title:"Ngày tạo",field:"createdTime"},
    ];
  
    async function getAllThesisBelongPlan() {
        console.log(defensePlanId)
        setOpenLoading(true);
        request(
          // token,
          // history,
          "GET",
          `/${defensePlanId}/thesisBelongPlan`,
          (res) => {
              console.log(res.data.result)
              setThesiss(res.data.result)
              setOpenLoading(false);
          }
        );
      }
  
    const handleModalOpen = () => {
      history.push({
        pathname: `/thesis/create`,
      });
     
    };
   
    async function DeleteThesisById(thesisID,userLoginID) {
      setOpenLoading(true)
      var body = {
        id:thesisID,
        userLogin:userLoginID
      }
      request(
        "post",
        `/thesis/delete`,
        (res) => {
            console.log(res.data)
            setOpenLoading(false)
            setToggle(!toggle)
            setOpen(false)
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
  
    const handleModalClose = () => {
      setOpen(false);
    };
   
  
    useEffect(() => {
        getAllThesisBelongPlan();
    }, [toggle]);
  
    return (
      <Card>
        <MaterialTable
          title={"Danh sách luận văn"}
          columns={columns}
          data={thesiss}
          onRowClick = {(event,rowData) => {
                console.log(rowData)
                history.push({
                pathname: `/thesis/${rowData.id}`,
                state: {
                   
                },
              });
              }}
              actions={[
            {
              icon: Delete,
              tooltip: "Delete Thesis",
              onClick: (event, rowData) => {
                console.log(rowData)
                console.log(rowData.id)
                setThesisId(rowData.id)
                setLoginID(rowData.userLogin)
                setOpen(true)
                // DeleteThesisById(rowData.id,rowData.userLogin)
                
                
              }
            }
          ]}
          components={{
            Toolbar: (props) => (
              <div style={{ position: "relative" }}>
                <MTableToolbar {...props} />
                <div
                  style={{ position: "absolute", top: "16px", right: "350px" }}
                >
                  <Button onClick={handleModalOpen} color="primary">
                    Thêm mới
                  </Button>
                </div>
              </div>
            ),
          }}
        />
        <ModalLoading openLoading={openLoading} />
        <ModalDelete openDelete={open} handleDeleteClose = {handleModalClose}  thesisId={thesisId} userLoginID={loginID} DeleteThesisById={DeleteThesisById}/>
      </Card>
    );
  }
  
  export default ThesisBelongPlan;
  