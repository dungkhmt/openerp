import { Box, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import React from 'react'
import { useRouteMatch } from 'react-router';
import { formatCurrency, formatDate } from '../../utilities';
import { Link } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  boxInfor:{
    backgroundColor: "#FFF",
    marginBottom: 30,
    marginTop: 30,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    alignItems: "center",
    borderRadius: 3,
  },
  inforTitle:{
    borderBottom: "1px solid #E8EAEB",
    padding: "8px",
  },
  tableWrap:{
    minHeight: 200,
    maxHeight: 400,
    overflow: "auto",
    listStyle: "none",
    '&::-webkit-scrollbar': {
      width: '0.3em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#87CEFA',
      outline: '1px solid #87CEFA'
    }
  },
}));

function ProductInImport({lineItems}) {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box className={classes.boxInfor}>
      <Typography className={classes.inforTitle} variant="h6">
        Lịch sử nhập hàng
      </Typography>

      <TableContainer className={classes.tableWrap}>
        <Table stickyHeader size="small" >
          <TableHead  >
            <TableRow>
              <TableCell style={{ width: '15%' }} align="left">Mã đơn nhập</TableCell>
              <TableCell style={{ width: '20%' }} align="center">Tổng Số lượng</TableCell>
              <TableCell style={{ width: '25%' }} align="center">Số lượng chưa lên kệ</TableCell>
              <TableCell style={{ width: '10%' }} align="center">Giá nhập</TableCell>
              <TableCell style={{ width: '10%' }} align="center">Tổng tiền</TableCell>
              <TableCell style={{ width: '20%' }} align="center">Ngày nhập</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {
              lineItems &&
              lineItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">
                    <Link style={{marginLeft: 3}} href={`${path.replace('/warehouse/products/:id','/inventory/import')}/${row.importOrder.id}`} underline="none">
                    {row.importOrder?.code}
                    </Link>
                    </TableCell>
                  <TableCell align="center">{row.quantity}</TableCell>
                  <TableCell align="center">{row.currentQuantity}</TableCell>
                  <TableCell align="right">{formatCurrency(row.importPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                  <TableCell align="center">{formatDate(row.importOrder?.createAt)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={lineItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
  )
}

export default ProductInImport