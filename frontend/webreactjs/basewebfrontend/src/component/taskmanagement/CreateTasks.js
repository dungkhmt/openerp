import React, { useEffect, useState } from "react";

import { request } from "../../api";
import {
    boxComponentStyle,
    boxChildComponent,
    Header
} from "./ultis/constant";
import {
    Box,
    Grid,

} from '@mui/material';

import { useForm } from "react-hook-form";

export default function CreateTask() {
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [persons, setPersons] = useState([]);
    const [projects, setProjects] = useState([]);

    const { register, errors, handleSubmit, watch, setValue } = useForm();

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
    }, []);

    const onSubmit = () => {
        const data = {
            "name": taskNameForm,
            "description": taskDescriptionForm,
            "dueDate": dateForm,
            "attachmentPaths": "20210120233740-SoICT-PPT-template-hoi-thao-online.pptx",
            "projectId": projectForm,
            "statusId": "TASK_INPROGRESS",
            "priorityId": priorityForm,
            "categoryId": categoryForm,
            "partyId": assignedForm
        };


        request(
            "post",
            `/projects/${projectForm}/tasks`,
            (res) => {
                console.log(res.data);
                setOpen(true);
            },
            {},
            data
        );
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
                <Header>
                    Thêm mới nhiệm vụ
                </Header>
                <Grid container>
                    <Grid item={true} xs={3}>
                        {/* <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px" }} >Danh sách thành viên</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Danh mục"
                                ref={register("cate", {
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
                        </FormControl> */}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
