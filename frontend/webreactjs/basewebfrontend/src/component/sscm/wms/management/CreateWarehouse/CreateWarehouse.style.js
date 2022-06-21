import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  header: {
    boxShadow: "0 3px 5px rgba(57, 63, 72, 0.3)",
    backgroundColor: "#FFF",
  },
  title: {
    padding: 8,
    boxShadow: "0 3px 5px rgba(57, 63, 72, 0.3)",
    backgroundColor: "#FFF",
    textAlign: "center",
    position: "relative",
  },
  boxWrap: {
    border: "1px solid #aaa",
  },
  rootInput: {
    marginRight: 10,
  },
  settingInput: {
    "& .MuiOutlinedInput-input": {
      padding: 8,
      width: "100%",
    }
  },
  shelfInput: {
    borderRadius: 6,
    border: "1px solid #aaa",
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 30,
    width: 30,
    height: 30,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: "#D23",
    "& .MuiButton-label": {
      display: "contents",
    }
  },
  iconColor: {
    color: "#FFF",

  },
  listWrap: {
    overflowY: "auto",
    margin: 0,
    maxHeight: 500,
    padding: 0,
    listStyle: "none",
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  },
  btnSubmit: {
    marginTop: 10,
    padding: "4px 16px",
    backgroundColor: "#0aaaaa",
    position: "absolute",
    right: 20,
  },
  reserBtn: {
    marginLeft: "auto",
    backgroundColor: "#0aaaaa",
    position: "absolute",
    right: 0,
    top: 0,
    padding: "8px",
    cursor: "pointer",
  },
  canvasWrap: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
})
)
export default useStyles;
