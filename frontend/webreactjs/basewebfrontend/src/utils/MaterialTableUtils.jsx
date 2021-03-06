import { Paper } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Remove from "@material-ui/icons/Remove";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { MTableBodyRow, MTableHeader } from "material-table";
import React, { forwardRef } from "react";
import { FcFilledFilter } from "react-icons/fc";

export const components = {
  Container: (props) => (
    <Paper
      {...props}
      elevation={0}
      style={{ backgroundColor: "transparent" }}
    />
  ),

  Row: (props) => (
    <MTableBodyRow
      {...props}
      options={{
        ...props.options,
        selectionProps: {
          ...props.options.selectionProps,
          icon: <RadioButtonUncheckedIcon fontSize="small" />,
          checkedIcon: <CheckCircleIcon fontSize="small" />,
        },
      }}
    />
  ),

  Header: (props) => (
    <MTableHeader
      {...props}
      options={{
        ...props.options,
        headerSelectionProps: {
          ...props.options.headerSelectionProps,
          indeterminateIcon: <RemoveCircleIcon fontSize="small" />,
          icon: <RadioButtonUncheckedIcon fontSize="small" />,
          checkedIcon: <CheckCircleIcon fontSize="small" />,
        },
      }}
    />
  ),
};

export const themeTable = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: green[900],
    },
  },
  overrides: {
    MuiTableRow: {
      root: {
        "&:hover": {
          backgroundColor: "#ebebeb !important",
        },
      },
      head: {
        "&:hover": {
          backgroundColor: "transparent !important",
        },
      },
    },
  },
});

export const localization = {
  body: {
    emptyDataSourceMessage: "Kh??ng c?? b???n ghi n??o ????? hi???n th???",
    addTooltip: "Th??m",
    deleteTooltip: "Xo??",
    editTooltip: "Ch???nh s???a",
    filterRow: { filterPlaceHolder: "", filterTooltip: "L???c" },
    editRow: {
      deleteText: "B???n c?? ch???c ch???n mu???n xo?? b???n ghi n??y kh??ng?",
      cancelTooltip: "Hu???",
      saveTooltip: "L??u",
    },
  },
  grouping: {
    placeholder: "K??o c??c ti??u ?????",
    groupedBy: "???????c nh??m b???i",
  },
  header: {
    actions: "",
  },
  pagination: {
    labelDisplayedRows: "{from}-{to} c???a {count}",
    labelRowsSelect: "h??ng",
    labelRowsPerPage: "B???n ghi/trang",
    firstAriaLabel: "Trang ?????u",
    firstTooltip: "Trang ?????u",
    previousAriaLabel: "Trang tr?????c",
    previousTooltip: "Trang tr?????c",
    nextAriaLabel: "Trang ti???p theo",
    nextTooltip: "Trang ti???p theo",
    lastAriaLabel: "Trang cu???i",
    lastTooltip: "Trang cu???i",
    hover: "pointer",
  },
  toolbar: {
    addRemoveColumns: "Th??m ho???c xo?? c??c c???t",
    nRowsSelected: "{0} h??ng ???????c ch???n",
    showColumnsTitle: "Hi???n th??? c??c c???t",
    showColumnsAriaLabel: "Hi???n th??? c??c c???t",
    exportTitle: "", // incompleted
    searchTooltip: "T??m ki???m",
    searchPlaceholder: "T??m ki???m",
  },
};

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FcFilledFilter {...props} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function changePageSize(totalCount, tableRef) {
  if (totalCount < 6) {
    tableRef.current.dataManager.changePageSize(5);
  } else if (totalCount < 11) {
    tableRef.current.dataManager.changePageSize(10);
  } else {
    tableRef.current.dataManager.changePageSize(20);
  }
}
