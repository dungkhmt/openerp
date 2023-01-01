import { makeStyles, MuiThemeProvider, styled } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import MaterialTable, { MTableToolbar } from "material-table";
import PropTypes from "prop-types";
import { useCallback } from "react";
import {
  components,
  localization,
  tableIcons,
  themeTable,
} from "utils/MaterialTableUtils";

export const Offset = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const useStyles = makeStyles(() => ({
  tableToolbarHighlight: { backgroundColor: "transparent" },
}));

function StandardTable(props) {
  const classes = useStyles();

  const rowStyle = useCallback(
    (rowData) => ({
      backgroundColor: rowData.tableData.checked ? "#e0e0e0" : "#ffffff",
    }),
    []
  );

  return (
    <>
      {!props.hideCommandBar && (
        <>
          <Box
            sx={{
              width: "100%",
              height: 40,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              borderBottom: "1px solid rgb(224, 224, 224)",
              pl: 2,
              backgroundColor: "#f5f5f5",
              ...props.sx?.commandBar,
            }}
            // className={props.classNames?.commandBar}
          >
            {props.commandBarComponents}
          </Box>
          {/* <Offset /> */}
        </>
      )}
      <MuiThemeProvider theme={themeTable}>
        <MaterialTable
          {...props}
          localization={{
            ...localization,
            toolbar: { ...localization.toolbar, nRowsSelected: props.title },
            ...props.localization,
          }}
          icons={tableIcons}
          options={{
            selection: true,
            pageSize: 20,
            headerStyle: {
              backgroundColor: "transparent",
            },
            rowStyle: rowStyle,
            ...props.options,
          }}
          onSelectionChange={(rows) => {
            props.onSelectionChange(rows);
          }}
          onRowClick={props.onRowClick}
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
            ...props.components,
          }}
        />
      </MuiThemeProvider>
    </>
  );
}

StandardTable.propTypes = {
  hideCommandBar: PropTypes.bool,
  classNames: PropTypes.object,
  localization: PropTypes.object,
  options: PropTypes.object,
  onSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  components: PropTypes.object,
  title: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  commandBarComponents: PropTypes.element,
};

export default StandardTable;
