import { Button, Grid, Modal, TextField } from "@material-ui/core";
import React, { useState, useEffect,useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { SubmitSuccess } from "../programmingcontestFE/SubmitSuccess";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
    KeyboardDatePicker,
    KeyboardTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { authPostMultiPart, request } from "../../../api";
import {Alert} from "@material-ui/lab";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    ListSubheader,
    Typography,
    InputAdornment
  } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const modalStyle = {
    paper: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: 600,
        maxHeight: 600,
        // border: '2px solid #000',
        borderRadius: '5px',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        backgroundColor: 'white',
        zIndex: 999,
        left: '50%',
        top: '50%',
        transform: 'translate(-50% , -50%)',
        padding: '20px 40px'

    }
}

function CreateDefenseJury(props) {
    const history = useHistory();
    const [name, setName] = React.useState("");
    const [program,setProgram] =  React.useState("");
    const [thesisPlanName,setThesisPlanName] = React.useState("");
    const [listProgram,setListProgram] = React.useState([]);
    const [listPlan,setListPlan] = React.useState([]);
    const [userId, setUserId] = React.useState("");
    const [nbr, setNbr] = React.useState("");
    const [startDate, setStartDate] = React.useState(new Date());
    const [openAlert,setOpenAlert] = React.useState(false);
    const [searchText, setSearchText] = useState("");
    const [showSubmitSuccess,setShowSubmitSuccess] = React.useState(false);
    const handleFormSubmit = (event) => {
        event.preventDefault();
        let body = {
            name: name,
            program_name: program,
            // userLoginID: userId,
            maxThesis: nbr,
            thesisPlanName: thesisPlanName,
            defenseDate: startDate,
          };
          setTimeout(
            () => setOpenAlert(true), 
            3000
          );
          request(
            "post",
            "/defense_jury",
            (res) => {
                console.log(res.data)
              setShowSubmitSuccess(true);
            //   history.push(`/thesis/defense_jury/${res.data.id}`);
            },
            {
                onError: (e) => {
                    setShowSubmitSuccess(false);
                }
            },
            body
          ).then();
    }

    async function getAllProgram() {
        request(
          // token,
          // history,
          "GET",
          "/program_tranings",
          (res) => {
              console.log(res.data)
              setListProgram(res.data)
            
          }
        );
      }
      async function getAllPlan() {
        request(
          // token,
          // history,
          "GET",
          "/thesis_defense_plan",
          (res) => {
              console.log("Plan",res.data)
            setListPlan(res.data)
            
          }
        );
    }

    useEffect(() => {
        getAllProgram();
        getAllPlan();
       
    },[])
    const containsText = (text, searchText) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    
    const displayedProgramOptions = useMemo(
        () => listProgram.filter((option) =>  containsText(option.name, searchText)),
        [searchText]
      );
    const displayedPlanOptions = useMemo(
        () => listPlan.filter((option) =>  containsText(option.name, searchText)),
        [searchText]
      );

     
  
      const validateInput = (checkingText) => {
          /* reg exp để kiểm tra xem chuỗi có chỉ bao gồm 10 - 11 chữ số hay không */
          if (checkingText == "" || checkingText == null){
              return { isInputValid: false,
                  errorMessage: 'Trường này không được bỏ trống và không có ký tự đặc biệt'};
          }
          // const regexp = /^[A-Za-z0-9 -]*$/;
          // const checkingResult = regexp.exec(checkingText);
          // if (checkingResult !== null) {
          //     return { isInputValid: true,
          //              errorMessage: ''};
          // } else {
          //     return { isInputValid: false,
          //              errorMessage: 'Trường này không được bỏ trống và không có ký tự đặc biệt'};
          // }
          return { isInputValid: true,
              errorMessage: ''};
      }


    return (
        
            <div style={modalStyle.paper}>
                <h2 id="simple-modal-title">Thêm mới Hội Đồng</h2>
                <div width="100%">
                    <form >
                        <Grid container spacing={1} alignItems="flex-end">
                            
                            <Grid item xs={9}>
                                <TextField 
                                    value={name}
                                    onChange={(event) => {
                                    setName(event.target.value)
                                }} fullWidth={true} id="input-with-icon-grid" label="Tên hội đồng" />
                            </Grid>
                            <Grid item xs={9}>
                                <FormControl fullWidth style={{margin:"2% 0px"}}>
                                        <InputLabel id="search-select-label">Tên chương trình đào tạo</InputLabel>
                                        <Select
                                       
                                        MenuProps={{ autoFocus: false }}
                                        labelId="search-select-label"
                                        id="search-select"
                                        value={program}
                                        label="Options"
                                        onChange={(e) => setProgram(e.target.value)}
                                        onClose={() => setSearchText("")}
                                      
                                        renderValue={() => program}
                                        >
                                       
                                        <ListSubheader>
                                            <TextField
                                            size="small"
                                           
                                            autoFocus
                                            placeholder="Type to search..."
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                                )
                                            }}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key !== "Escape") {
                                                
                                                e.stopPropagation();
                                                }
                                            }}
                                            />
                                        </ListSubheader>
                                        {displayedProgramOptions.map((option, i) => (
                                            <MenuItem key={i} value={option.name}>
                                            {option.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                            </Grid>
                            {/* <Grid item xs={9}>
                                <TextField onChange={(event) => {
                                    setUserId(event.target.value)
                                }} fullWidth={true} 
                                value={userId}
                                id="input-with-icon-grid" label="Người tạo" />
                            </Grid> */}
                            <Grid item xs={9}>
                                <FormControl fullWidth style={{margin:"2% 0px"}}>
                                        <InputLabel id="search-select-label">Tên đợt bảo vệ</InputLabel>
                                        <Select
                                      
                                        MenuProps={{ autoFocus: false }}
                                        labelId="search-select-label"
                                        id="search-select"
                                        value={thesisPlanName}
                                        label="Options"
                                        onChange={(e) => setThesisPlanName(e.target.value)}
                                        onClose={() => setSearchText("")}
                                       
                                        renderValue={() => thesisPlanName}
                                        >
                                        
                                        <ListSubheader>
                                            <TextField
                                            size="small"
                                           
                                            autoFocus
                                            placeholder="Type to search..."
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                                )
                                            }}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key !== "Escape") {
                                              
                                                e.stopPropagation();
                                                }
                                            }}
                                            />
                                        </ListSubheader>
                                        {displayedPlanOptions.map((option, i) => (
                                            <MenuItem key={i} value={option.name}>
                                            {option.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField onChange={(event) => {
                                    setNbr(parseInt(event.target.value, 10))
                                }} fullWidth={true} 
                                    value={nbr}
                                    type="number"
                                    id="input-with-icon-grid" label="Số lượng tối đa Đồ Án" />
                            </Grid>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid item xs={9}>
                            <KeyboardDatePicker
                                format="dd/MM/yyyy"
                                margin="normal"
                                label="Chọn ngày bảo vệ"
                                value={startDate}
                                onChange={(event)=>{
                                    setStartDate(event)
                                }}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                            </Grid>
                            </MuiPickersUtilsProvider>
                            <Grid item xs={2}>
                                <Button color="primary" type="submit" onClick={handleFormSubmit} width="100%">Tạo mới</Button>
                            </Grid>
                            {(openAlert===true)?(<div>
                                {showSubmitSuccess === true ?(<SubmitSuccess
                                showSubmitSuccess={showSubmitSuccess}
                                content={"You have saved defense jury"}
                                />):(<Alert severity="error">Failed</Alert>)}
                                
                            </div>):(<></>)}
                        </Grid>
                    </form>
                </div>
            </div>
       
    );
}

export default CreateDefenseJury;