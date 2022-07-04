import {
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Fade,
    Modal,
    TextField,
  } from "@material-ui/core";
  import { makeStyles } from "@material-ui/core/styles";
  import Alert from "@mui/material/Alert";
  import { axiosPost } from "api";
  import React, { useState,useEffect } from "react";
  import { useSelector } from "react-redux";
  import * as yup from "yup";
  import { Link, useHistory } from "react-router-dom";
  import { request } from "../../../api";
  import { SubmitSuccess } from "../programmingcontestFE/SubmitSuccess";
  
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      minWidth: 400,
    },
    action: {
      display: "flex",
      justifyContent: "center",
    },
    error: {
      textAlign: "center",
      color: "red",
      marginTop: theme.spacing(2),
    },
  }));
  
  let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email("Email invalid").required(),
    userLogin: yup.string(),
  });
  
  export default function ModalCreateThesisDefensePlan({ open, handleClose,handleToggle }) {
    const history = useHistory();
    const classes = useStyles();
    const token = useSelector((state) => state.auth.token);
    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [planName, setPlanName] = useState();
    const [id,setId] = useState();
    const [showSubmitSuccess,setShowSubmitSuccess] = React.useState(false);
    const [openAlert,setOpenAlert] = React.useState(false);
    
  
    async function createThesisDefensePlan() {
        let body = {
            name: planName,
            id:id
          };
         
       
        request(
            "post",
            "/thesis_defense_plan",
            (res) => {
                console.log(res.data)
                if(res.data.ok) {
                    setShowSubmitSuccess(true);
                    setOpenAlert(true)
                    
                }else{
                    setShowSubmitSuccess(false);
                    setOpenAlert(true)
                }
                setTimeout(() => {
                    handleClose()
                    handleToggle()
                }, 3000);

              
            
            },
            {
                onError: (e) => {
                    setShowSubmitSuccess(false);
                }
            },
            body
          ).then();
      
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        createThesisDefensePlan();
       
        // history.push({
        //     pathname: `/thesis`,
        //   });
    };
  
    return (
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <form onSubmit={handleSubmit}>
            <Card className={classes.card}>
              <CardHeader title="Thêm đợt bảo vệ mới" />
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <TextField
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    label="ID"
                  />
                   <TextField
                    id="name"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    label="Tên đợt bảo vệ"
                  />
                </Box>
              </CardContent>
              <CardActions className={classes.action}>
                <Button type="submit" variant="contained" color="primary">
                  Thêm
                </Button>
                {/* {alert ? <Alert severity="error">{alertContent}</Alert> : <></>} */}
              </CardActions>
              {(openAlert===true)?(<div>
                                {showSubmitSuccess === true ?(<SubmitSuccess
                                showSubmitSuccess={showSubmitSuccess}
                                content={"Bạn vừa tạo đợt bảo vệ mới thành công"}
                                />):(<Alert severity="error">Thêm mới thất bại</Alert>)}
                                
                            </div>):(<></>)}
            </Card>
          </form>
        </Fade>
      </Modal>
    );
  }
  