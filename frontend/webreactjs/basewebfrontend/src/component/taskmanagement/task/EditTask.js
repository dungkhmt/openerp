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
    MenuItem,
    Skeleton,
    Stack
} from '@mui/material';

import BasicAlert from "../alert/BasicAlert";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import DateTimePickerBasic from '../datetimepicker/DateTimePickerBasic';
import { ElevatorSharp } from "@mui/icons-material";

export default function EditTask() {
    const history = useHistory();
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [persons, setPersons] = useState([]);
    const [listStatus, setListStatus] = useState([]);
    const { register, errors, handleSubmit, watch, setValue } = useForm();

    const [statusId, setStatusId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [priorityId, setPriorityId] = useState("HIGH");
    const [partyId, setPartyId] = useState("");
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

        request('get', `/task-status-list`, res => {
            setListStatus(res.data);
        }, err => {
            console.log(err);
        });

        request('get', `tasks/${taskId}`, res => {
            let task = res.data;
            console.log(task);
            setTask(task);
            setCategoryId(task.taskCategory.categoryId);
            setStatusId(task.statusItem.statusId);
            setDueDate(task.dueDateOrigin);
            setPriorityId(task.taskPriority.priorityId);
            setValue('name', task.name);
            setValue('description', task.description);
            setPartyId(task.partyId);
        }, err => {
            console.log(err);
        });

        request('get', '/task-priorities', res => {
            setPriorities(res.data);
        }, err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (task) {
            request('get', `/projects/${task.project.id}/members`, res => {
                setPersons(res.data);
            }, err => {
                console.log(err);
            });
        }
    }, [task]);

    const onHandleData = (data, fileId = "") => {
        const dataForm = {
            ...data,
            partyId,
            categoryId,
            dueDate,
            priorityId,
            attachmentPaths: selectedFile == null ? `${task.fileName},${task.fileId}` : `${selectedFile.name},${fileId}`,
            statusId: "TASK_INPROGRESS",
            projectId: task.project.id
        };

        request(
            "put",
            `/tasks/${taskId}`,
            (res) => {
                console.log(res.data);
                setOpen(true);
                setTypeAlert("success");
                setMessage("Đã cập nhật thành công");
                setTimeout(() => {
                    history.push(`/taskmanagement/tasks/${taskId}`);
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

    const onUpdated = (data) => {
        console.log(data);
        let body = {
            id: `myFile_${(new Date).getTime().toString()}`,
        };
        let formData = new FormData();
        formData.append("inputJson", JSON.stringify(body));
        formData.append("file", selectedFile);

        if (selectedFile != null) {
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
        } else {
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
                        Chỉnh sửa nhiệm vụ
                    </Typography>
                    {task &&
                        <Link to={`/taskmanagement/project/${task.project.id}/tasks`} style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" mb={3} color="primary">
                                Dự án: {task.project.name}
                            </Typography>
                        </Link>
                    }
                </Box>
                {task ?
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
                                            <TextField
                                                select
                                                fullWidth
                                                label={"Trạng thái"}
                                                defaultValue=""
                                                value={statusId}
                                                onChange={(e) => setStatusId(e.target.value)}
                                                required
                                            >
                                                {listStatus.map((item) => (
                                                    <MenuItem key={item.statusId} value={item.statusId}>{item.description}</MenuItem>
                                                ))}
                                            </TextField>
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
                            </Grid>
                        </Box>
                        <Box sx={boxChildComponent} mb={3}>
                            <Grid container sx={{display: 'flex', alignItem: 'center'}}>
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
                                    {selectedFile ?
                                        <Typography variant="inherit" align={'inherit'} color={"primary"}>
                                            {selectedFile.name}
                                        </Typography>
                                        :
                                        <Typography variant="inherit" align={'inherit'} color={"primary"}>
                                            {task.fileName}
                                        </Typography>
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit(onUpdated)} sx={{ marginRight: 2 }}>
                                Cập nhật
                            </Button>
                            <Button variant="contained" color="success" onClick={history.goBack}>
                                Hủy
                            </Button>
                        </Box>
                    </form>
                    :
                    <Stack spacing={1}>
                        <Skeleton variant="text" />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" height={200} />
                    </Stack>
                }
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
