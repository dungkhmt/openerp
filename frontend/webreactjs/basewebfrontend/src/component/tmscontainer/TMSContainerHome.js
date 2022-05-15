import { Button, Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core/";
import { grey } from "@material-ui/core/colors";
import MaterialTable from "material-table";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart } from "../../api";
import { localization } from "../../utils/MaterialTableUtils";
import RouteDetail from "./RouteDetail";
const cellStyles = { headerStyle: { padding: 8 }, cellStyle: { padding: 8 } };
export default function TMSContainerHome() {
  const [filename, setFilename] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [selectedOrders, setSelectedOrders] = React.useState(null);

  const dispatch = useDispatch();
  const [routes, setRoutes] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const token = useSelector((state) => state.auth.token);

  const columns = [
    { title: "Index", field: "index", ...cellStyles },
    { title: "Truck", field: "truck.code", ...cellStyles },
    { title: "Số điểm", field: "nbStops", ...cellStyles },
    { title: "Độ dài", field: "travelTime", ...cellStyles },
    {
      title: "",
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            showRouteDetail(rowData["index"]);
          }}
        >
          Detail
        </IconButton>
      ),
      ...cellStyles,
    },
  ];

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let body = {
      planId: "null",
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", filename);

    authPostMultiPart(dispatch, token, "/tmscontainer/solve", formData)
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);
        setRoutes(res.truckRoutes);
        //var f = document.getElementById("selected-upload-file");
        //f.value = null;
        //setSelectedFile(null);
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
      });
  };

  const onInputChange = (event) => {
    let name = event.target.value;
    setFilename(name);
  };
  function onFileChange(event) {
    setFilename(event.target.files[0]);
    console.log(event.target.files[0].name);
  }
  function showRouteDetail(id) {
    //alert("detail " + id);
    setSelectedRoute(routes[id - 1].nodes);
    //setSelectedOrders(routes[id - 1].servedOrders);
    setIsOpen(true);
  }

  return (
    <div>
      TMSContainerHome
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={2}>
            <Button
              color="primary"
              type="submit"
              onChange={onInputChange}
              width="100%"
            >
              UPLOAD
            </Button>
          </Grid>

          <input
            type="file"
            id="selected-upload-file"
            onChange={onFileChange}
          />
        </Grid>
      </form>
      <div>
        <MaterialTable
          title={"Danh sách routes"}
          columns={columns}
          data={routes}
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
            rowStyle: (rowData) => ({
              backgroundColor: rowData.tableData.checked
                ? grey[200]
                : "#FFFFFF",
            }),
          }}
          onSelectionChange={(rows) => {
            setSelectedRows(rows);
          }}
        />
        <RouteDetail
          open={isOpen}
          setOpen={setIsOpen}
          route={selectedRoute}
          //orders={selectedOrders}
        />
      </div>
    </div>
  );
}
