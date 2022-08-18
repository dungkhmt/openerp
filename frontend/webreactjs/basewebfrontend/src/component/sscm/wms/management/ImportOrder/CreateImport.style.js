import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  label: {
    padding: "4px 0",
  },
  removeIconBox:{
    "& :hover":{
      color: "#D23",
    }
  },
  removeIcon:{
    color: "#CCC",
    fontSize: '32px !important',
    cursor:"pointer",
  },
  bodyBox:{
    padding: "0 160px"
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
  tableBody:{
    "& .MuiTableCell-sizeSmall": {
      padding: "10px 10px 10px 16px",
    },
  },
  inputEnd:{
    "& .MuiInputBase-input": {
      textAlign: "end" 
    },
  },


  // 
  table:{
    color: "#FFF",
  },
  productPage:{
    // padding: "0 150px",
  },
  headerBox:{
    backgroundColor: "#FFF",
    marginBottom: 30,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    borderRadius: 3,
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
  },
  formWrap:{
    width: "100%",
    marginBottom: 24,
    borderRadius: 3,
    // backgroundColor: "#FFF",
  },
  inforWrap:{
    padding: "16px 24px",
  },
  boxInfor:{
    backgroundColor: "#FFF",
    marginBottom: 40,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    borderRadius: 3,
    },
  inforTitle:{
    padding: "8px",
    // paddingBottom: 8,
    borderBottom: "1px solid #E8EAEB",
  },
  labelInput:{
    marginBottom: 8,
    fontSize: 16,
  },
  radio:{
    color: "#aaa",
    '&.Mui-checked': {
      color: "#1976d2",
    },
  },
  switch:{
    marginLeft: 50,
    color: "#aaa",
    '& .Mui-checked': {
      color: "#1976d2",
    },
    "& .Mui-checked + .MuiSwitch-track":{
      // color: "#1976d2",
      backgroundColor: "#1976d2"
    }
  },
  titleWrap:{
    display:"flex",
    flexWrap:"wrap",
    alignItems: "center",
    borderBottom: "1px solid #E8EAEB",
  },
  labelOptInput:{
    fontWeight: 500,
    marginBottom: 8,
  },
  inputRight:{
    "& .MuiOutlinedInput-input":{
      textAlign: "right",
    },
  },
})
)
export default useStyles;
