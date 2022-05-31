import { Button, Grid, Modal, TextField } from "@material-ui/core";
import React from "react";
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
    const [userId, setUserId] = React.useState("");
    const [nbr, setNbr] = React.useState("");
    const [startDate, setStartDate] = React.useState(new Date());
    const [openAlert,setOpenAlert] = React.useState(false);
    const [showSubmitSuccess,setShowSubmitSuccess] = React.useState(false);
    const handleFormSubmit = (event) => {
        event.preventDefault();
        let body = {
            name: name,
            program_name: program,
            userLoginID: userId,
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
              history.push(`/thesis/defense_jury/${res.data.id}`);
            },
            {
                onError: (e) => {
                    setShowSubmitSuccess(false);
                }
            },
            body
          ).then();
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
                                <TextField onChange={(event) =>{
                                    setProgram(event.target.value)
                                }} 
                                fullWidth={true} id="input-with-icon-grid" 
                                value={program}
                                label="Chương trình đào tạo" />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField onChange={(event) => {
                                    setUserId(event.target.value)
                                }} fullWidth={true} 
                                value={userId}
                                id="input-with-icon-grid" label="Người tạo" />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField onChange={(event) => {
                                    setThesisPlanName(event.target.value)
                                }} fullWidth={true} 
                                value={thesisPlanName}
                                id="input-with-icon-grid" label="Tên kế hoạch bảo vệ luận văn" />
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