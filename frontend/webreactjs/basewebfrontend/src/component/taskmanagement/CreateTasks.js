import React, { useEffect, useState } from "react";
// import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button } from "@mui/material";
import { request } from "../../api";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function CreateTask() {
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [persons, setPersons] = useState([]);
    const [projects, setProjects] = useState([]);

    const [categoryForm, setCategoryForm] = useState("");
    const [taskNameForm, setTaskNameForm] = useState("");
    const [taskDescriptionForm, setTaskDescriptionForm] = useState("");
    const [assignedForm, setAssignedForm] = useState("");
    const [priorityForm, setPriorityForm] = useState("");
    const [dateForm, setDateForm] = useState("");
    const [fileForm, setFileForm] = useState(null);
    const [projectForm, setProjectForm] = useState("");


    useEffect(() => {
        request('get', 'http://localhost:8080/api/task-categories', res => {
            setCategories(res.data);
        }, err => {
            console.log(err);
        });

        request('get', 'http://localhost:8080/api/task-priorities', res => {
            setPriorities(res.data);
        }, err => {
            console.log(err);
        });

        request('get', 'http://localhost:8080/api/task-persons', res => {
            setPersons(res.data);
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
            "name": taskNameForm,
            "description": taskDescriptionForm,
            "dueDate": dateForm,
            "attachmentPaths": "20210120233740-SoICT-PPT-template-hoi-thao-online.pptx",
            "projectId": projectForm,
            "statusId": "TASK_INPROGRESS",
            "priorityId": priorityForm,
            "categoryId": categoryForm,
            "partyId": assignedForm
        };
        

        request(
            "post",
            `http://localhost:8080/api/projects/${projectForm}/tasks`,
            (res) => {
                console.log(res.data);
                setOpen(true);
            },
            {},
            data
        );
    }

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

    return (
        <>
            <div className="pt-3 px-2">
                <div className="p-3" style={{ backgroundColor: "#FFF", boxShadow: "0 4px 8px rgba(0,0,0,0.07)" }}>
                    <h3>Tạo mới nhiệm vụ</h3>

                    <div className="mb-4 row" >
                        <div className="col-3">
                            <select className="form-select" style={{ backgroundColor: "#eee" }} value={categoryForm} onChange={(e) => setCategoryForm(e.target.value)}>
                                <option defaultChecked>Choose...</option>
                                {categories.map((item) => (
                                    <option value={item.categoryId} key={item.categoryId}>{item.categoryName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <input type="text" className="form-control" placeholder="Tên nhiệm vụ..." style={{ backgroundColor: "#eee" }} value={taskNameForm} onChange={(e) => setTaskNameForm(e.target.value)} />
                    </div>

                    <div className="p-3 mb-4" style={{ borderRadius: "15px 15px", backgroundColor: "#EEE", boxShadow: "0 0 5px 0px" }}>
                        <div className="form-floating mb-3">
                            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: "100px" }} value={taskDescriptionForm} onChange={(e) => setTaskDescriptionForm(e.target.value)}></textarea>
                            <label for="floatingTextarea2">Mô tả</label>
                        </div>
                        <div className="row mb-3">
                            <div className="col-5 me-3 row">
                                <div className="col-4">Status</div>
                                <div className="col-8">Open</div>
                            </div>
                            <div className="col-5 row">
                                <div className="col-4">Assignee</div>
                                <div className="col-8">
                                    <select className="form-select" value={assignedForm} onChange={(e) => setAssignedForm(e.target.value)}>
                                        <option defaultChecked>Choose...</option>
                                        {persons.map((item) => (
                                            <option value={item.partyId} key={item.partyId}>{item.fullName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-5 me-3 row">
                                <div className="col-4">Priority</div>
                                <div className="col-8">
                                    <select className="form-select" value={priorityForm} onChange={(e) => setPriorityForm(e.target.value)}>
                                        <option defaultChecked>Choose...</option>
                                        {priorities.map((item) => (
                                            <option value={item.priorityId} key={item.priorityId}>{item.priorityName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-5 row mb-3">
                                <div className="col-4">Due Date</div>
                                <div className="col-8">
                                    <input type="date" className="form-control" name="due-date" value={dateForm} onChange={(e) => setDateForm(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-5 row">
                                <div className="col-4">Project</div>
                                <div className="col-8">
                                    <select className="form-select" value={projectForm} onChange={(e) => setProjectForm(e.target.value)}>
                                        <option defaultChecked>Choose...</option>
                                        {projects.map((item) => (
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 mb-4" style={{ borderRadius: "15px 15px", backgroundColor: "#EEE", boxShadow: "0 0 5px 0px" }}>
                        <div className="form-group row">
                            <div className="form-label col-2">Thêm tệp đính kèm</div>
                            <input type="file" name="file_attack" className="col-5" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button className="btn btn-primary" variant="contained" onClick={handleSubmit}>Submit</Button>
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
