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
import { request } from "../../../api";
import { useParams } from 'react-router-dom';
import { Box, Grid } from "@material-ui/core";
import PieChart from "../chart/PieChart";
import PersonIcon from '@mui/icons-material/Person';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicModal from '../modal/BasicModal';
import {
    boxComponentStyle,
    boxChildComponent,
    centerBox,
    TASK_CATEGORY_COLOR
} from '../ultis/constant';
import {
    LimitString
} from '../ultis/helpers';
import { Link } from 'react-router-dom';
import { useScroll } from '../customhook/useScroll';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CategoryElement from '../common/CategoryElement';
import HistoryStatus from '../common/HistoryStatus';

const ListTasks = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [members, setMembers] = useState([]);
    const { projectId } = useParams()
    const [projectName, setProjectName] = useState("");

    const [executeScroll, elRef] = useScroll();

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
            minWidth: 170,
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
            id: 'assignee',
            label: 'Gán cho',
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

    const [history, setHistory] = useState([]);

    const [labelsCategory, setLabelsCategory] = useState([]);
    const [dataChartCategory, setDataChartCategory] = useState([]);

    const [labelsStatus, setLabelsStatus] = useState([]);
    const [dataChartStatus, setDataChartStatus] = useState([]);

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
        executeScroll;

        request('get', `/projects/${projectId}/tasks`, res => {
            let rowsTask = res.data.map(task => {
                return {
                    'id': task.id,
                    'category': task.taskCategory.categoryName,
                    'taskName': task.name,
                    'description': LimitString(30, task.description),
                    'status': task.statusItem === null ? "Không xác định !" : task.statusItem.statusCode,
                    'priority': task.taskPriority.priorityName,
                    'assignee': task.assignee,
                    'dueDate': task.dueDate,
                    'categoryId': task.taskCategory.categoryId,
                    'outOfDate': task.outOfDate
                }
            });
            console.log(rowsTask);
            setRows(rowsTask);
        }, err => {
            console.log(err);
        });

        request('get', `/projects/${projectId}/statics/category`, res => {
            setLabelsCategory(res.data.map(item => item.name));
            setDataChartCategory(res.data.map(item => item.value));
        }, err => {
            console.log(err);
        });

        request('get', `/projects/${projectId}/statics/status`, res => {
            setLabelsStatus(res.data.map(item => item.name));
            setDataChartStatus(res.data.map(item => item.value));
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

        request('get', `/projects/${projectId}/history`, res => {
            setHistory(res.data);
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
                        Lịch sử
                    </Typography>
                </Box>
                {history.length > 0 ?
                    history.map(item =>
                    (<Box sx={boxChildComponent} px={0} mb={3}>
                        <Box pb={2}>
                            <Typography variant='body1'>
                                {item.date}
                            </Typography>
                        </Box>
                        <Box>
                            {item.taskExecutionList.map(taskExecution => (
                                <Box display={'flex'} py={2} borderTop={1} borderColor={"#cdb8b8"}>
                                    <Box mr={2}>
                                        <Avatar>{taskExecution.createdByUserLoginId != null ? taskExecution.createdByUserLoginId.charAt(0).toUpperCase() : "N"}</Avatar>
                                    </Box>
                                    <Box display={'flex'} flexDirection={'column'}>
                                        <Box display={'flex'} flexDirection={'row'} mb={2}>
                                            <Typography variant='body1' sx={{ mr: 1 }}>
                                                {taskExecution.createdByUserLoginId}
                                            </Typography>
                                            <HistoryStatus tag={taskExecution.executionTags} />
                                        </Box>
                                        <Box mb={1}>
                                            <Typography variant='body2' color={"primary"}>
                                                Nhiệm vụ: {taskExecution.task.name}
                                            </Typography>
                                        </Box>
                                        {taskExecution.comment &&
                                            <Box>
                                                <Typography variant='body2' color={"warning"}>
                                                    Nội dung: {taskExecution.comment}
                                                </Typography>
                                            </Box>
                                        }
                                        {/* <Box>
                                            <Typography variant='caption'>
                                                [ Assignee: mai le minh ]
                                            </Typography>
                                        </Box> */}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>))
                    :
                    <Typography variant='body1'>
                        Danh sách lịch sử trống ...
                    </Typography>

                }
            </Box>

            <Box sx={boxComponentStyle} id="static">
                <Box sx={{ mb: 3 }}>
                    <Typography variant='h5'>
                        Thống kê dự án
                    </Typography>
                </Box>
                <Box sx={boxChildComponent} mb={3}>
                    <Typography variant='body1'>
                        Danh mục
                    </Typography>
                    <Grid container justifyContent="center">
                        <Grid item={true} xs={6}>
                            <PieChart labels={labelsCategory} datasets={[
                                {
                                    data: dataChartCategory,
                                    backgroundColor: ["#003f5c", "#bc5090", "#ff6361", "#ffa600", "#58508d"]
                                }
                            ]} />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={boxChildComponent}>
                    <Typography variant='body1'>
                        Trạng thái
                    </Typography>
                    <Grid container justifyContent="center">
                        <Grid item={true} xs={6}>
                            <PieChart labels={labelsStatus} datasets={[
                                {
                                    data: dataChartStatus,
                                    backgroundColor: ["#003f5c", "#bc5090", "#ff6361", "#ffa600", "#58508d"]
                                }
                            ]} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box sx={boxComponentStyle} ref={elRef}>
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
                                                    if (column.id === 'category') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <CategoryElement categoryId={row.categoryId} value={value} />
                                                            </TableCell>
                                                        );
                                                    }

                                                    if (column.id === 'dueDate') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    {row.outOfDate && <><LocalFireDepartmentIcon /></>} {value}
                                                                </Box>
                                                            </TableCell>
                                                        );
                                                    }

                                                    if (column.id === 'taskName') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <Link to={`/taskmanagement/tasks/${row.id}`} style={{ textDecoration: 'none' }}>{value}</Link>
                                                            </TableCell>
                                                        );
                                                    }

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