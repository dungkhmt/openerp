import { RequireStar } from "../components/requireStar";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { InputAdornment, TableBody, TableCell, TableContainer, 
  TableHead, TableRow } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Box, Grid, Button, Typography, TextField, Select,
  MenuItem, Modal, Table} from "@material-ui/core";
import useStyles from "../../management/styles";
import { useForm } from "react-hook-form";
import { errorNoti, successNoti } from 'utils/notification';
import { request } from 'api';
import { API_PATH } from '../apiPaths';

const DetailQuantityTable = ({ warehouseDetails, 
  setShowDetailQuantityModal, 
  initQuantityArray,
  setInitQuantityArray,
  classes,
  totalQuantity }) => {

  const [warehouseId, setWarehouseId] = useState(null);
  const [bayId, setBayId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    if (warehouseId != null && warehouseDetails.length > 0) {
      for (var i = 0; i < warehouseDetails.length; i++) {
        if (warehouseDetails[i].id == warehouseId) {
          setSelectedWarehouse(warehouseDetails[i]);
          return;
        }
      }
    }
  }, [warehouseId]);

  const newLineButtonClickHandle = () => {
    if (warehouseId == null || bayId == null || quantity <= 0) {
      errorNoti("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const newQuantity = {
      warehouseId: warehouseId,
      bayId: bayId,
      quantity: quantity
    };
    setInitQuantityArray([...initQuantityArray, newQuantity]);
    console.log("New quantity array: ", initQuantityArray);
    setWarehouseId(null);
    setBayId(null);
    setQuantity(0);
    setSelectedWarehouse(null);
  };

  const saveButtonHandle = () => {
    if (totalQuantity == 0) {
      setShowDetailQuantityModal(false)
      return;
    }
    setShowDetailQuantityModal(false);
  }

  const getWarehouseNameByWarehouseId = (id) => {
    return warehouseDetails.filter(detail => detail.id == id)
      .map(detail => detail.name)[0];
  }

  const getBayCodeByBayId = (id) => {
    for (var i = 0; i < warehouseDetails.length; i++) {
      const shelf = warehouseDetails[i].listShelf;
      if (shelf == null || shelf.length <= 0) {
        continue;
      }
      for (var j = 0; j < shelf.length; j++) {
        if (shelf[j].id == id) {
          return shelf[j].code;
        }
      }
    }
  }

  return (
    <Box>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h5">
            Số lượng ban đầu
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained"
            className={classes.addButton}
            type="submit"
            onClick={saveButtonHandle} >
              Lưu
          </Button>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kho</TableCell>
              <TableCell>Kệ</TableCell>
              <TableCell>Số lượng</TableCell>
            </TableRow>
          </TableHead>
      
          <TableBody>
            {
              initQuantityArray.length > 0 &&
              initQuantityArray.map(element =>
                <TableRow>
                  <TableCell>{getWarehouseNameByWarehouseId(element.warehouseId)}</TableCell>
                  <TableCell>{getBayCodeByBayId(element.bayId)}</TableCell>
                  <TableCell>{element.quantity}</TableCell>
                </TableRow>
                )
            }
            <TableRow>
              <TableCell>
                <Select
                  value={warehouseId}
                  label="warehouseId"
                  onChange={(e) => setWarehouseId(e.target.value)}
                  fullWidth
                >
                {
                  warehouseDetails
                    .map(detail =>
                      (<MenuItem value={detail.id}>{detail.name}</MenuItem>))
                }
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={bayId}
                  label="bayId"
                  onChange={(e) => setBayId(e.target.value)}
                  fullWidth
                >
                {
                  selectedWarehouse != null &&
                  selectedWarehouse.listShelf != null &&
                  selectedWarehouse.listShelf.length > 0 &&
                  selectedWarehouse.listShelf
                    .map(shelf => <MenuItem value={shelf.id}>{shelf.code}</MenuItem>)
                }
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="area"
                  type={"number"}
                  value={quantity}
                  error={quantity < 0}
                  onChange={(e) => setQuantity(e.target.value)}
                ></TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <Button onClick={newLineButtonClickHandle}>
                Thêm mới
              </Button>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const ProductDetail = () => {
  const classes = useStyles();
  const isCreateForm = true;
  const { register, errors, handleSubmit, watch, getValues } = useForm();

  const [totalQuantity, setTotalQuantity] = useState(0);

  const [isShowDetailQuantityModal, setShowDetailQuantityModal] = useState(false);

  const [initQuantityArray, setInitQuantityArray] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [warehouseDetails, setWarehouseDetails] = useState([]);

  const history = useHistory();
  const { path } = useRouteMatch();

  const submitForm = (data) => {
    // remove empty key-value in form data
    const entries = Object.entries(data);
    const nonEmptyOrNull = entries.filter(
      ([key, value]) => value !== '' && value !== null && value !== undefined);
    var modelData = Object.fromEntries(nonEmptyOrNull);
    modelData.initProductQuantityList = initQuantityArray;

    const requestBody = new FormData()
    requestBody.append("image", uploadedImage);
    requestBody.append("model", JSON.stringify(modelData));

    console.log("Request body -> ", requestBody);
    request(
      "put",
      API_PATH.PRODUCT,
      (res) => {
        successNoti(isCreateForm ? "Tạo sản phẩm thành công" : "Cập nhật sản phẩm thành công");
        if (isCreateForm) {
          console.log("TODO: Redirect to listing product screen")
        }
      },
      {
        401: () => { },
        400: (e) => { errorNoti(e.response.data.errors[0].message); }
      },
      requestBody
    )
  };

  useEffect(() => {
    if (uploadedImage != null) {
      setImageURL(URL.createObjectURL(uploadedImage));
      console.log("Image url ", imageURL);
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (initQuantityArray != null && initQuantityArray.length > 0) {
      var newTotalQuantity = 0;
      for (var i = 0; i < initQuantityArray.length; i++) {
        const quantity = initQuantityArray[i];
        newTotalQuantity += parseInt(quantity.quantity);
      }
      setTotalQuantity(newTotalQuantity);
    }
  }, [initQuantityArray]);

  useEffect(() => {

    async function fetchData() {
      const categoryResponse = request(
        "get",
        API_PATH.PRODUCT_CATEGORY,
        (res) => {
          console.log("Response product category request -> ", res);
          setProductCategories(res.data);
        }
      );
      const warehouseResponse = request(
        "get",
        API_PATH.WAREHOUSE_DETAIL,
        (res) => {
          console.log("warehouse response -> ", res);
          setWarehouseDetails(res.data);
          console.log("Warehouse details in fetch data -> ", warehouseDetails);
        }
      );
    }

    fetchData();

  }, []);

  return (
    <Fragment>
      <Modal open={isShowDetailQuantityModal}
        onClose={() => setShowDetailQuantityModal(!isShowDetailQuantityModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '50%',
          height: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <DetailQuantityTable
            warehouseDetails={warehouseDetails} 
            setShowDetailQuantityModal={setShowDetailQuantityModal} 
            initQuantityArray={initQuantityArray} 
            setInitQuantityArray={setInitQuantityArray} 
            classes={classes}
            totalQuantity={totalQuantity} />
        </Box>
      </Modal>

      <Box>
        <Grid container justifyContent="space-between" 
          className={classes.headerBox} >
          <Grid>
            <Typography variant="h5">
              {isCreateForm ? "Tạo mới sản phẩm" : "Xem thông tin sản phẩm"}
            </Typography>
          </Grid>
          <Grid className={classes.buttonWrap}>
            <Button variant="contained" className={classes.addButton} 
              type="submit" onClick={handleSubmit(submitForm)} >Lưu</Button>
          </Grid>
        </Grid>
      </Box>

      <Box className={classes.formWrap}
          component="form">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box className={classes.boxInfor}>
                <Typography className={classes.inforTitle} variant="h6">
                  Thông tin cơ bản
                </Typography>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>
                      Tên sản phẩm <RequireStar /></Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền tên sản phẩm" })}
                      name="name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>
                      Mã sản phẩm <RequireStar /></Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền mã sản phẩm" })}
                      name="code"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Phân loại</Box>
                    <Select
                      label="categoryId"
                      {...register("categoryId", { required: false })}
                      fullWidth
                    >
                      {
                        productCategories.length > 0 &&
                        productCategories.map(category => 
                          <MenuItem value={category.categoryId}>
                            {category.name}
                          </MenuItem>)
                      }
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Đơn vị tính</Box>
                    <Select
                      label="uom"
                      {...register("uom", { required: false })}
                      fullWidth
                    >
                      <MenuItem value={"Cái"} >Cái</MenuItem>
                      <MenuItem value={"Kg"}>Kg</MenuItem>
                      <MenuItem value={"Gói"}>Gói</MenuItem>
                    </Select>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Chiều cao (cm)</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="height"
                      inputRef={register({ required: false })}
                      type={"number"}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Diện tích đáy (cm2)</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="area"
                      inputRef={register({ required: false })}
                      type={"number"}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Khối lượng (kg)</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="weight"
                      inputRef={register({ required: false })}
                      type={"number"}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Số lượng ban đầu</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="initQuantity"
                      type={"number"}
                      value={totalQuantity}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="end">
                            <Button onClick={() => setShowDetailQuantityModal(true)}>
                              <FormatListBulletedIcon />
                            </Button>
                          </InputAdornment>
                        )
                      }}
                    ></TextField>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={classes.boxInfor}>
                <Typography className={classes.inforTitle} variant="h6">
                  Ảnh sản phẩm</Typography>
                <Button variant="contained" component="label" >
                  Tải ảnh lên
                  <input type="file" hidden onChange={(e) => {
                    setUploadedImage(e.target.files[0]); 
                    console.log(e.target.files[0]);
                  }} />
                </Button>
                <Box>
                  <img src={imageURL} width={"100%"} height={"100%"} />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box className={classes.boxInfor}>
                <Typography className={classes.inforTitle} variant="h6">
                  Thông tin giá (trên 1 sản phẩm)
                </Typography>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>
                      Giá nhập (VNĐ) <RequireStar /></Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền giá nhập" })}
                      name="importPrice"
                      type={"number"}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Thuế (%)</Box>
                    <TextField
                      fullWidth
                      inputRef={register({ required: false })}
                      variant="outlined"
                      size="small"
                      name="taxPercentage"
                      type={"number"}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>
                      Giá bán buôn (VNĐ) <RequireStar /></Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền giá bán buôn" })}
                      name="wholeSalePrice"
                      type={"number"}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>
                      Giá bán lẻ (VNĐ) <RequireStar /></Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng nhập giá bán lẻ" })}
                      name="retailPrice"
                      type={"number"}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    ></TextField>
                  </Grid>
                </Grid>

              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={classes.boxInfor}>
                <Typography className={classes.inforTitle} variant="h6">
                  Mô tả thêm</Typography> 
                <TextField
                  inputRef={register({ required: false })}
                  name="description"
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  rows={4}
                ></TextField>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );

}

export default ProductDetail;