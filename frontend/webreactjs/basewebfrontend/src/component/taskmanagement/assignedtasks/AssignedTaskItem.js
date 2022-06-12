import React from "react";
import {
    Box,
    Grid,
    TextField,
    IconButton,
    MenuItem,
    Paper
} from "@material-ui/core";
import {
    boxChildComponent,
    TASK_CATEGORY_COLOR
} from "../ultis/constant";
import {
    Typography
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useState } from "react";
import SyncSharpIcon from '@mui/icons-material/SyncSharp';
import CategoryElement from "../common/CategoryElement";

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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderBottom: "2x",
                    borderColor: '#ccc'
                }}>
                    <Box>
                        <Box display={'flex'} alignItems={'center'} mb={2}>
                            <Box>
                                <CategoryElement categoryId={task.taskCategory.categoryId} value={task.taskCategory.categoryName} />
                            </Box>
                            <Typography variant="body1" >
                                {taskName}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <TextField
                            select
                            variant="outlined"
                            defaultValue=""
                            value={statusId}
                            onChange={(e) => setStatusId(e.target.value)}
                            sx={{ backgroundColor: "#eee" }}
                        >
                            {taskStatus.map((item) => (
                                <MenuItem key={item.statusId} value={item.statusId}>{item.statusCode}</MenuItem>
                            ))}
                        </TextField>
                        <IconButton aria-label="delete" size="medium" onClick={() => handleUpdateStatus(task.id, statusId)}>
                            <SyncSharpIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </Box>
                <Box mb={3}>
                    <Typography paragraph={true} variant="body2">
                        {description}
                    </Typography>
                </Box>
                <Box>
                    <Grid container>
                        <Grid item={true} xs={9}>
                            <Typography color="warning" variant="body2">
                                Thời hạn: {dueDate} ({outOfDate && <LocalFireDepartmentIcon color="error" />} {timeRemaining})
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={3}>
                            <Typography paragraph={true} variant="caption" color="primary">
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