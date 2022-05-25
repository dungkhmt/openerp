import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from 'react';
import { request } from "../../api";

const ListTasks = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        request('get', 'http://localhost:8080/api/projects', res => {
            setProjects(res.data);
        }, err => {
            console.log(err);
        });
    }, [])

    const columns = [
        { id: 'name', label: 'Issue type', minWidth: 170 },
        { id: 'code', label: 'Code', minWidth: 100 },
        {
            id: 'population',
            label: 'Subject',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'size',
            label: 'Assignee',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'density',
            label: 'Status',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
        {
            id: 'prority',
            label: 'Priority',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
        {
            id: 'created',
            label: 'Created',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
        {
            id: 'dueDate',
            label: 'Due Date',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
        {
            id: 'upDate',
            label: 'Updated',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
    ];

    function createData(name, code, population, size, prority, created, dueDate, updated) {
        const density = population / size;
        return { name, code, population, size, density, prority, created, dueDate, updated };
    }

    const rows = [
        createData('India', 'IN', 1324171354, 3287263, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('China', 'CN', 1403500365, 9596961, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Italy', 'IT', 60483973, 301340, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('United States', 'US', 327167434, 9833520, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Canada', 'CA', 37602103, 9984670, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Australia', 'AU', 25475400, 7692024, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Germany', 'DE', 83019200, 357578, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Ireland', 'IE', 4857000, 70273, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Mexico', 'MX', 126577691, 1972550, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Japan', 'JP', 126317000, 377973, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('France', 'FR', 67022000, 640679, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('United Kingdom', 'GB', 67545757, 242495, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Russia', 'RU', 146793744, 17098246, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Nigeria', 'NG', 200962417, 923768, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
        createData('Brazil', 'BR', 210147125, 8515767, "high", "Apr. 20, 2022", "Apr. 20, 2022"),
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <div className="pt-3 px-2">
                <div className="p-3" style={{ backgroundColor: "#FFF", boxShadow: "0 4px 8px rgba(0,0,0,0.07)" }}>
                    <h3 className="mb-3">Danh sách các nhiệm vụ</h3>

                    <div className="mb-4 row" >
                        <div className="col-3">
                            <select className="form-select" style={{ backgroundColor: "#eee" }}>
                                <option selected>Chọn dự án ... </option>
                                {projects.map((item) => (
                                    <option value={item.id} key={item.id}>{item.name != null ? item.name : "Dự án chưa được đặt tên"}</option>
                                ))}
                            </select>
                        </div>
                    </div>

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
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
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
                </div>
            </div>
        </>
    );
}

export default ListTasks;