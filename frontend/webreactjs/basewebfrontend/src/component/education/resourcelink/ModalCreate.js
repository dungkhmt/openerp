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
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";

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

export default function ModalCreate({ open, handleClose }) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  // const toastId = React.useRef(null);

  const createDomain = () => {
    const data = JSON.stringify({ name: name });
    axiosPost(token, "/domain", data)
      .then((res) => {
        console.log("crean, domain ", res.data);
        if (res.data == true) {
          setAlertContent("Create susscessed");
          setAlert(true);
        }
      })
      .catch((error) => {
        setAlertContent("Create failed");
        setAlert(true);
      });
  };
  const handleSubmit = () => {
    createDomain();
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
            <CardHeader title="Thêm nguồn tham khảo" />
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <TextField
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Tên nguồn tham khảo"
                />
              </Box>
            </CardContent>
            <CardActions className={classes.action}>
              <Button type="submit" variant="contained" color="primary">
                Thêm
              </Button>
              {alert ? <Alert severity="error">{alertContent}</Alert> : <></>}
            </CardActions>
          </Card>
        </form>
      </Fade>
    </Modal>
  );
}
