import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, OutlinedInput, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import useStyles from "./ImportDetail.style";
import { useHistory, useParams, useRouteMatch } from 'react-router';
import { request } from 'api';
import { formatCurrency, formatDate, getImportStatus, getStatus, setCanvasSize } from '../../utilities';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { Layer, Rect, Stage } from 'react-konva';
import { errorNoti, successNoti } from 'utils/notification';
import { Link } from '@mui/material';

function ImportDetail() {

  const { register, errors, handleSubmit, watch, getValues } = useForm();

  const classes = useStyles();
  const [importOrder, setImportOrder] = useState({});
  const [facility, setFacility] = useState({});
  const [currentLineItem, setCurrentLineItem] = useState({});
  const [lineItems, setLineItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();
  const { path } = useRouteMatch();
  const [listShelf, setListShelf] = useState([]);

  const [pos, setPos] = useState();
  const [shelf, setShelf] = useState();
  const [width, setWidth] = useState();
  const [warehouseHeight, setWarehouseHeight] = useState();
  const [height, setHeight] = useState();
  const [scale, setScale] = useState();
  const [facilityNum, setFacilityNum] = useState();
  const [shelfId, setShelfId] = useState();
  const [reload, setReload] = useState(false);

  let { id } = useParams();

  const getImportDetail = () => {
    request(
      "get",
      `admin/wms/import/${id}`,
      (res) => {
        setImportOrder(res.data);
        setFacility(res.data.facility)
        setLineItems(res.data.lineItems)
        setListShelf(res.data.facility.listShelf)
      },
      {
        onError: (res) => {
          console.log("getImportDetail", res)
        },
      }
    );
  };

  useEffect(() => {
    getImportDetail();
  }, [reload]);

  const addAnother = () => {
    history.push(`${path.replace("/:id","/create")}`);
  }
  const exitButton = () => {
    history.push(`${path.replace("/:id","")}`);
  }
  const putIntoShelf = (item) => {
    setOpenDialog(true)
    setCurrentLineItem(item);
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const showFacility = () => {
    // setWarehouseHeight()
    // setScale()
    // setWarehouseHeight(node.getBoundingClientRect().width * warehouesData.facilityLenght / warehouesData.facilityWidth)
  }
  let submitForm = (data) => {
    data.shelfId = shelfId
    data.lineItemId = currentLineItem.id
    data.variantId = currentLineItem.variantId
    request(
      "post",
      "/admin/wms/import/put-to-shelf",
      (res) => {
        // let id = res.data.id;
        successNoti("Thành công")
        setOpenDialog(false)
        setReload(!reload);
        // history.push(`${path.replace('/create', '')}/${id}`);
      },
      {
        onError: (error) => {
          errorNoti(
            "Đã có lỗi xảy ra. Vui lòng kiểm tra số lượng và thử lại."
          );
        },
      },
      data
    );
  };

  const stageCanvasRef = useCallback((node) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
      setWarehouseHeight(node.getBoundingClientRect().width * facility.facilityLenght / facility.facilityWidth)
      setScale(node.getBoundingClientRect().width / facility.facilityWidth)
    }
  }, [facility]);

  const warehouseBox = (data, maxSize) => {
    return (
      <Rect
        key={data.shelfId}
        x={setCanvasSize(data.x, maxSize)}
        y={setCanvasSize(data.y, maxSize)}
        width={setCanvasSize(data.width, maxSize)}
        height={setCanvasSize(data.lenght, maxSize)}
        fill={"#87CEFA"}
        stroke='#1976d2'
        strokeWidth={2}
        onMouseEnter={e => {
          e.target._clearCache();
          let mousePos = e.target.getAbsolutePosition();
          setPos(mousePos)
          setShelf(e.target.index)
          const container = e.target.getStage().container();
          container.style.cursor = "pointer";
        }}
        onClick={e => {
          setFacilityNum(e.target.index)
          setShelfId(data.shelfId)
        }}
        onMouseOut={e => {
          setPos(null)
          setShelf(null)
        }}
      />
    );
  }

  return (
    <Fragment>
      <Box className={classes.productPage} >
        <Grid container justifyContent="space-between" className={classes.headerBox} >
          <Grid>
            <Typography variant="h5">
              {/* {product?.name} */}
              Chi tiết đơn nhập hàng
            </Typography>
          </Grid>
          <Grid className={classes.btnWrap}>
            <Grid className={classes.exitBtnWrap}>
              <Button variant="outlined" className={classes.exitBtn} onClick={exitButton} >Thoát</Button>
            </Grid>
            <Grid className={classes.editBtnWrap}>
              <Button variant="contained" className={classes.addButton} onClick={addAnother} >Tạo đơn nhập khác</Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Thông tin chung
              </Typography>

              <Grid container spacing={3} className={classes.inforWrap}>
                <Grid item xs={3} container direction="column">
                  <Typography className={classes.label}>Mã đơn</Typography>
                  <Typography className={classes.label}>Trạng thái</Typography>
                  <Typography className={classes.label}>Ngày tạo đơn</Typography>
                  <Typography className={classes.label}>Tổng giá trị</Typography>
                  <Typography className={classes.label}>Số loại sản phẩm</Typography>
                </Grid>
                <Grid item xs={9} container direction="column">
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> <b>{importOrder?.code} </b>
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {getImportStatus(importOrder?.status, 26)}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {formatDate(importOrder?.createAt)}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {importOrder?.total}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {importOrder?.lineItems?.length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

          </Grid>
          <Grid item xs={5}>
            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Thông tin kho
              </Typography>

              <Grid container spacing={3} className={classes.inforWrap}>
                <Grid item xs={3} container direction="column">
                  <Typography className={classes.label}>Tên kho</Typography>
                  <Typography className={classes.label}>Mã kho</Typography>
                  <Typography className={classes.label}>Địa chỉ</Typography>
                  <Typography className={classes.label}>Kích thước</Typography>
                  <Typography className={classes.label}>Số kệ hàng</Typography>
                </Grid>
                <Grid item xs={9} container direction="column">
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> <b>{facility?.name} </b>
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> 
                    <Link style={{marginLeft: 3}} href={`${path.replace('/inventory/import/:id','/warehouse')}/${facility.id}`} underline="none">
                      {facility?.code}
                    </Link>
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {facility?.address}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {facility?.facilityWidth} m x {facility?.facilityLenght} m
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {facility?.listShelf?.length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Box className={classes.boxInfor}>
          <Typography className={classes.inforTitle} variant="h6">
            Danh sách sản phẩm
          </Typography>

          <TableContainer className={classes.tableWrap}>
            <Table stickyHeader size="small" >
              <TableHead  >
                <TableRow>
                  <TableCell style={{ width: '10%' }} align="left">SKU</TableCell>
                  <TableCell style={{ width: '30%' }} align="left">Tên sản phẩm</TableCell>
                  <TableCell style={{ width: '10%' }} align="center">Tổng Số lượng</TableCell>
                  <TableCell style={{ width: '17%' }} align="center">Số lượng chưa lên kệ</TableCell>
                  <TableCell style={{ width: '10%' }} align="center">Giá nhập</TableCell>
                  <TableCell style={{ width: '10%' }} align="center">Tổng tiền</TableCell>
                  <TableCell style={{ width: '13%' }} align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {
                  lineItems &&
                  lineItems.sort((a, b) => (b.productId - a.productId)).map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">
                      <Link style={{marginLeft: 3}} href={`${path.replace('/inventory/import/:id','/warehouse/products')}/${row.productId}`} underline="none">
                      {row.sku}
                    </Link>
                        </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="center">{row.currentQuantity}</TableCell>
                      <TableCell align="right">{formatCurrency(row.importPrice)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                      <TableCell align="center">
                        <Grid className={classes.editBtnWrap}>
                          <Button variant="contained" className={classes.addButton} onClick={() => { putIntoShelf(row) }} >Xếp Hàng</Button>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Dialog
          fullWidth
          maxWidth='lg'
          onClose={handleCloseDialog}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
            Xếp sản phẩm vào kệ
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers >
            <Grid container style={{ boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)" }}>
              <Grid container xs={7} spacing={3} className={classes.inforWrap}>
                {/* <Box className={classes.inforWrap}> */}
                <Grid item xs={4} direction="column">
                  <Typography className={classes.label}>Tên sản phẩm</Typography>
                  <Typography className={classes.label}>Mã sản phẩm</Typography>
                  <Typography className={classes.label}>Số lượng có thể nhập kho</Typography>
                </Grid>
                <Grid item xs={8} direction="column">
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> <b>{currentLineItem?.name} </b>
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {currentLineItem?.sku}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {currentLineItem?.currentQuantity}
                  </Typography>
                </Grid>
                {/* </Box> */}
              </Grid>

              <Grid container xs={5} spacing={3} className={classes.inforWrap}>
                {/* <Box className={classes.inforWrap}> */}
                <Grid item xs={12}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Số lượng
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      variant='outlined'
                      inputRef={register({ required: true },)}
                      name="quantity"
                      className={classes.settingInput}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Kệ hàng số
                    </Box>
                    <TextField
                      type="number"
                      value={facilityNum}
                      size="small"
                      fullWidth
                      variant='outlined'
                      name="facilityNum"
                      inputRef={register({ required: true })}
                      className={classes.settingInput}
                      helperText="Chọn ở danh sách kệ hàng bên dưới"
                    />
                  </Box>
                </Grid>
                {/* </Box> */}
              </Grid>
            </Grid>

              <Box className={classes.boxInfor} style={{marginTop: 20, marginBottom: 0}}>
            <Typography className={classes.inforTitle} variant="h6">
              Danh sách kệ hàng 
            </Typography>
            </Box>
            <Box className={classes.canvasWrap}>
              <Box className={classes.stageWrap} ref={stageCanvasRef} >
                <Stage
                  width={width}
                  height={1280 * facility.facilityLenght / facility.facilityWidth}
                >
                  <Layer>
                    <Rect
                      width={width}
                      height={warehouseHeight}
                      x={0} y={0}
                      fill="#FFFEFA"
                      strokeWidth={3}
                      stroke="#89C4FA"
                      cornerRadius={3}
                    />
                    {listShelf.map((data) => (
                      warehouseBox(data, scale)
                    ))}
                  </Layer>

                </Stage>
                {
                  shelf && pos &&
                  <Typography style={{ position: "absolute", top: pos.y + 8 + "px", left: pos.x + 8 + "px", padding: "4px", boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)", borderRadius: 3, background: "#FFF", }}>
                    Kệ số {shelf}
                  </Typography>
                }
              </Box>
            </Box>



          </DialogContent>
          <DialogActions>
            <Grid className={classes.editBtnWrap}>
              <Button variant="contained" className={classes.addButton} onClick={handleSubmit(submitForm)} >Xếp Hàng</Button>
            </Grid>
          </DialogActions>
        </Dialog>
      </Box>
    </Fragment>
  )
}

export default ImportDetail