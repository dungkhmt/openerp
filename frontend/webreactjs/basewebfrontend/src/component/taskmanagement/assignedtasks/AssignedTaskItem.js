import React from "react";
import { Box, Grid } from "@material-ui/core";
import {
    boxChildComponent
} from "../ultis/constant";
import {
    Typography
} from '@mui/material';

const AssignedTaskItem = ({ category, taskName, description, project, dueDate }) => {
    return (
        <>
            <Box sx={boxChildComponent}>
                <Box display={'flex'} alignItems={'center'} mb={2}>
                    <Typography variant="h6" sx={{
                        border: 1,
                        borderRadius: "5px",
                        borderColor: "#1c4ded",
                        backgroundColor: "#b9defa",
                        px: 2,
                        py: 1,
                        mr: 2
                    }}>
                        {category}
                    </Typography>
                    <Typography variant="h6" >
                        {taskName}
                    </Typography>
                </Box>
                <Box>
                    <Typography paragraph={true}>
                        {description}
                    </Typography>
                </Box>
                <Box>
                    <Grid container>
                        <Grid item={true} xs={9}>
                            <Typography paragraph={true}>
                                Thời hạn: {dueDate}
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