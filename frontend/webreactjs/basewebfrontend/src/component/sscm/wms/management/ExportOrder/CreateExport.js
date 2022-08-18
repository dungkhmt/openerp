import { Box, Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react'
import useStyles from "./CreateExport.style";
import { Controller, useForm } from "react-hook-form";
import TagsInput from '../components/TagInput';
import CurrencyTextField from '@unicef/material-ui-currency-textfield/dist/CurrencyTextField';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';
import { request } from 'api';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import currency from 'currency.js';
import { formatCurrency } from '../../utilities';
import { successNoti } from 'utils/notification';
import { useHistory, useRouteMatch } from 'react-router';




function CreateExport() {

  const history = useHistory();
  const { path } = useRouteMatch();
  const classes = useStyles();
  const { register, errors, handleSubmit, watch, getValues, control } = useForm();
  const [listWarehouse, setListWarehouse] = useState([]);
  const [currentWH, setCurrentWH] = useState();
  const [lineItems, setLineItems] = useState([]);
  // const [lineItems, setLineItems] = useState([]);
  const [total, setTotal] = useState();
  const [variant, setVariant] = useState([]);

  const getListWarehouse = () => {
    request(
      "get",
      "/admin/wms/warehouse",
      (res) => {
        setListWarehouse(res.data);
      },
      {
        onError: (res) => {
          console.log("getListWarehouse")
        },
      }
    );
  };

  const getAllVariantActive = (id) => {
    request(
      "get",
      `/admin/wms/warehouse/products/facility/${id}/variant`,
      (res) => {
        setVariant(res.data);
      },
      {
        onError: (res) => {
          console.log("getAllVariantActive")
        },
      }
    );
  };

  useEffect(() => {
    if(currentWH?.facilityId != null){
      getAllVariantActive(currentWH.facilityId);
    }
  }, [currentWH]);


  useEffect(() => {
    getListWarehouse();
  }, []);

  const updateTotal = (lineItems) => {
    lineItems.total = 0;
    for (let i = 0; i < lineItems.length; i++) {
      if (lineItems[i].quantity && lineItems[i].retailPrice) {
        lineItems[i].total = lineItems[i].quantity * lineItems[i].retailPrice;
        lineItems.total += lineItems[i].total
      }
    }
    setTotal(lineItems.total)
  }

  const changeQuantity = (lineItem, value) => {
    const list = [...lineItems];
    const find = list.findIndex(item => {
      return item.id === lineItem.id
    });
    list[find].quantity = value
    setLineItems(list)
    updateTotal(lineItems)
  }
  const changePrice = (lineItem, value) => {
    const list = [...lineItems];
    const find = list.findIndex(item => {
      return item.id === lineItem.id
    });

    list[find].price = value
    setLineItems(list)
    updateTotal(lineItems)
  }

  const addVariant = (value) => {
    const list = [...lineItems]
    const find = list.find(({ id }) => id === value.id);
    if (!find) {
      list.push(value)
      setLineItems(list)
      updateTotal(list)
    }
  }

  const removeVariant = (value) => {
    const list = [...lineItems]
    const find = list.find(({ id }) => id === value.id);
    if (find) {
      var filtered = list.filter(function (value, index, arr) {
        return value.id != find.id;
      });

      setLineItems(filtered);
      updateTotal(filtered)
      // changeQuantity()
    }
  }

  const createImport = (data) => {
    let newArray = lineItems.map(function (item) {
      item.variantId = item.id
      delete item.id;
      return item;
    });
    data.lineItems = newArray;
    data.total = total;
    data.facilityId = currentWH.facilityId
  }

  let submitForm = (data) => {
    let newArray = lineItems.map(function (item) {
      item.variantId = item.id
      delete item.id;
      return item;
    });
    data.lineItems = newArray;
    data.total = total;
    data.facilityId = currentWH.facilityId
    request(
      "post",
      "/admin/wms/export",
      (res) => {
        let id = res.data.id;
        successNoti("Tạo đơn xuất hàng thành công")
        // history.push(`${path.replace('/create', '')}`);
        history.push(`${path.replace('/create', '')}/${id}`);
      },
      { 401: () => { } },
      data
    );
  };

  return (
    <Fragment>
      <Box className={classes.productPage} >
        <Grid container justifyContent="space-between" className={classes.headerBox} >
          <Grid>
            <Typography variant="h5">
              Tạo đơn xuất hàng
            </Typography>
          </Grid>
          <Grid className={classes.buttonWrap}>
            <Button variant="contained" className={classes.addButton} type="submit" onClick={handleSubmit(submitForm)} >Lưu</Button>
          </Grid>
        </Grid>

        <Box className={classes.bodyBox}>
          <Box className={classes.formWrap}
            component="form"
            onSubmit={handleSubmit(submitForm)}>
            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Thông tin Kho
              </Typography>
              <Box className={classes.inforWrap}>
                {
                  currentWH ?
                    <Box>
                      <Grid container className={classes.grid} >
                        <Grid item md={2} sm={2} xs={2} container direction="column">
                          <Typography className={classes.label}>Tên kho</Typography>
                          <Typography className={classes.label}>Mã kho</Typography>
                          <Typography className={classes.label}>Địa chỉ</Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8} container direction="column">
                          <Typography className={classes.label}>
                            <b style={{ marginRight: 20 }}>:</b> {currentWH.name}
                          </Typography>
                          <Typography className={classes.label}>
                            <b style={{ marginRight: 20 }}>:</b> {currentWH.code}
                          </Typography>
                          <Typography className={classes.label}>
                            <b style={{ marginRight: 20 }}>:</b> {currentWH.address}
                          </Typography>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2} container direction="column" style={{ alignItems: "flex-end" }}>
                          <Box className={classes.removeIconBox} onClick={() => setCurrentWH("")}  >
                            <HighlightOffIcon className={classes.removeIcon} />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    :
                    <Autocomplete
                      className={classes.searchBox}
                      id="search-warehouse"
                      options={listWarehouse.sort((a, b) => (b.facilityId - a.facilityId))}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) => {
                        setCurrentWH(newValue);
                      }}
                      renderOption={(props, option) => {
                        return (
                          <Card {...props} key={option.facilityId} style={{ width: "100%" }}>
                            <Box style={{ padding: "0px" }}>
                              <Typography variant="h6">
                                {option.name}
                              </Typography>
                              <Typography >
                                {option.code}
                              </Typography>
                            </Box>
                          </Card>
                        )
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Chọn kho nhập hàng"
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                }
              </Box>
            </Box>


            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Sản phẩm
              </Typography>
              <Box className={classes.inforWrap}>
                <Autocomplete
                  className={classes.searchBox}
                  noOptionsText={'Không có sản phẩm'}
                  id="search-variant"
                  options={variant.sort((a, b) => (b.id - a.id))}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if (newValue != null) {
                      addVariant(newValue);
                    }
                  }}
                  renderOption={(props, option) => {
                    return (
                      <Card {...props} style={{ width: "100%" }}>
                        <Box style={{ padding: "0px" }}>
                          <Typography variant="h6">
                            {option.name}
                          </Typography>
                          <Typography >
                            {option.sku ? option.sku : ""} --  {option.available} sản phẩm
                          </Typography>
                        </Box>
                      </Card>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Chọn Sản phẩm"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  )}
                />
                <TableContainer className={classes.tableWrap}>
                  <Table stickyHeader size="small" >
                    <TableHead  >
                      <TableRow>
                        <TableCell style={{ width: '10%' }} align="left">SKU</TableCell>
                        <TableCell style={{ width: '25%' }} align="left">Tên sản phẩm</TableCell>
                        <TableCell style={{ width: '10%' }} align="left">Tồn kho</TableCell>
                        <TableCell style={{ width: '15%' }} align="left">Số lượng lấy</TableCell>
                        <TableCell style={{ width: '15%' }} align="left">Giá bán</TableCell>
                        <TableCell style={{ width: '20%' }} align="center">Tổng tiền</TableCell>
                        <TableCell style={{ width: '5%' }} align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      {
                        lineItems &&
                        lineItems.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="left">{row.sku}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">{row.available}</TableCell>
                            <TableCell align="left">
                              <CurrencyTextField
                                fullWidth
                                variant="outlined"
                                currencySymbol=""
                                decimalPlaces={0}
                                value={row.quantity}
                                onChange={(event, value) => changeQuantity(row, value)}
                                size="small"
                                maximumValue={row.available}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <CurrencyTextField
                                fullWidth
                                variant="outlined"
                                currencySymbol=""
                                decimalPlaces={0}
                                value={row.retailPrice}
                                onChange={(event, value) => changePrice(row, value)}
                                size="small"
                                maximumValue={1000000000}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                className={classes.inputEnd}
                                variant="standard"
                                fullWidth
                                name="total"
                                value={formatCurrency(row.total)}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <Box className={classes.removeIconBox} onClick={() => removeVariant(row)}  >
                                <HighlightOffIcon className={classes.removeIcon} />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box className={classes.boxTotal}>
                  <Grid container className={classes.grid} style={{ justifyContent: "flex-end" }} >
                    <Grid item xs={2} container direction="column">
                      <Typography className={classes.label}>Số lượng sản phẩm</Typography>
                      <Typography className={classes.label}>Tổng giá trị</Typography>
                    </Grid>
                    <Grid item xs={3} container direction="column">
                      <TextField
                        className={classes.inputEnd}
                        variant="standard"
                        fullWidth
                        name="total"
                        value={`${lineItems.length}` + " sản phẩm"}
                        InputProps={{
                          disableUnderline: true,
                        }}
                      />
                      <TextField
                        className={classes.inputEnd}
                        variant="standard"
                        fullWidth
                        name="total"
                        value={`${formatCurrency(total)}` + " đồng"}
                        InputProps={{
                          disableUnderline: true,
                        }}
                      />

                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>


          </Box>

        </Box>
      </Box>
    </Fragment>
  )
}

export default CreateExport