import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { request } from "../../../api";

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

function ResourceDomainEdit(props) {
  const history = useHistory();
  const classes = useStyles();

  const [name, setName] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [open, setOpen] = useState(true);
  const params = useParams();
  const columns = [{ field: "name", title: "Name" }];

  const [domain, setDomain] = useState([]);
  // Functions.
  const createDomain = () => {
    const data = JSON.stringify({ name: name });
    request(
      "patch",
      `/domain/${params.id}`,
      (res) => {
        console.log("crean, domain ", res.data);
        if (res.data != null) {
          setAlertContent("Edit susscessed");
          setAlert(true);
        }
      },
      {
        onError: (e) => {
          setAlertContent("Edit failed");
          setAlert(true);
        },
      },
      data
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
            >
              {/* <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem> */}
            </TextField>
          </div>
        </form>
      </CardContent>
      {alert ? (
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        ></Alert>
      ) : (
        <></>
      )}
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

export default ResourceDomainEdit;
