import React, { useState, useEffect } from "react";
import { request } from "../../api";
import {
    Box,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    FormHelperText
} from "@mui/material";
import {
    boxComponentStyle,
    boxChildComponent
} from "./ultis/constant";
import { useHistory } from "react-router";
import BasicAlert from "./alert/BasicAlert";
import { useForm } from "react-hook-form";

const AddUserToProject = () => {

    const history = useHistory();
    const { register, errors, handleSubmit, watch, setValue } = useForm();

    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);

    // const [personIdForm, setPersonIdForm] = useState("");
    // const [projectIdForm, setProjectIdForm] = useState("");

    const [typeAlert, setTypeAlert] = useState("success");
    const [message, setMessage] = useState("Đã thêm mới thành công");

    useEffect(() => {
        request('get', '/task-persons', res => {
            setMembers(res.data);
        }, err => {
            console.log(err);
        });

        request('get', '/projects', res => {
            setProjects(res.data);
        }, err => {
            console.log(err);
        });
    }, []);

    const onSubmit = (data) => {
        request(
            "post",
            `/projects/${data.projectId}/members`,
            (res) => {
                console.log(res.data);
                setOpen(true);
                setTypeAlert("success");
                setMessage("Đã thêm mới thành công");
                setTimeout(() => {
                    history.push(`/taskmanagement/project/${data.projectId}/tasks`);
                }, 1000);
            },
            (err) => {
                console.log(err);
                setOpen(true);
                setTypeAlert("error");
                setMessage(err);
            },
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
            <Box sx={boxComponentStyle}>
                <Typography variant="h4" mb={4}>
                    Thêm thành viên cho dự án
                </Typography>
                <Box sx={boxChildComponent}>
                    {/* <Grid container spacing={2}>
                        <Grid item={true} xs={4}>
                            <Typography variant="h6">
                                Danh sách thành viên
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={4}>
                            <Typography variant="h6">
                                Danh sách dự án
                            </Typography>
                        </Grid>
                    </Grid> */}
                    <Grid container spacing={2} mb={3}>
                        <Grid item={true} xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px" }} >Danh sách thành viên</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Danh sách thành viên"
                                    ref={register("partyId", {
                                        required: "Trường này được yêu cầu"
                                    })}
                                    defaultValue=""
                                    onChange={(e) => setValue('partyId', e.target.value)}
                                    error={!!errors.partyId}
                                >
                                    {members.map((item) => (
                                        <MenuItem key={item.partyId} value={item.partyId}>{item.fullName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.partyId?.message && (
                                <FormHelperText error={true}>
                                    {errors.partyId.message}
                                </FormHelperText>
                            )}
                        </Grid>
                        <Grid item={true} xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px" }} >Danh sách dự án</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Danh sách dự án"
                                    ref={register("projectId", {
                                        required: "Trường này được yêu cầu"
                                    })}
                                    defaultValue=""
                                    onChange={(e) => setValue('projectId', e.target.value)}
                                    error={!!errors.projectId}
                                >
                                    {projects.map(item => (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.projectId?.message && (
                                <FormHelperText error={true}>
                                    {errors.projectId.message}
                                </FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                    <Box mb={2}>
                        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Submit</Button>
                        <Typography variant="caption" color="success" px={3}>
                            Invited users will be added to these teams
                            nghiatitan All Members
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <BasicAlert
                openModal={open}
                handleClose={handleClose}
                typeAlert={typeAlert}
                message={message}
            />
        </>
    );
}

export default AddUserToProject;