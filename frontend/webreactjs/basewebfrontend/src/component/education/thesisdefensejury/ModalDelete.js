import {
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Fade,
    makeStyles,
    Modal,
    TextField,
  } from "@material-ui/core";
  import Alert from '@mui/material/Alert';
  import React, { useEffect, useState } from "react";
  import axios from "axios";



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
  

  export default function ModalDelete({ openDelete, handleDeleteClose,thesisId,userLoginID,DeleteThesisById }) {
    const classes = useStyles();
    const [alert,setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');

    const [status,setStatus] = useState(false);
  
    return (
      <Modal
        className={classes.modal}
        open={openDelete}
        onClose={handleDeleteClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDelete}>
            <Card className={classes.card}>
              <CardHeader title="Xoá thesis" />
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                </Box>
              </CardContent>
              <CardActions className={classes.action}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick = {() => {
                    DeleteThesisById(thesisId,userLoginID)
                  }}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick = {handleDeleteClose}
                >
                  Cancel
                </Button>
              
              </CardActions> 
            </Card>
        </Fade>
      </Modal>
    );
  }