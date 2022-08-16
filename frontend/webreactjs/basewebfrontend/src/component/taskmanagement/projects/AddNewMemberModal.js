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
    Menu,
    MenuItem,
    Autocomplete,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useState, useEffect } from 'react';
import { request } from "../../../api";
import { useParams } from 'react-router-dom';
import { Box, Grid } from "@material-ui/core";
import BasicModal from '../modal/BasicModal';
import {
    infoNoti,
    processingNoti,
    successNoti,
    errorNoti
} from "utils/notification";

const AddNewMemberModal = ({ open, handleClose, projectName, projectId, callBackIsLoadMember }) => {
    const [persons, setPersons] = useState([]);
    const [person, setPerson] = useState(null);

    useEffect(() => {
        request('get', '/task-persons', res => {
            setPersons(res.data);
            setPerson(res.data[0]);
        }, err => {
            console.log(err);
        });
    }, []);

    const handleAddNew = () => {
        const dataForm = {
            projectId: projectId,
            partyId: person.partyId
        }
        request(
            "post",
            `/projects/${projectId}/members`,
            (res) => {
                if (res.data.error) {
                    errorNoti(res.data.error, true);
                } else {
                    successNoti("Đã thêm mới thành công!", true);
                    callBackIsLoadMember();
                    handleClose();
                }
            },
            (err) => {
                console.log(err);
            },
            dataForm
        );
    }

    return (
        <>
            <Box minWidth={"500px"}>
                <Dialog open={open} onClose={handleClose} fullWidth={true}>
                    <DialogTitle>
                        Thêm thành viên mới
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <Box mb={2}>
                                <Typography variant='body1' color="primary">
                                    Chọn thành viên
                                </Typography>
                            </Box>
                            <Box mb={3}>
                                <Autocomplete
                                    disablePortal
                                    options={persons}
                                    value={person}
                                    onChange={(e, value) => setPerson(value)}
                                    getOptionLabel={(option) => { return `${option.userLoginId} (${option.fullName})` }}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label="Danh mục" placeholder="" />}
                                />
                            </Box>
                            <Box mb={2}>
                                <Typography variant='body1' color='primary'>
                                    Tới dự án:
                                </Typography>
                                <Typography variant='body1'>
                                    {projectName}
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="success">Hủy</Button>
                        <Button onClick={handleAddNew} variant="contained" color="primary">Thêm mới</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default AddNewMemberModal;