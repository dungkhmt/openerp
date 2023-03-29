import { useRouteMatch } from "react-router-dom";
import { Box, Grid, Typography,TextField, MenuItem,
  Button, Select, TableContainer, TableRow, Table, TableHead, 
  TableCell, TableBody } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import useStyles from "../../management/styles";
import { RequireStar } from "../components/requireStar";
import { useForm } from "react-hook-form";
import { request } from "api";
import { API_PATH } from "../apiPaths";
import { errorNoti, successNoti } from "utils/notification";

const ReceiptDetail = ( props ) => {
  const receiptId = props.match?.params?.id;
  const classes = useStyles();
  const isCreateForm = receiptId == null;
  const { register, errors, handleSubmit, watch, getValues } = useForm();

  const [warehouseId, setWarehouseId] = useState(null);
  const [bayId, setBayId] = useState(null);
  const [productList, setProductList] = useState([]);
  const [productId, setProductId] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [bayList, setBayList] = useState([]);
  const [productReceiptList, setProductReceiptList] = useState([]);
  const [receiptInfo, setReceiptInfo] = useState(null);

  const submitForm = ( data ) => {
    const requestBody = {
      "warehouseId": warehouseId,
      "receivedDate": data.datetimeReceived,
      "description": data.description,
      "receiptName": data.receiptName,
      "receiptItemList": productReceiptList
    };
    console.log("Product receipt list => ", productReceiptList);
    console.log("Request body => ", requestBody);
    request(
      "put",
      API_PATH.RECEIPT,
      (res) => {
        successNoti(isCreateForm ? "Tạo đơn nhập hàng thành công" : "Cập nhật đơn nhập hàng thành công");
        if (isCreateForm) {
          history.push(`${path.replace('/create', '')}`);
        }
      },
      {
        500: (e) => { errorNoti("Server hiện đang có lỗi. Vui lòng thử lại sau")},
        401: () => { },
        400: (e) => { errorNoti(e.response.data.errors[0].message); }
      },
      requestBody
    )
  }

  useEffect(() => {
    async function fetchData() {
      request(
        "get",
        API_PATH.PRODUCT,
        (res) => {
          setProductList(res.data);
        },
        {
          500: (e) => { errorNoti("Server hiện đang có lỗi. Vui lòng thử lại sau")},
          401: () => { },
          400: (e) => { errorNoti(e.response.data.errors[0].message); }
        }
      );

      request(
        "get",
        API_PATH.WAREHOUSE_DETAIL,
        (res) => {
          setWarehouseList(res.data);
        },
        {
          500: (e) => { errorNoti("Server hiện đang có lỗi. Vui lòng thử lại sau")},
          401: () => { },
          400: (e) => { errorNoti(e.response.data.errors[0].message); }
        }
      )

      if (isCreateForm) {
        return;
      }
      request(
        "get",
        API_PATH.RECEIPT + "/" + receiptId,
        (res) => {
          const data = res.data;
          setReceiptInfo(data);
          setWarehouseId(data.warehouseId); // for useEffect
          setProductReceiptList(data.receiptItemList);
        },
        {
          401: () => { },
          503: () => { errorNoti("Có lỗi khi tải dữ liệu") }
        }
      )
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (warehouseId != null && warehouseList.length > 0) {
      for (var i = 0; i < warehouseList.length; i++) {
        if (warehouseList[i].id == warehouseId) {
          setBayList(warehouseList[i].listShelf);
          return;
        }
      }
      setProductReceiptList([]);
      console.log("Bay list is NOT updated");
    }
  }, [warehouseId]);

  const newProductLineHandle = ( data ) => {
    console.log("Data in new line clicked => ", data);
    if (data.lotId == null || productId == null || warehouseId == null || 
      bayId == null || data.quantity == null || data.importPrice == null) {
      errorNoti("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const newProductLine = {
      productId: productId,
      warehouseId: warehouseId,
      bayId: bayId,
      ...data
    }
    console.log("New product line => ", newProductLine);
    setProductReceiptList([...productReceiptList, newProductLine]);
    console.log("New product receipt list => ", productReceiptList);
    setProductId(null);
    setBayId(null);
  }

  const getBayCodeFromBayId = (id) => {
    for (var i = 0; i < warehouseList.length; i++) {
      const listShelf = warehouseList[i].listShelf;
      if (listShelf != null && listShelf.length > 0) {
        for (var j = 0; j < listShelf.length; j++) {
          if (id == listShelf[j].id) {
            return listShelf[j].code;
          }
        }
      }
    }
    console.log("Can not find bay id in bay list ", id);
  }

  const getProductNameFromProductId = (id) => {
    for (var i = 0; i < productList.length; i++) {
      if (productList[i].productId == id) {
        return productList[i].name;
      }
    }
  }

  return (
    <Fragment>
      <Box>
        <Grid container justifyContent="space-between" 
          className={classes.headerBox} >
          <Grid>
            <Typography variant="h5">
              {isCreateForm ? "Tạo mới đơn nhập hàng" : "Xem thông tin đơn nhập hàng"}
            </Typography>
          </Grid>
          {
            isCreateForm &&
            <Grid className={classes.buttonWrap}>
              <Button variant="contained" className={classes.addButton} 
                type="submit" onClick={handleSubmit(submitForm)} >Lưu</Button>
            </Grid>
          }
        </Grid>
      </Box>

      <Box className={classes.formWrap}
          component="form">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className={classes.boxInfor}>
                  <Typography className={classes.inforTitle} variant="h6">
                    Thông tin chung
                  </Typography>

                  <Grid container spacing={3} className={classes.inforWrap}>
                    <Grid item xs={6}>
                      <Box className={classes.labelInput}>
                        Tên đơn hàng <RequireStar /></Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          inputRef={register({ required: "Vui lòng tên đơn hàng nhập" })}
                          name="receiptName"
                          value={receiptInfo?.receiptName}
                        ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={classes.labelInput}>
                        Mô tả thêm</Box>
                      <TextField
                        inputRef={register({ required: false })}
                        name="description"
                        fullWidth
                        variant="outlined"
                        size="small"
                        multiline
                        rows={4}
                        value={receiptInfo?.description}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                      <Box className={classes.labelInput}>
                        Kho nhập hàng <RequireStar /></Box>
                        <Select
                          label="warehouseId"
                          fullWidth
                          value={warehouseId}
                          defaultValue={warehouseId}
                          onChange={(e) => setWarehouseId(e.target.value)}
                        >
                          {
                            warehouseList.length > 0 &&
                            warehouseList.map(warehouse => 
                              <MenuItem value={warehouse.id}>{warehouse.name}</MenuItem>)
                          }
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <Box className={classes.labelInput}>
                          Ngày nhập hàng <RequireStar /></Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          inputRef={register({ required: "Vui lòng điền số lô nhập" })}
                          name="datetimeReceived"
                          type={"date"}
                          value={receiptInfo?.receivedDate}
                        ></TextField>
                      </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box className={classes.formWrap}
          component="form">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className={classes.boxInfor}>
                  <Typography className={classes.inforTitle} variant="h6">
                    Danh sách mặt hàng 
                    {isCreateForm && 
                    <Button variant="contained" className={classes.addButton} 
                      onClick={() => setProductReceiptList([])}>
                      Xóa
                    </Button>}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên sản phẩm <RequireStar /></TableCell>
                          <TableCell>Số lô <RequireStar /></TableCell>
                          <TableCell>Vị trí kệ hàng <RequireStar /></TableCell>
                          <TableCell>Số lượng <RequireStar /></TableCell>
                          <TableCell>Giá nhập <RequireStar /></TableCell>
                          <TableCell>Giá bán</TableCell>
                          <TableCell>Ngày hàng hết hạn</TableCell>
                        </TableRow>
                      </TableHead>
                      
                      <TableBody>
                        {
                          productReceiptList.length > 0 &&
                          productReceiptList.map(product => 
                            <TableRow>
                              <TableCell>{getProductNameFromProductId(product.productId)}</TableCell>
                              <TableCell>{product.lotId}</TableCell>
                              <TableCell>{getBayCodeFromBayId(product.bayId)}</TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>{product.importPrice}</TableCell>
                              <TableCell>{product.exportPrice}</TableCell>
                              <TableCell>{product.expiredDate}</TableCell>
                            </TableRow>
                          )
                        }
                        {
                          isCreateForm &&
                          <TableRow>
                            <TableCell>
                              <Select
                                label="productId"
                                fullWidth
                                value={productId}
                                defaultValue={productId}
                                onChange={(e) => setProductId(e.target.value)}
                              >
                              {
                                productList.length > 0 &&
                                productList.map(product => <MenuItem value={product.productId}>{product.name}</MenuItem>)
                              }
                              </Select>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputRef={register({ required: "Vui lòng điền số lô nhập" })}
                                name="lotId"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                label="bayId"
                                fullWidth
                                value={bayId}
                                defaultValue={bayId}
                                onChange={(e) => setBayId(e.target.value)}
                              >
                                {
                                  bayList.length > 0 &&
                                  bayList.map(bay => 
                                    <MenuItem value={bay.id}>{bay.code}</MenuItem>)
                                }
                              </Select>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputRef={register({ required: "Vui lòng điền số lượng hàng nhập", min: 1 })}
                                name="quantity"
                                type={"number"}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputRef={register({ required: "Vui lòng điền giá nhập hàng", min: 0 })}
                                name="importPrice"
                                type={"number"}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputRef={register({ required: false, min: 0 })}
                                name="exportPrice"
                                type={"number"}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputRef={register({ required: false })}
                                name="expiredDate"
                                type={"date"}
                              />
                            </TableCell>
                          </TableRow>
                        }

                        {
                          isCreateForm &&
                          <TableRow>
                            <Button onClick={handleSubmit(newProductLineHandle)}>
                              Thêm mới
                            </Button>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

            </Grid>
          </Box>
        </Box>
    </Fragment>
  );
}

export default ReceiptDetail;
