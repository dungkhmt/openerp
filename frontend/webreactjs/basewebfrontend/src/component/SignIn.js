import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { useRouteState } from "../state/RouteState";

/*
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Phạm Quang Dũng
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
*/
const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    padding: 20,
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(12),
    height: theme.spacing(8),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  container: {
    display: "flex",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    flexDirection: "row-reverse",
  },
  image: {
    position: "absolute",
    width: "100vw",
    maxHeight: "100vh",
  },
  wrapper: {
    background: "white",
  },
  submitBtnWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  submitBtn: {
    margin: theme.spacing(3, 0, 2),
    height: 40,
    width: 160,
    borderRadius: 20,
    textTransform: "none",
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "green",
    },
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -8,
    marginLeft: -12,
  },
}));

export default function SignIn(props) {
  const history = useHistory();
  const classes = useStyles();

  //
  const { currentRoute } = useRouteState();

  //
  const [userName, setUserName] = useState(""); // new State (var) userName
  const [password, setPassword] = useState(""); // new State (var) password
  const [isTyping, setIsTyping] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [loggedInSuccessfully, setLoggedInSuccessfully] = useState(false);

  //
  const handleUserNameChange = (event) => {
    setIsTyping(true);
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setIsTyping(true);
    setPassword(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRequesting(true);
    setIsTyping(false);

    props.requestLogin(
      userName,
      password,
      () => {
        setLoggedInSuccessfully(true);
      },
      {
        onError: () => {
          setIsRequesting(false);
        },
      }
    );
  };

  if (loggedInSuccessfully) {
    props.getScreenSecurityInfo(history);

    if (currentRoute.get()) {
      history.replace(currentRoute.get());
      return null;
    } else
      return (
        <Redirect to={{ pathname: "/", state: { from: history.location } }} />
      );
  } else
    return (
      <div className={classes.container}>
        <img
          alt="Welcome"
          src="/static/images/welcome.jpg"
          className={classes.image}
        />
        <div className={classes.paper}>
          {/* <img
          // alt="Hust"
          // className={classes.avatar}
          // src={process.env.PUBLIC_URL + "/soict-logo.png"}
          /> */}
          <Typography
            component="h1"
            variant="h4"
            style={{ position: "relative" }}
          >
            Đăng nhập
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            {props.errorState === true && isTyping === false ? (
              <Typography variant="overline" display="block" color="error">
                {props.errorMsg}
              </Typography>
            ) : (
              ""
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user"
              label="User Name"
              name="user"
              onChange={handleUserNameChange}
              error={
                isTyping === false &&
                props.errorState !== null &&
                props.errorState === true
              }
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handlePasswordChange}
              error={
                isTyping === false &&
                props.errorState !== null &&
                props.errorState === true
              }
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

            <div className={classes.submitBtnWrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={isRequesting}
                type="submit"
                className={classes.submitBtn}
              >
                LogIn
              </Button>
              {isRequesting && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>

            {/* <Grid item xs>
                
                <Link href="#" variant="body2" style = {{position:"relative"}}>
                  Quên mật khẩu?
                </Link>
              </Grid> */}

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Link
                component={NavLink}
                to={process.env.PUBLIC_URL + "/user/register"}
                variant="body2"
                style={{ position: "relative", fontSize: "18px" }}
              >
                {"Sign Up"}
              </Link>
              <Link
                component={NavLink}
                to={process.env.PUBLIC_URL + "/user/forgetpassword"}
                variant="body2"
                style={{ position: "relative", fontSize: "18px" }}
              >
                {"Forget Password"}
              </Link>
            </div>
            <div>
              <Typography
                component="h1"
                variant="h6"
                style={{ position: "relative" }}
              >
                (Contact: dungkhmt@gmail.com)
              </Typography>
            </div>
            {/* <Box mt={2} className={classes.cp}>
                <Copyright />
              </Box> */}
          </form>
        </div>
      </div>
    );
}
