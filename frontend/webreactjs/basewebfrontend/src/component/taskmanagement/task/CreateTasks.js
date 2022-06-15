import React, { useEffect, useState } from "react";

import { request } from "../../../api";
import {
    boxComponentStyle,
    boxChildComponent,
    Header
} from "../ultis/constant";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
    Box,
    Grid,
    Typography,
    TextField,
    FormHelperText,
    Button,
    MenuItem
} from '@mui/material';

import BasicAlert from "../alert/BasicAlert";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import DateTimePickerBasic from '../datetimepicker/DateTimePickerBasic';
import { ElevatorSharp } from "@mui/icons-material";

export default function CreateTask() {
    const history = useHistory();
    const { projectIdUrl } = useParams();
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [persons, setPersons] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const { register, errors, handleSubmit, watch } = useForm();

    const [categoryId, setCategoryId] = useState("TASK");
    const [priorityId, setPriorityId] = useState("HIGH");
    const [partyId, setPartyId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [dueDate, setDueDate] = useState(new Date());

    const [selectedFile, setSelectedFile] = useState(null);

    const [typeAlert, setTypeAlert] = useState("success");
    const [message, setMessage] = useState("Đã thêm mới thành công");

    useEffect(() => {
        request('get', '/task-categories', res => {
            setCategories(res.data);
        }, err => {
            console.log(err);
        });

        request('get', '/task-priorities', res => {
            setPriorities(res.data);
        }, err => {
            console.log(err);
        });

        if (projectIdUrl) {
            request('get', `/projects/${projectIdUrl}`, res => {
                setProjectName(res.data.name);
            }, err => {
                console.log(err);
            });

            request('get', `/projects/${projectIdUrl}/members`, res => {
                setPersons(res.data);
            }, err => {
                console.log(err);
            });
        } else {
            request('get', '/task-persons', res => {
                setPersons(res.data);
            }, err => {
                console.log(err);
            });

            request('get', '/projects', res => {
                setProjects(res.data);
            }, err => {
                console.log(err);
            });
        }
    }, []);

    const onHandleData = (data, fileId = "") => {
        let projectIdForm = projectIdUrl ? projectIdUrl : projectId;
        const dataForm = {
            ...data,
            partyId,
            categoryId,
            dueDate,
            priorityId,
            attachmentPaths: selectedFile == null ? "Không có tệp đính kèm" : `${selectedFile.name},${fileId}`,
            statusId: "TASK_INPROGRESS",
            projectId: projectId
        };

        request(
            "post",
            `/projects/${projectIdForm}/tasks`,
            (res) => {
                console.log(res.data);
                setOpen(true);
                setTypeAlert("success");
                setMessage("Đã thêm mới thành công");
                setTimeout(() => {
                    history.push(`/taskmanagement/tasks/${res.data.id}`);
                }, 1000);
            },
            (err) => {
                console.log(err);
                setOpen(true);
                setTypeAlert("error");
                setMessage("Đã thêm mới bị lỗi");
            },
            dataForm
        );
    }

    const onSubmit = (data) => {
        console.log(data);
        let body = {
            id: `myFile_${(new Date).getTime().toString()}`,
        };
        let formData = new FormData();
        formData.append("inputJson", JSON.stringify(body));
        formData.append("file", selectedFile);

        if(selectedFile != null){
            request(
                "post",
                "/content/create",
                (res) => {
                    console.log(res.data.id);
                    onHandleData(data, res.data.id);
                },
                (err) => {
                    setOpen(true);
                    setTypeAlert("error");
                    setMessage("Upload tệp bị lỗi");
                },
                formData
            )
        }else{
            onHandleData(data);
        }
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
            <Box sx={boxComponentStyle}>
                <Box mb={4}>
                    <Typography variant="h4" component={'h4'}>
                        Thêm nhiệm vụ mới
                    </Typography>
                    {projectIdUrl &&
                        <Link to={`/taskmanagement/project/${projectIdUrl}/tasks`} style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" mb={3} color="primary">
                                Dự án: {projectName}
                            </Typography>
                        </Link>
                    }
                </Box>
                <form>
                    <Grid container mb={3}>
                        <Grid item={true} xs={3}>
                            <TextField
                                select
                                fullWidth
                                label={"Danh mục"}
                                defaultValue="Nhiệm vụ"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                {categories.map((item) => (
                                    <MenuItem key={item.categoryId} value={item.categoryId}>{item.categoryName}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Box mb={3}>
                        <TextField
                            fullWidth={true}
                            label="Tên nhiệm vụ"
                            variant="outlined"
                            name="name"
                            inputRef={register({ required: "Thiếu tên nhiệm vụ!" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Box>
                    <Box sx={boxChildComponent} mb={3}>
                        <TextField
                            label="Mô tả nhiệm vụ"
                            multiline
                            fullWidth={true}
                            rows={5}
                            name="description"
                            inputRef={register}
                            sx={{ mb: 3 }}
                        />
                        <Grid container spacing={2}>
                            <Grid item={true} xs={6} p={2}>
                                <Grid container>
                                    <Grid item={true} xs={4}>
                                        <Typography variant="body1">
                                            Trạng thái
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={8}>
                                        <Typography variant="body1" color={"InfoText"}>
                                            Open
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item={true} xs={6} p={2}>
                                <Grid container>
                                    <Grid item={true} xs={4}>
                                        <Typography variant="body1">
                                            Mức ưu tiên
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={8}>
                                        <TextField
                                            select
                                            fullWidth
                                            label={"Độ ưu tiên"}
                                            defaultValue="Cao"
                                            value={priorityId}
                                            onChange={(e) => setPriorityId(e.target.value)}
                                            required
                                        >
                                            {priorities.map((item) => (
                                                <MenuItem key={item.priorityId} value={item.priorityId}>{item.priorityName}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item={true} xs={6} p={2}>
                                <Grid container>
                                    <Grid item={true} xs={4}>
                                        <Typography variant="body1">
                                            Gán cho
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={8}>
                                        <TextField
                                            select
                                            fullWidth
                                            label={"Danh mục"}
                                            defaultValue=""
                                            value={partyId}
                                            onChange={(e) => setPartyId(e.target.value)}
                                            required
                                        >
                                            {persons.map((item) => (
                                                <MenuItem key={item.partyId} value={item.partyId}>{item.userLoginId} ({item.fullName})</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item={true} xs={6}>
                                <Grid container>
                                    <Grid item={true} xs={4}>
                                        <Typography variant="body1">
                                            Thời hạn
                                        </Typography>
                                    </Grid>
                                    <Grid item={true} xs={8}>
                                        <DateTimePickerBasic
                                            label={"Chọn thời hạn"}
                                            onChange={(date) => {
                                                setDueDate(date)
                                            }}
                                            value={dueDate}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {!projectIdUrl &&
                                <Grid item={true} xs={6} p={2}>
                                    <Grid container>
                                        <Grid item={true} xs={4}>
                                            <Typography variant="body1">
                                                Dự án
                                            </Typography>
                                        </Grid>
                                        <Grid item={true} xs={8}>
                                            <TextField
                                                select
                                                fullWidth
                                                label={"Danh sách dự án"}
                                                defaultValue=""
                                                value={projectId}
                                                onChange={(e) => setProjectId(e.target.value)}
                                                required
                                            >
                                                {projects.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                    </Box>
                    <Box sx={boxChildComponent} mb={3}>
                        <Grid container>
                            <Grid item={true} xs={2}>
                                <Typography variant="body1">
                                    Tài liệu đính kèm
                                </Typography>
                            </Grid>
                            <Grid item={true} xs={10} sx={{ display: 'flex', alignItem: 'center' }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<UploadFileIcon />}
                                    sx={{ marginRight: "1rem" }}
                                    color="primary"
                                >
                                    Upload file
                                    <input type="file" hidden onChange={(e) => setSelectedFile(e.target.files[0])} />
                                </Button>
                                {selectedFile &&
                                    <Typography variant="inherit" color={"primary"}>
                                        {selectedFile.name}
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} sx={{ marginRight: 2 }}>
                            Thêm nhiệm vụ
                        </Button>
                        <Button variant="contained" color="success" onClick={history.goBack}>
                            Hủy
                        </Button>
                    </Box>
                </form>
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
