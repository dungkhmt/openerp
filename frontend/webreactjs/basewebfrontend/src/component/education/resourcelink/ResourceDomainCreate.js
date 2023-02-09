import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@mui/material/Alert";
import { request } from "api";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

function ResourceDomainCreate(props) {
  const history = useHistory();
  const classes = useStyles();

  const [name, setName] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  // Functions.
  const createDomain = () => {
    request(
      "post",
      "/domain",
      (res) => {
        console.log("crean, domain ", res.data);
        if (res.data == true) {
          setAlertContent("Create susscessed");
          setAlert(true);
        }
      },
      {
        onError: (error) => {
          setAlertContent("Create failed");
          setAlert(true);
        },
      },
      { name: name }
    );
  };

  const handleSubmit = () => {
    createDomain();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Tạo nguồn tham khảo
        </Typography>
        <form className={classes.root} noValidate autoComplete="off">
          <div>
            <TextField
              required
              id="name"
              label="Name"
              value={name}
              fullWidth
              onChange={(event) => {
                setName(event.target.value);
              }}
            ></TextField>
          </div>
        </form>
      </CardContent>
      {alert ? <Alert severity="error">{alertContent}</Alert> : <></>}
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "45px" }}
          onClick={handleSubmit}
        >
          Lưu
        </Button>
        <Button variant="contained" onClick={() => history.push("")}>
          Hủy
        </Button>
      </CardActions>
    </Card>
  );
}

export default ResourceDomainCreate;
