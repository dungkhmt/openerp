import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import AssignedTaskItem from "./AssignedTaskItem";
import { request } from "../../../api";
import { useState, useEffect } from "react";
import {
    boxComponentStyle,
    Header,
    TASK_CATEGORY_COLOR
} from "../ultis/constant";
import BasicAlert from "../alert/BasicAlert";
import { useHistory } from "react-router";

const ListAssignedTasks = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [typeAlert, setTypeAlert] = useState("success");
    const [message, setMessage] = useState("Đã thêm mới thành công");
    const [state, setState] = useState({
        taskId: "",
        statusId: ""
    })

    const [taskAssigned, setTaskAssigned] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);

    useEffect(() => {
        request('get', '/task-status-list', res => {
            setTaskStatus(res.data);
        }, err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {
        request('get', `/assigned-tasks-user-login`, res => {
            setTaskAssigned(res.data);
            console.log(res.data);
        }, err => {
            console.log(err);
        });
    }, [state])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const handleUpdateStatus = (taskId, statusId) => {
        request('get', `/tasks/${taskId}/status/${statusId}`, res => {
            setState({
                taskId: taskId,
                statusId: statusId
            });
            setOpen(true);
            setTypeAlert("success");
            setMessage("Đã cập nhật trạng thái thành công!");
        }, err => {
            console.log(err);
        });
    }

    return (
        <>
            <Box sx={boxComponentStyle}>
                <Box mb={4}>
                    <Typography variant="h4" mb={4} component={'h4'}>
                        Danh sách các nhiệm vụ được giao
                    </Typography>
                </Box>
                {taskAssigned.map(task => (
                    <AssignedTaskItem
                        key={task.id}
                        task={task}
                        taskStatus={taskStatus}
                        handleUpdateStatus={handleUpdateStatus}
                    />
                ))}
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

export default ListAssignedTasks;