import React from "react";
import {
    Box,
    Grid,
    TextField,
    IconButton,
    MenuItem
} from "@material-ui/core";
import {
    boxChildComponent
} from "../ultis/constant";
import {
    Typography
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useState } from "react";
import SyncSharpIcon from '@mui/icons-material/SyncSharp';

const AssignedTaskItem = ({ task, taskStatus, handleUpdateStatus }) => {
    const [statusId, setStatusId] = useState(task.statusItem?.statusId);

    const category = task.taskCategory.categoryName;
    const taskName = task.name;
    const description = task.description;
    const project = task.project.name;
    const dueDate = task.dueDate;
    const outOfDate = task.outOfDate;
    const timeRemaining = task.timeRemaining;

    return (
        <>
            <Box sx={boxChildComponent} mb={3}>
                <Grid container>
                    <Grid item={true} xs={8}>
                        <Box display={'flex'} alignItems={'center'} mb={2}>
                            <Typography variant="caption" sx={{
                                border: 1,
                                borderRadius: "15px",
                                borderColor: "#1c4ded",
                                backgroundColor: "#b9defa",
                                px: 2,
                                py: 1,
                                mr: 2
                            }}>
                                {category}
                            </Typography>
                            <Typography variant="body1" >
                                {taskName}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item={true} xs={4}>
                        <TextField
                            select
                            variant="outlined"
                            defaultValue=""
                            value={statusId}
                            onChange={(e) => setStatusId(e.target.value)}
                        >
                            {taskStatus.map((item) => (
                                <MenuItem key={item.statusId} value={item.statusId}>{item.statusCode}</MenuItem>
                            ))}
                        </TextField>
                        <IconButton aria-label="delete" size="medium" onClick={() => handleUpdateStatus(task.id, statusId)}>
                            <SyncSharpIcon fontSize="inherit" />
                        </IconButton>
                    </Grid>
                </Grid>
                <Box>
                    <Typography paragraph={true}>
                        {description}
                    </Typography>
                </Box>
                <Box>
                    <Grid container>
                        <Grid item={true} xs={9}>
                            <Typography paragraph={true} color={"warning"}>
                                Thời hạn: {dueDate} ({outOfDate && <LocalFireDepartmentIcon color="error" />} {timeRemaining})
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={3}>
                            <Typography paragraph={true}>
                                {project}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}

export default AssignedTaskItem;