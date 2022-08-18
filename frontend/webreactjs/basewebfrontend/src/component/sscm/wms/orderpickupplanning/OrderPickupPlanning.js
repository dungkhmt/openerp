import { Button, Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core/";
import { grey } from "@material-ui/core/colors";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart } from "../../../../api";
import {
  components,
  localization,
  themeTable,
} from "../../../../utils/MaterialTableUtils";
import RouteDetail from "./RouteDetail";

const cellStyles = { headerStyle: { padding: 8 }, cellStyle: { padding: 8 } };
const useStyles = makeStyles((theme) => ({
  commandButton: {
    marginLeft: theme.spacing(2),
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  tableToolbarHighlight: { backgroundColor: "transparent" },
}));

function OrderPickupPlanning() {
  const [filename, setFilename] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const dispatch = useDispatch();
  const [routes, setRoutes] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [selectedOrders, setSelectedOrders] = React.useState(null);

  const columns = [
    { title: "Mã Route", field: "index", ...cellStyles },
    { title: "Số điểm", field: "numberPoints", ...cellStyles },
    { title: "Độ dài", field: "length", ...cellStyles },
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

  function showRouteDetail(id) {
    //alert("detail " + id);
    setSelectedRoute(routes[id - 1].routeElements);
    setSelectedOrders(routes[id - 1].servedOrders);
    setIsOpen(true);
  }
  const handleFormSubmit = (event) => {
    event.preventDefault();
    let body = {
      planId: "null",
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", filename);

    authPostMultiPart(
      dispatch,
      token,
      "/upload-excel-order-pickup-planning",
      formData
    )
      .then((res) => {
        setIsProcessing(false);
        setRoutes(res.routes);
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
  }

  return (
    <div>
      Order Pickup Planning
      <div>
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
      </div>
      <div>
        <MuiThemeProvider theme={themeTable}>
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
            components={{
              ...components,
              Toolbar: (props) => (
                <MTableToolbar
                  {...props}
                  classes={{
                    highlight: classes.tableToolbarHighlight,
                  }}
                  searchFieldVariant="outlined"
                  searchFieldStyle={{
                    height: 40,
                  }}
                />
              ),
            }}
          />
        </MuiThemeProvider>
        <RouteDetail
          open={isOpen}
          setOpen={setIsOpen}
          route={selectedRoute}
          orders={selectedOrders}
        />
      </div>
    </div>
  );
}
export default OrderPickupPlanning;
