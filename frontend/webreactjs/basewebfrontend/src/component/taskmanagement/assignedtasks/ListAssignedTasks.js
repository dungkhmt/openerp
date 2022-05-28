import { Box, Grid } from "@material-ui/core";
import AssignedTaskItem from "./AssignedTaskItem";
import { request } from "../../../api";
import { useState, useEffect } from "react";
import {
    boxComponentStyle
} from "../ultis/constant";

const ListAssignedTasks = () => {
    const [taskAssigned, setTaskAssigned] = useState([]);

    useEffect(() => {
        request('get', `/assigned-tasks-user-login`, res => {
            setTaskAssigned(res.data);
            console.log(res.data);
        }, err => {
            console.log(err);
        });
    }, [])

    return (
        <>
            <Box sx={boxComponentStyle}>
                <Box mb={4}>
                    <h1>Danh sách các nhiệm vụ được giao</h1>
                </Box>
                {taskAssigned.map(task => (
                    <AssignedTaskItem
                        key={task.id}
                        category={task.taskCategory.categoryName}
                        taskName={task.name}
                        description={task.description}
                        project={task.project.name}
                        dueDate={task.dueDate}
                    />
                ))}
            </Box>
        </>
    );
}

export default ListAssignedTasks;