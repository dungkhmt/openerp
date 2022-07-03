import React, { useEffect } from "react";
import { useState, forwardRef } from "react";
import { useHistory } from "react-router";
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    IconButton,
    MenuItem,
    Stack, 
    Skeleton
} from '@mui/material';
import { request } from "../../../api";
import BoardContent from "./BoardContent";

const Board = () => {
    const { projectId } = useParams();

    const [categories, setCategories] = useState([]);
    const [assignees, setAssignees] = useState([]);

    const [categoryId, setCategoryId] = useState("");
    const [partyId, setPartyId] = useState("");

    const [data, setData] = useState(null);

    useEffect(() => {
        request('get', '/task-categories', res => {
            setCategories(res.data);
        }, err => {
            console.log(err);
        });
        request(
            "get",
            `/projects/${projectId}/members`,
            (res) => {
                setAssignees(res.data);
            },
            (err) => {
                console.log(err);
            }
        );
    }, []);

    useEffect(() => {
        const dataForm = {
            projectId: projectId,
            categoryId: categoryId,
            partyId: partyId
        };
        request(
            'post',
            '/board',
            res => {
                setData(res.data);
                console.log(res.data);
            },
            err => {
                console.log(err);
            },
            dataForm
        );
    }, [partyId, categoryId]);

    return (
        <>
            <Box>
                <Typography variant="h4" mb={4} component={'h4'}>
                    Board
                </Typography>
            </Box>
            <Box mb={2}>
                <Grid container>
                    <Grid item={true} xs={6}>
                        <Grid container mb={3} spacing={2}>
                            <Grid item={true} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label={"Danh mục"}
                                    defaultValue=""
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    sx={{ backgroundColor: "#fff" }}
                                >
                                    <MenuItem value={""}>Không chọn</MenuItem>
                                    {categories.map((item) => (
                                        <MenuItem key={item.categoryId} value={item.categoryId}>{item.categoryName}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label={"Gán cho"}
                                    defaultValue=""
                                    value={partyId}
                                    onChange={(e) => setPartyId(e.target.value)}
                                    sx={{ backgroundColor: "#fff" }}
                                >
                                    <MenuItem value={""}>Không chọn</MenuItem>
                                    {assignees.map((item) => (
                                        <MenuItem key={item.partyId} value={item.partyId}>{item.userLoginId} ({item.fullName})</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {data ?
                <BoardContent data={data} />
                :
                <Stack spacing={1}>
                    <Skeleton variant="text" />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" height={200} />
                </Stack>
            }
        </>
    );
}

export default Board;