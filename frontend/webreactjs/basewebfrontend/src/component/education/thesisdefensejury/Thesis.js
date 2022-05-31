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
  import { DataGrid,GridToolbar  } from "@material-ui/data-grid";
  import { request } from "../../../api";

  
  function Thesis() {
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const history = useHistory();
    const [thesis, setThesis] = useState([]);
    const [selectThesiss,setSelectThesiss] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [searchString, setSearchString] = React.useState("");
    const [showSubmitSuccess,setShowSubmitSuccess] = React.useState(false);
    const VISIBLE_FIELDS = ['name', 'thesis_abstract', 'program_name', 'thesisPlanName', 'student_name','supervisor_name','defense_jury_name','keyword'];
    const columns = [
      { headerName: "Tên luan van", field: "name" },
      { headerName: "Mo ta", field: "thesis_abstract" },
      {headerName:"Ten Chuong trinh",field:"program_name"},
      {headerName:"Ten lich bao ve",field:"thesisPlanName"},
      {headerName:"Ten nguoi viet",field:"student_name"},
      {headerName:"Ten nguoi huong dan",field:"supervisor_name"},
      {headerName:"Ten HD",field:"defense_jury_name"},
      {headerName:"Keyword",field:"keyword"},
      {headerName:"Ngay tao",field:"createdTime"},
    ];
  
    async function getAllThesis() {
      request(
        // token,
        // history,
        "GET",
        "/thesis",
        (res) => {
            console.log(res.data.content)
          setThesis(res.data.content);
        }
      );
    }
  
    const handleModalOpen = () => {
      history.push({
        pathname: `/thesis/create`,
      });
      setOpen(true);
    };
  
    const handleModalClose = () => {
      setOpen(false);
    };
    const handleDelete = () => {
      console.log(selectThesiss);
      if (selectThesiss.length >0){
        for(let i=0;i< selectThesiss.length;i++){
          var body = {
            "id":selectThesiss[i].id,
            "userLogin":selectThesiss[i].userLoginID
          }
          console.log(body);
          request(
            "post",
            "/thesis/delete",
            (res) => {
              if (res.data.ok){
                setShowSubmitSuccess(true);
              }else {
                setShowSubmitSuccess(false);
              }
              
            //   history.push(`/thesis/defense_jury/${res.data.id}`);
            },
            {
                onError: (e) => {
                    setShowSubmitSuccess(false);
                }
            },
            body
          ).then();
        }
      }
    }
   
  
    useEffect(() => {
      getAllThesis();
    }, [showSubmitSuccess]);
    useEffect(() => {
       console.log(thesis)
      }, [thesis]);
    
    return (
      // <Card>
      //   <MaterialTable
      //     title={"Danh sách luan van"}
      //     columns={columns}
      //     data={thesis}
      //     checkboxSelection
      //   disableSelectionOnClick
      //     onRowClick = {(event,rowData) => {
      //           console.log(rowData)
      //           // history.push({
      //           // pathname: `/thesis/defense_jury/${rowData.id}`,
      //           // state: {
      //           //     defenseJuryId: rowData.id,
      //           // },
      //       //   });
      //         }}
      //     components={{
      //       Toolbar: (props) => (
      //         <div style={{ position: "relative" }}>
      //           <MTableToolbar {...props} />
      //           <div
      //             style={{ position: "absolute", top: "16px", right: "350px" }}
      //           >
      //             <Button onClick={handleModalOpen} color="primary">
      //               Thêm mới
      //             </Button>
      //           </div>

      //         </div>
      //       ),
      //     }}
      //   />
  
      //   {/* <CreateClassTeacherAssignmentPlanModal
      // //     open={open}
      // //     onClose={handleModalClose}
      // //     onCreate={customCreateHandle}
      // //   /> */}
      //  </Card>
      <div style={{ height: 400, width: '100%' }}>
      <Button  color="primary" onClick={handleDelete}>
        Delete
      </Button>
      <DataGrid
        rows={thesis}
        columns={columns}
        pageSize={5}
        disableColumnFilter={false}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        onSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRowData = thesis.filter((row) =>
            selectedIDs.has(row.id.toString())
          );
         
          setSelectThesiss(selectedRowData);
          console.log(selectThesiss);
        }}
      />
      
    </div>
      
    );
  }
  
  export default Thesis;
  