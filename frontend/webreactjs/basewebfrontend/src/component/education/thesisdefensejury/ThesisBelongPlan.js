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

  
  function ThesisBelongPlan(props) {
    const defensePlanId = props.defensePlanId; 
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const history = useHistory();
    const [thesiss, setThesiss] = useState([]);
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
  
    const handleModalClose = () => {
      setOpen(false);
    };
   
  
    useEffect(() => {
        getAllThesisBelongPlan();
    }, []);
  
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
  
      </Card>
    );
  }
  
  export default ThesisBelongPlan;
  