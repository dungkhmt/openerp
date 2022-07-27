import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({

  headerBox:{
    backgroundColor: "#FFF",
    marginBottom: 30,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    // width: "inherit"
  },
  btnWrap:{
    display: "flex",
  },
  editBtnWrap:{
    marginLeft: 10,
    "& .MuiButton-contained:hover" :{
      backgroundColor : "#1565c0"
    }
  },
  exitBtnWrap:{
    marginLeft: 10,
    "& .MuiButton-contained:hover" :{
      backgroundColor : "#fcdcdc"
    }
  },
  deleteBtnWrap:{
    marginLeft: 10,
    "& .MuiButton-contained:hover" :{
      backgroundColor : "#D32f2f"
    }
  },
  addButton:{
    color: "#FFF",
    backgroundColor: "#1976d2",
    margin: "10px 0",
    textTransform: "none",
  },
  exitBtn:{
    color: "#de4343",
    border: "1px solid #de4343",
    margin: "10px 0",
    textTransform: "none",
  },
  deleteBtn:{
    color: "#FFF",
    backgroundColor: "#de4343",
    margin: "10px 0",
    textTransform: "none",
  },
  label:{
    padding: "4px 0",
  },
  boxInfor:{
    backgroundColor: "#FFF",
    marginBottom: 30,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    alignItems: "center",
    borderRadius: 3,
    // padding: "0 16px",
  },
  inforTitle:{
    borderBottom: "1px solid #E8EAEB",
    padding: "8px",
  },
  inforWrap:{
    padding: "16px 24px",
  },
})
)
export default useStyles;
