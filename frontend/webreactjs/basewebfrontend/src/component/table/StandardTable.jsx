import { Box, Typography } from "@material-ui/core/";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import TertiaryButton from "component/button/TertiaryButton";
import MaterialTable, { MTableToolbar } from "material-table";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { components, localization, themeTable } from "utils/MaterialTableUtils";

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

function StandardTable(props) {
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <>
      <Box
        width="100%"
        height={40}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        borderBottom={1}
        mt={-3}
        mb={3}
        style={{ borderColor: "#e8e8e8" }}
      >
        {props.commandBarComponents}
        {selectedRows.length > 0 && (
          <>
            <TertiaryButton
              className={classes.commandButton}
              color="default"
              startIcon={<DeleteRoundedIcon />}
              onClick={() => {
                if (props.onDeleteRow) props.onDeleteRow(selectedRows);
              }}
            >
              Xoá
            </TertiaryButton>
            <Typography
              component="span"
              style={{ marginLeft: "auto", marginRight: 32 }}
            >{`Đã chọn ${selectedRows.length} mục`}</Typography>
          </>
        )}
      </Box>
      <MuiThemeProvider theme={themeTable}>
        <MaterialTable
          {...props}
          localization={{
            ...localization,
            toolbar: { ...localization.toolbar, nRowsSelected: "" },
            ...props.localization,
          }}
          options={{
            selection: true,
            pageSize: 20,
            headerStyle: {
              backgroundColor: "transparent",
            },
            rowStyle: (rowData) => ({
              backgroundColor: rowData.tableData.checked
                ? "#e0e0e0"
                : "#ffffff",
            }),
            ...props.options,
          }}
          onSelectionChange={(rows) => {
            setSelectedRows(rows);
            if (props.onSelectionChange) props.onSelectionChange(rows);
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
            ...props.components,
          }}
        />
      </MuiThemeProvider>
    </>
  );
}
// options can xem ky hon
StandardTable.propTypes = {
  onDeleteRow: PropTypes.func,
  localization: PropTypes.object,
  options: PropTypes.object,
  onSelectionChange: PropTypes.func,
  components: PropTypes.object,
  title: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array,
};

export default StandardTable;
