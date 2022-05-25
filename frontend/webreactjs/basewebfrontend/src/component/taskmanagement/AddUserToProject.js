import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { request } from "../../api";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddUserToProject = () => {

    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);

    const [personIdForm, setPersonIdForm] = useState("");
    const [projectIdForm, setProjectIdForm] = useState("");

    useEffect(() => {
        request('get', 'http://localhost:8080/api/task-persons', res => {
            setMembers(res.data);
        }, err => {
            console.log(err);
        });

        request('get', 'http://localhost:8080/api/projects', res => {
            setProjects(res.data);
        }, err => {
            console.log(err);
        });
    }, []);

    const handleSubmit = () => {
        const data = {
            "projectId": projectIdForm,
            "partyId": personIdForm
        };


        request(
            "post",
            `http://localhost:8080/api/projects/${projectIdForm}/members`,
            (res) => {
                console.log(res.data);
                setOpen(true);
            },
            {},
            data
        );
    }

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <div className="pt-3 px-2">
                <div className="p-3" style={{ backgroundColor: "#FFF", boxShadow: "0 4px 8px rgba(0,0,0,0.07)" }}>
                    <h3 className="mb-4">Thêm thành viên cho dự án</h3>
                    <div className="p-3">
                        <div className="row">
                            <div className="col-12 p-3" style={{ borderRadius: "15px 15px", backgroundColor: "#EEE", boxShadow: "0 0 5px 0px" }}>
                                <div className="row mb-3">
                                    <div className="col-4">Chọn thành viên</div>
                                    <div className="col-4">Chọn dự án</div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4">
                                        <select className="form-select" value={personIdForm} onChange={(e) => setPersonIdForm(e.target.value)}>
                                            {members.map((item) => (
                                                <option value={item.partyId} key={item.partyId}>{item.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <select className="form-select" value={projectIdForm} onChange={(e) => setProjectIdForm(e.target.value)}>
                                            {projects.map((item) => (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3 d-flex align-items-center">
                                    <Button className="btn btn-primary me-3" variant="contained" onClick={handleSubmit}>Submit</Button>
                                    <div className="text-danger">Invited users will be added to these teams
                                        nghiatitan All Members</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Đã thêm mới thành công
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddUserToProject;