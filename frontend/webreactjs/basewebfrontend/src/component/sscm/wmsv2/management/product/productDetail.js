import { InputAdornment, TableBody, TableCell, TableContainer, 
  TableHead, TableRow } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Box, Grid, Button, Typography, TextField, Select,
  MenuItem, Modal, Table} from "@material-ui/core";
import useStyles from "../../management/styles";
import { useForm } from "react-hook-form";
import { errorNoti } from 'utils/notification';

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

    try {
      const currQuantity = initQuantityArray
        .map(element => parseInt(element.quantity))
        .reduce((prev, next) => prev + next);
      if (currQuantity != totalQuantity) {
        errorNoti("Vui lòng nhập tổng số lượng chính xác.");
      } else {
        setShowDetailQuantityModal(false)
      }
    } catch (e) {
      errorNoti("Có lỗi xảy ra. Vui lòng thử lại");
    }
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

  const [category, setCategory] = useState(null);
  const [unit, setUnit] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [isShowDetailQuantityModal, setShowDetailQuantityModal] = useState(false);
  const warehouseDetails = [
    {
      "id": "89d07474-1dfa-4ee4-8815-fabfd94afa01",
      "address": "Ô mai Hồng Lam Trương Định, 540, Truong Dinh Road, Hanoi, 11617, Vietnam",
      "code": "BKA01",
      "name": "Kho BKA",
      "warehouseLength": 2000,
      "warehouseWidth": 1000,
      "longitude": 105.8460658,
      "latitude": 20.9842,
      "listShelf": []
    },
    {
      "id": "19719f2d-f4e5-4186-98a0-ab4671c91807",
      "address": "12 Cầu Bươu, Đường Cầu Bươu, Phường Kiến Hưng, Thanh Tri District, Hanoi, 11718, Vietnam",
      "code": "BKA02",
      "name": "Kho không kệ",
      "warehouseLength": 0,
      "warehouseWidth": 0,
      "longitude": 105.8038293,
      "latitude": 20.9593502,
      "listShelf": []
    },
    {
      "id": "f520712e-ada3-45f7-8e1b-fdc39a48619d",
      "address": "Ha Nam province, Vietnam",
      "code": "TGDĐ",
      "name": "Kho Thế giới di động",
      "warehouseLength": 200,
      "warehouseWidth": 150,
      "longitude": 105.9543527,
      "latitude": 20.5269088,
      "listShelf": [
        {
          "id": "d96d73d7-75d9-465d-8a79-5456b39ffb0a",
          "code": "A01",
          "x": 0,
          "y": 0,
          "width": 10,
          "length": 10
        },
        {
          "id": "a0b1a5b4-3c27-4f60-a505-8357bcd4e58a",
          "code": "A02",
          "x": 15,
          "y": 0,
          "width": 10,
          "length": 10
        }
      ]
    },
    {
      "id": "0d1fd0ad-69b5-4bbd-9564-90688a5df6b0",
      "address": "Hoàn Kiếm, Phuoc Hoa District, Nha Trang, Khánh Hòa Province, 65000, Vietnam",
      "code": "BK0001",
      "name": "Kho Bach Khoa",
      "warehouseLength": 500,
      "warehouseWidth": 300,
      "longitude": 109.1821144,
      "latitude": 12.2392953,
      "listShelf": [
        {
          "id": "45e9f39c-6900-4d11-af23-ce2f8d66196e",
          "code": "A01",
          "x": 0,
          "y": 0,
          "width": 50,
          "length": 50
        },
        {
          "id": "84652a43-7714-4630-9230-22e6daff511c",
          "code": "A02",
          "x": 0,
          "y": 60,
          "width": 50,
          "length": 50
        }
      ]
    }
  ];
  const [initQuantityArray, setInitQuantityArray] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const submitForm = (data) => {
    console.log("Category: ", category, ", unit: ", unit);
  };

  useEffect(() => {
    if (uploadedImage != null) {
      setImageURL(URL.createObjectURL(uploadedImage));
      console.log("Image url ", imageURL);
    }
  }, [uploadedImage])

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
                    <Box className={classes.labelInput}>Tên sản phẩm</Box>
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
                    <Box className={classes.labelInput}>Mã sản phẩm</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền mã sản phẩm" })}
                      name="name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Phân loại</Box>
                    <Select
                      value={category}
                      label="category"
                      onChange={(e) => setCategory(e.target.value)}
                      fullWidth
                    >
                    {/* TODO: Hard code here */}
                      <MenuItem value={1}>Đồ bếp</MenuItem>
                      <MenuItem value={2}>Tivi</MenuItem>
                      <MenuItem value={3}>Tủ lạnh</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Đơn vị tính</Box>
                    <Select
                      value={unit}
                      label="unit"
                      onChange={(e) => {
                        console.log("On change select e: ", e);
                        setUnit(e.target.value)}}
                      fullWidth
                    >
                    {/* TODO: Hard code here */}
                      <MenuItem value={1}>Cái</MenuItem>
                      <MenuItem value={2}>Kg</MenuItem>
                      <MenuItem value={3}>Gói</MenuItem>
                    </Select>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Chiều cao (m)</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="height"
                      type={"number"}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Diện tích đáy (m2)</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="area"
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
                      type={"number"}
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Số lượng ban đầu</Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      name="height"
                      type={"number"}
                      onChange={(e) => setTotalQuantity(e.target.value)}
                      value={totalQuantity}
                      InputProps={{startAdornment: (
                        <InputAdornment position="end">
                          <Button onClick={() => setShowDetailQuantityModal(true)}>
                            <FormatListBulletedIcon />
                          </Button>
                        </InputAdornment>
                      )}}
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
                    <Box className={classes.labelInput}>Giá nhập (VNĐ)</Box>
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
                      variant="outlined"
                      size="small"
                      name="tax"
                      type={"number"}
                    ></TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.inforWrap}>
                  <Grid item xs={6}>
                    <Box className={classes.labelInput}>Giá bán buôn (VNĐ)</Box>
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
                    <Box className={classes.labelInput}>Giá bán lẻ (VNĐ)</Box>
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
                  Note</Typography>
                <TextField
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