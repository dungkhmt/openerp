import {
  MenuItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { request } from "../../../../api";
import StandardTable from "../../../../component/table/StandardTable";
import {makeStyles} from "@material-ui/core/styles";
import {defaultDatetimeFormat} from "../../../../utils/dateutils";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";

const useStyles = makeStyles(theme => ({
  teacherUpdateClassPermissionsDlg: {
    '& .MuiDialog-paperWidthLg': {
      minWidth: '800px'
    }
  },
  permissionAssignContainer: {
    margin: '10px 0',
    display: "flex",
    columnGap: '20px',
    alignItems: 'center'
  },
  permissionInput: {
    minWidth: '300px',
    flexGrow: 1
  }
}))

export default function TClassUpdatePopup(props) {
  const { open, setOpen, classId } = props;
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [userLoginRolesOfCurrentClass, setUserLoginRolesOfCurrentClass] = useState([]);
  const [enabledUserLoginIds, setEnabledUserLoginIds] = useState([]);
  const [loginIdInput, setLoginIdInput] = useState({ search: "", selected: null })

  const userLoginRolesColumns = [
    { field: "userLoginId", title: "User login id" },
    { field: "roleId", title: "Vai trò"},
    { field: "fromDate", title: "Ngày cấp quyền",
      render: permission => (
        <Typography>
          {defaultDatetimeFormat(permission.fromDate)}
        </Typography>
      )
    },
    { field: "", title: "",
      cellStyle: {
        width: '100px'
      },
      headerStyle: {
        width: '100px'
      },
      render: permission => (
        <Button variant="outlined">Revoke</Button>
      )
    }
  ]
  const classes = useStyles();

  function revokePermission(classId, userLoginId, roleId) {
    // request("delete", )
  }

  function updateStatus(status) {
    request("get", "/edu/class/update-class-status?classId=" + classId + "&status=" + status).then((res) => {
      setOpen(false);
    });
  }
  function getRoles() {
    request("GET", "/edu/class/get-role-list-educlass-userlogin", (res) => {
      setRoles(res.data);
      console.log("getRoles res = ", res);
    });
  }

  useEffect(getEnabledUserLoginIds, [loginIdInput.search]);

  function getEnabledUserLoginIds() {
    request("GET", `/user-login-ids`, (res) => {
      console.log("User login ids", res);
      setEnabledUserLoginIds(res.data);
    }, null, null, {params: { search: loginIdInput.search }})
  }

  function getUserLoginRolesOfCurrentClass() {
    request("GET", `/edu/class/${classId}/user-login-roles`, (res) => {
      console.log("User login role of class", classId, res);
      setUserLoginRolesOfCurrentClass(res.data);
    })
  }

  useEffect(getUserLoginRolesOfCurrentClass, [])

  function performUpdateRole() {
    let body = {
      classId: classId,
      userLoginId: loginIdInput.selected,
      roleId: selectedRole,
    };
    request(
      "POST",
      "edu/class/add-class-user-login-role",
      (res) => {
        //alert("assign teacher to class " + res.data);
        //setIsProcessing(false);
      },
      { 401: () => {} },
      body
    );
  }
  useEffect(() => {
    getRoles();
  }, []);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)} maxWidth="lg"
      className={classes.teacherUpdateClassPermissionsDlg}>
      <DialogTitle>Phân quyền cho giáo viên</DialogTitle>

      <DialogContent>

        <Box>
          <div className={classes.permissionAssignContainer}>
            <Autocomplete
              disablePortal
              id="asynchronous-demo"
              className={classes.permissionInput}
              sx={{ minWidth: 300, flexGrow: 1 }}
              options={enabledUserLoginIds}
              isOptionEqualToValue={(option, value) => option === value}
              getOptionLabel={ (loginId) => loginId }
              onInputChange={ (evt, search) => setLoginIdInput({...loginIdInput, search}) }
              onChange={ (evt, selected) => setLoginIdInput({...loginIdInput, selected }) }
              renderInput={(params) => <TextField {...params} label="Chọn login id" />}
            />


            <TextField
              className={classes.permissionInput}
              style={{ minWidth: "300px", flexGrow: 1 }}
              label="Chọn vai trò"
              required
              select
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((item) => (
                <MenuItem key={item.roleId} value={item.roleId}>
                  {item.description}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="outlined" onClick={performUpdateRole}>Assign</Button>
          </div>
        </Box>

        <Card>
          <CardContent>
            <StandardTable
              classes={"permissionTable"}
              title="Các quyền đã cấp"
              columns={userLoginRolesColumns}
              data={userLoginRolesOfCurrentClass}
              hideCommandBar
              options={{
                search: true,
                paging: false,
                selection: false
              }}
            />
          </CardContent>
        </Card>

        <DialogActions>
          <Button onClick={() => updateStatus("HIDDEN")}>Hide</Button>
          <Button onClick={() => updateStatus("OPEN")}>Open</Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>

      </DialogContent>
    </Dialog>
  );
}
