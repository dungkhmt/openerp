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
  import ModalLoading from "./ModalLoading";

  
  function DefenseJuryBelongPlan(props) {
    const defensePlanId = props.defensePlanId; 
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const history = useHistory();
    const [jurys, setJurys] = useState([]);
    const [loading,setLoading] = useState(false)
    const [openLoading, setOpenLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [searchString, setSearchString] = React.useState("");
  
    const columns = [
        { title: "ID", field: "id" },
      { title: "Tên HD", field: "name" },
      { title: "Người tạo", field: "userLoginId" },
      {title:"Ngày tạo",field:"createdTime"},
    ];
  
    async function getAllDefenseJuryBelongPlan() {
      setOpenLoading(true);
      request(
        // token,
        // history,
        "GET",
        `/${defensePlanId}/defenseJurysBelongPlan`,
        (res) => {
            console.log(res.data.result)
            setJurys(res.data.result);
            setOpenLoading(false);
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

    const handlerIsLoad = () => {
      setLoading(true)
    }
    const handlerNotLoad = () => {
      setLoading(false)
    }
   
  
    useEffect(() => {
      getAllDefenseJuryBelongPlan();
    }, []);
  
    return (
      <Card>
        <MaterialTable
          title={"Danh sách HD Bao ve"}
          columns={columns}
          data={jurys}
          onRowClick = {(event,rowData) => {
                console.log(rowData)
                history.push({
                pathname: `/thesis/defense_jury/${rowData.id}`,
                state: {
                    defenseJuryId: rowData.id,
                    defensePlanId:defensePlanId
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
  
  export default DefenseJuryBelongPlan;
  