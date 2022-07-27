import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  table:{
    color: "#FFF",
  },
  buttonWrap:{
    "& .MuiButton-contained:hover" :{
      backgroundColor : "#1565c0"
    }
  },
  addButton:{
    color: "#FFF",
    backgroundColor: "#1976d2",
    margin: "10px 0",
  },
  imgWrap:{
    "&.MuiTableCell-root":{
      padding: "8px 16px 4px",
    }
  }
})
)
export default useStyles;
