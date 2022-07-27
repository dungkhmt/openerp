import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
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
  bodyBox:{
    padding: "0 100px"
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
