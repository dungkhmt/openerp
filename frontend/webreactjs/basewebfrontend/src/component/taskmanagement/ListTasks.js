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
    AvatarGroup
} from '@mui/material';
import { useState, useEffect } from 'react';
import { request } from "../../api";
import { useParams } from 'react-router-dom';
import { Box, Grid } from "@material-ui/core";
import PieChart from "./chart/PieChart";
import PersonIcon from '@mui/icons-material/Person';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicModal from './modal/BasicModal';
import {
    boxComponentStyle,
    boxChildComponent,
    centerBox
} from './ultis/constant';
import {
    LimitString
} from './ultis/helpers';
import { Link } from 'react-router-dom';

const ListTasks = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [members, setMembers] = useState([]);

    const { projectId } = useParams();

    const [projectName, setProjectName] = useState("");

    const columns = [
        {
            id: 'category',
            label: 'Loại nhiệm vụ',
            minWidth: 170,
            align: 'center'
        },
        {
            id: 'taskName',
            label: 'Tên nhiệm vụ',
            minWidth: 100,
            align: 'center'
        },
        {
            id: 'description',
            label: 'Mô tả',
            minWidth: 170,
            align: 'center'
        },
        {
            id: 'status',
            label: 'Trạng thái',
            minWidth: 170,
            align: 'center'
        },
        {
            id: 'priority',
            label: 'Mức độ ưu tiên',
            minWidth: 170,
            align: 'center'
        },
        {
            id: 'dueDate',
            label: 'Hạn kết thúc',
            minWidth: 170,
            align: 'center'
        }

    ];

    const [labels, setLabels] = useState([]);

    const [dataChart, setDataChart] = useState([]);

    const [rows, setRows] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        request('get', `/projects/${projectId}/tasks`, res => {
            let rowsTask = res.data.map(task => {
                return {
                    'id': task.id,
                    'category': task.taskCategory.categoryName,
                    'taskName': task.name,
                    'description': LimitString(30, task.description),
                    'status': task.statusItem === null ? "Không xác định !" : task.statusItem.statusCode,
                    'priority': task.taskPriority.priorityName,
                    'dueDate': task.dueDate
                }
            });
            console.log(rowsTask);
            setRows(rowsTask);
        }, err => {
            console.log(err);
        });

        request('get', `/projects/${projectId}/statics`, res => {
            setLabels(res.data.map(item => item.name));
            setDataChart(res.data.map(item => item.value));
        }, err => {
            console.log(err);
        });

        request('get', `/projects/${projectId}/members`, res => {
            setMembers(res.data);
        }, err => {
            console.log(err);
        });

        request('get', `/projects/${projectId}`, res => {
            setProjectName(res.data.name);
        }, err => {
            console.log(err);
        });
    }, [])

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h3' component='h3' sx={{ textAlign: 'center' }}>
                    {projectName}
                </Typography>
            </Box>
            {/* <Box sx={boxComponentStyle}>
                <Typography variant='h5' component='h5'>
                    {projectName}
                </Typography>

            </Box> */}
            <Box sx={boxComponentStyle}>
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                >
                    <Box sx={{ mr: 3 }}>
                        <Typography variant='h5'>
                            Thành viên dự án
                        </Typography>
                    </Box>
                    <Box mr={3}>
                        <AvatarGroup total={members.length} onClick={handleOpen}>
                            {members.slice().splice(0, 3).map(item => (
                                <Avatar>{item.fullName.charAt(0).toUpperCase()}</Avatar>
                            ))}
                        </AvatarGroup>
                        {/* {members.slice().splice(0, 3).map(item => (
                            <Tooltip key={item.partyId} title={item.fullName}>
                                <Link to={`/${item.partyId}`}>
                                    <IconButton aria-label="user" size="large" sx={{ border: 1, borderColor: "#ccc", mr: 1 }}>
                                        <PersonIcon />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        ))}
                        <Tooltip title="Xem thêm">
                            <IconButton aria-label="user" size="large" sx={{ border: 1, borderColor: "#ccc", mr: 1 }} onClick={handleOpen}>
                                <AddOutlinedIcon />
                            </IconButton>
                        </Tooltip> */}
                        <BasicModal open={open} handleClose={handleClose}>
                            {members.map(member => (
                                <Box sx={boxChildComponent} key={member.partyId} mb={3}>
                                    <Link to={`/${member.partyId}`} style={{ textDecoration: 'none', color: '#000' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ mr: 2, width: 56, height: 56 }}>{member.fullName.charAt(0).toUpperCase()}</Avatar>
                                            <Typography variant="h5" component="h5">
                                                {member.fullName}
                                            </Typography>
                                        </Box>
                                    </Link>
                                </Box>
                            ))}
                        </BasicModal>
                    </Box>
                </Box>
            </Box>

            <Box sx={boxComponentStyle}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant='h5'>
                        Thống kê dự án
                    </Typography>
                </Box>
                <Grid container justifyContent="center">
                    <Grid item={true} xs={6}>
                        <PieChart labels={labels} datasets={[
                            {
                                data: dataChart,
                                backgroundColor: ["#003f5c", "#bc5090", "#ff6361", "#ffa600", "#58508d"]
                            }
                        ]} />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={boxComponentStyle}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h5'>
                        Danh sách các nhiệm vụ
                    </Typography>
                    <Link to={`/taskmanagement/project/tasks/create/${projectId}`} style={{ textDecoration: 'none', marginRight: '15px' }}><Button variant='outlined' color='primary'>Thêm nhiệm vụ</Button></Link>
                </Box>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </>
    );
}

export default ListTasks;