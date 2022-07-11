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

  
  function DefenseJury() {
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const history = useHistory();
    const [jurys, setJurys] = useState([]);
  
    const [open, setOpen] = React.useState(false);
    const [searchString, setSearchString] = React.useState("");
  
    const columns = [
        { title: "ID", field: "id" },
      { title: "Tên HD", field: "name" },
      { title: "Người tạo", field: "userLoginId" },
      {title:"Ngày tạo",field:"createdTime"},
    ];
  
    async function getAllDefenseJury() {
      request(
        // token,
        // history,
        "GET",
        "/defense_jurys",
        (res) => {
            console.log(res.data)
          setJurys(res.data.DefenseJurys);
        }
      );
    }
  
    const handleModalOpen = () => {
      history.push({
        pathname: `/thesis/defense_jury/create`,
        state: {
           
        },
      });
    };
  
    const handleModalClose = () => {
      setOpen(false);
    };
   
  
    useEffect(() => {
      getAllDefenseJury();
    }, []);
  
    return (
      <Card>
        <MaterialTable
          title={"Danh sách HD Bao ve"}
          columns={columns}
          data={jurys}
          // onRowClick = {(event,rowData) => {
          //       console.log(rowData)
          //       history.push({
          //       pathname: `/thesis/defense_jury/${rowData.id}`,
          //       state: {
          //           defenseJuryId: rowData.id,
          //       },
          //     });
          //     }}
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
  
        {/* <CreateClassTeacherAssignmentPlanModal
          open={open}
          onClose={handleModalClose}
          onCreate={customCreateHandle}
        /> */}
      </Card>
    );
  }
  
  export default DefenseJury;
  