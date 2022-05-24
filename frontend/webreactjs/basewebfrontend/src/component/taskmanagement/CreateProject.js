import React from "react";
import { Button } from "@mui/material";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateProject() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = () => {
    let data = { name, code }
    axios.post("http://localhost:8080/api/projects", data, {
      auth: {
        username: "admin",
        password: "sscm@123456"
      }
    })
      .then(res => {
        console.log(res.data);
        setOpen(true);
      })
  }

  return (
    <>
      <div className="pt-3 px-2">
        <div className="p-3" style={{ backgroundColor: "#FFF", boxShadow: "0 4px 8px rgba(0,0,0,0.07)" }}>
          <h3 className="mb-5">Thêm mới project</h3>
          <div className="">
            <div className="form">
              <div className="form-group mb-3">
                <div className="form-label">
                  Tên dự án *
                </div>
                <input type="text" className="form-control" placeholder="Điền tên dự án..." value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group mb-3">
                <div className="form-label">
                  Mã dự án *
                </div>
                <input type="text" className="form-control" placeholder="Điền mã dự án..." value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="p-2 mb-5" style={{ backgroundColor: "#EEE" }}>
                The project key is a unique identifier for a project. A short, concise key is recommended.
                (e.g. Project name Backlog has project key BLG_2) Uppercase letters (A-Z), numbers (0-9) and underscore (_) can be used.
              </div>
              <Button className="btn btn-primary" variant="contained" onClick={onSubmit} >Submit</Button>
            </div>
          </div>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Đã thêm mới thành công
            </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
}
