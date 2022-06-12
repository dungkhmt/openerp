import * as React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Button,
    Tooltip,
    IconButton,
    TableCell,
    Avatar,
    AvatarGroup,
    Box,
    Skeleton,
    Grid,
    TextField,
    Breadcrumbs
} from '@mui/material';
import BasicAlert from "../alert/BasicAlert";
import {
    boxComponentStyle,
    boxChildComponent
} from '../ultis/constant';
import CategoryElement from '../common/CategoryElement';
import StatusElemnet from '../common/StatusElement';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { request } from "../../../api";
import { Link } from 'react-router-dom';
import CommentItem from './CommentItem';

const ShowTask = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null)

    const [comment, setComment] = useState("");
    const [listComment, setListComment] = useState([]);
    const [loadComments, setLoadComments] = useState(false);

    const [typeAlert, setTypeAlert] = useState("success");
    const [message, setMessage] = useState("Đã thêm mới thành công");
    const [open, setOpen] = useState(false);

    const [commentDelete, setCommentDelete] = useState("");
    const [commentUpdate, setCommentUpdate] = useState("");

    const onSubmitComment = () => {
        let dataForm = {
            comment: comment,
            projectId: task.project.id
        };
        request(
            'post',
            `tasks/${taskId}/comment`,
            (res) => {
                console.log(res.data);
                setOpen(true);
                setTypeAlert("success");
                setMessage("Đã thêm mới thành công");
                setLoadComments(!loadComments);
                setComment("");

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

    const onDeleteComment = (id) => {
        request('delete', `comments/${id}`, res => {
            setOpen(true);
            setTypeAlert("success");
            setMessage("Đã xóa bình luận thành công");
            setLoadComments(!loadComments);
        }, err => {
            console.log(err);
        });
    }

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        request('get', `/tasks/${taskId}`, res => {
            setTask(res.data);
            console.log(res.data);
        }, err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        request('get', `tasks/${taskId}/comments`, res => {
            setListComment(res.data);
            console.log(res.data);
        }, err => {
            console.log(err);
        });
    }, [loadComments]);

    return (
        <>
            {task ?
                <>
                    <Box mb={2}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link style={{ textDecoration: 'none' }} to={`/taskmanagement/project/${task.project.id}/tasks`}>
                                {task.project.name}
                            </Link>
                            <Typography color="text.primary">{task.name.substr(0, 30)}...</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box sx={boxComponentStyle}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 3
                        }}>
                            <CategoryElement categoryId={task.taskCategory.categoryId} value={task.taskCategory.categoryName} />
                            <Box display={'flex'} alignItems="center">
                                <Box display={'flex'} mr={2}>
                                    <Typography variant='caption' color="secondary" sx={{ mr: 1 }}>
                                        Thời hạn:
                                    </Typography>
                                    <Typography variant='body2'>
                                        {task.dueDate}
                                    </Typography>
                                </Box>
                                <Box>
                                    <StatusElemnet statusId={task.statusItem?.statusId} value={task.statusItem?.description} />
                                </Box>
                            </Box>
                        </Box>
                        <Box mb={3}>
                            <Typography variant='h6' color={"secondary"}>
                                {task.name}
                            </Typography>
                        </Box>
                        <Box mb={3} sx={boxChildComponent}>
                            <Box mb={3}>
                                <Box display={'flex'} alignItems={"center"}>
                                    <Avatar>{task.createdByUserLoginId != null ? task.createdByUserLoginId.charAt(0).toUpperCase() : "N"}</Avatar>
                                    <Box px={2} display={'flex'} flexDirection={"column"} >
                                        <Typography variant='body2' color={'secondary'}>
                                            {task.createdByUserLoginId != null ? task.createdByUserLoginId : "Không có dữ liệu"}
                                        </Typography>
                                        <Box display={'flex'}>
                                            <Typography variant='caption' color="secondary" sx={{ marginRight: "5px" }}>
                                                Ngày tạo:
                                            </Typography>
                                            <Typography variant='body2'>
                                                {task.createdStamp}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box mb={3}>
                                <Typography variant="body1" paragraph={true}>
                                    {task.description}
                                </Typography>
                            </Box>
                            <Box mb={3}>
                                <Grid container columnSpacing={2}>
                                    <Grid item={true} xs={6}>
                                        <Box borderTop={1} borderBottom={1} borderColor={"#cdb8b8"} py={2}>
                                            <Grid container>
                                                <Grid item={true} xs={5}>
                                                    Mức ưu tiên
                                                </Grid>
                                                <Grid item={true} xs={7}>
                                                    {task.taskPriority.priorityName}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Box borderTop={1} borderBottom={1} borderColor={"#cdb8b8"} py={2}>
                                            <Grid container>
                                                <Grid item={true} xs={5}>
                                                    Nhiệm vụ được gán cho
                                                </Grid>
                                                <Grid item={true} xs={7}>
                                                    {task.assignee}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Box borderBottom={1} borderColor={"#cdb8b8"} py={2}>
                                            <Grid container>
                                                <Grid item={true} xs={5}>
                                                    Dự án
                                                </Grid>
                                                <Grid item={true} xs={7}>
                                                    <Typography variant="body2">
                                                        {task.project.name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Box display={'flex'} mr={2}>
                                    <Typography variant='caption' color="secondary" sx={{ mr: 1 }}>
                                        Thời gian còn lại:
                                    </Typography>
                                    <Typography variant='body2'>
                                        {task.timeRemaining}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box mb={3}>
                            <Box mb={2}>
                                <Typography variant='body2'>
                                    Bình luận ({listComment.length})
                                </Typography>
                            </Box>
                            {listComment.length > 0 &&
                                <Box sx={boxChildComponent} px={3}>
                                    {listComment.map((item, index) => {
                                        if (index === (listComment.length - 1)) {
                                            return (
                                                <CommentItem key={item.id} comment={item} onBottom={true} onDeleteComment={onDeleteComment} />
                                            );
                                        } else {
                                            return (
                                                <CommentItem key={item.id} comment={item} onBottom={false} onDeleteComment={onDeleteComment} />
                                            )
                                        }
                                    })}
                                </Box>
                            }
                        </Box>
                        <Box>
                            <TextField variant='standard' label="Thêm bình luận" placeholder='...' fullWidth={true} required={true} value={comment} onChange={(e) => setComment(e.target.value)} />
                            <Box display={'flex'} justifyContent={"flex-end"} mt={2}>
                                <Button variant="contained" color="primary" onClick={() => onSubmitComment()}>Thêm bình luận</Button>
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
                :
                <Skeleton animation="wave" variant="circular" />
            }
        </>
    );
}

export default ShowTask;