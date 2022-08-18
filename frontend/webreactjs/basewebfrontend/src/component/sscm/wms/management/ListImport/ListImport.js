import React, { Fragment, useEffect, useState } from "react";
import { axiosGet, request } from "api";
import { Box, Button, Collapse, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import useStyles from "./ListImport.style";
import { useRouteMatch } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useHistory } from "react-router";
import moment from 'moment';
import { Link } from '@mui/material';

import PropTypes from 'prop-types';
import { formatCurrency, getImportStatus, getQuantity, getStatus, getType } from "../../utilities";

function ListImport() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);



  const [filterImport, setFilterImport] = useState([]);
  const [imports, setImports] = useState([]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getProducts = () => {
    request(
      "get",
      "/admin/wms/import",
      (res) => {
        setImports(res.data);
        setFilterImport(res.data);
      },
      {
        onError: (res) => {
          console.log("getProducts, error ", res)
        },
      }
    );
  };


  useEffect(() => {
    getProducts();
  }, []);

  const requestSearch = (searchedVal) => {
    const filteredRows = imports.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setFilterProduct(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const addImport = () => {
    history.push(`${path}/create`);
  }
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          {
            (row.variants.length > 0 ?
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              :
              <TableCell></TableCell>
            )
          }
          <TableCell component="th" scope="row" className={classes.imgWrap}>
            <img style={{ width: 40 }} src={require("../../common/image/default.jpg").default} alt="" />
          </TableCell>
          <TableCell align="right">{row.name}</TableCell>
          <TableCell align="right">{getType(row.type)}</TableCell>
          <TableCell align="right">{row.code}</TableCell>
          <TableCell align="right">{getQuantity(row.available)}</TableCell>
          <TableCell align="right">{getQuantity(row.onHand)}</TableCell>
          <TableCell align="right">{getStatus(row.isActive)}</TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: "#fafafa" }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: "none" }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit style={{ padding: "30px 300px 30px 60px" }}>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Variants
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên variant</TableCell>
                      <TableCell>Mã </TableCell>
                      <TableCell align="right">Có thể bán</TableCell>
                      <TableCell align="right">Tồn kho</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.variants.map((row) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">{row.name}</TableCell>
                          <TableCell>{row.sku}</TableCell>
                          <TableCell align="right">{row.available}</TableCell>
                          <TableCell align="right">{row.onHand}</TableCell>
                        </TableRow>
                      )
                    }
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number,
      carbs: PropTypes.number,
      fat: PropTypes.number,
      variants: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number,
          customerId: PropTypes.string,
          date: PropTypes.string,
        }),
      ),
      name: PropTypes.string,
    }),
  };


  return (
    <>
      <Fragment>
        <Grid container justifyContent="space-between" >
          <Grid>
            <Typography variant="h5">
              Danh sách đơn nhập hàng
            </Typography>
          </Grid>
          <Grid className={classes.buttonWrap}>
            <Button variant="contained" className={classes.addButton}
              onClick={addImport}
            >Tạo đơn nhập hàng</Button>
          </Grid>
        </Grid>
      </Fragment>
      <Paper>
        <SearchBar
          value={searched}
          onChange={(searchVal) => { requestSearch(searchVal)}}
          onCancelSearch={() => cancelSearch()}
        />
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell width={"10%"}  align="left">Mã Đơn</TableCell>
                <TableCell width={"10%"} align="left">Mã Kho</TableCell>
                <TableCell width={"30%"} align="left">Tên Kho</TableCell>
                <TableCell width={"20%"} align="left">Thời gian tạo đơn</TableCell>
                <TableCell width={"15%"} align="center">Tổng giá trị</TableCell>
                <TableCell width={"15%"} align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterImport.sort(function (a, b) { return (b.id - a.id); }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left">
                    <Link href={`${path}/${row.id}`} underline="none">
                      {row.code}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.facility?.code}</TableCell>
                  <TableCell align="left">{row.facility?.name}</TableCell>
                  <TableCell align="left">{row.createAt ? moment(row.createAt).format('DD/MM/YYYY') : ""}</TableCell>
                  <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                  <TableCell align="center">{getImportStatus(row?.status, 26)}</TableCell>

                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={imports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default ListImport