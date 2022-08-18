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
  },
  planBox:{
    backgroundColor: "#FFF",
    marginBottom: 30,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    alignItems: "center",
    borderRadius: 3,
  },
  planBoxHeader:{
    backgroundColor: "#1976d2",
    marginBottom: 30,
  },
  inforTitle:{
    borderBottom: "1px solid #E8EAEB",
    padding: "8px",
  },
  inforWrap:{
    padding: "16px 24px",
    height: "100%",
  },
  searchBox:{
    "& .MuiOutlinedInput-root":{
      padding: '0px !important',
    },
    "& .MuiOutlinedInput-root .MuiAutocomplete-input":{
      padding: '10.5px !important',
    },
  },
  tableWrap:{
    minHeight: 200,
    maxHeight: 400,
    overflow: "auto",
    listStyle: "none",
    '&::-webkit-scrollbar': {
      width: '0.3em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#87CEFA',
      outline: '1px solid #87CEFA'
    }
  },
  tablePlanWrap:{
    listStyle: "none",
    '&::-webkit-scrollbar': {
      width: '0.3em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#87CEFA',
      outline: '1px solid #87CEFA'
    }
  },
  tableBody:{
    "& .MuiTableCell-sizeSmall": {
      padding: "10px 24px 10px 16px",
    },
  },
  inputEnd:{
    "& .MuiInputBase-input": {
      textAlign: "end" 
    },
  },
  labelInput:{
    marginBottom: 8,
    fontSize: 16,
    minWidth: 120
  },
  inputWrap:{
    display: "flex",
    alignItems: "center"
  },
  canvasWrap: {
    padding: 20,
    // height: 800,
    // maxHeight: 800,
    width: "100%",
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stageWrap:{
    position:"relative",
    height: "100%",
    width: "100%",
  },
  removeIconBox:{
    "& :hover":{
      color: "#D23",
      backgroundColor: "#FFF"
    }
  },
  removeIcon:{
    color: "#CCC",
    fontSize: '32px !important',
    cursor:"pointer",
  },
})
)
export default useStyles;
