import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, OutlinedInput, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import useStyles from "./ExportDetail.style";
import { useHistory, useParams, useRouteMatch } from 'react-router';
import { request } from 'api';
import { formatCurrency, formatDate, getImportStatus, getStatus, setCanvasSize } from '../../utilities';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { Layer, Rect, Stage } from 'react-konva';
import { errorNoti, successNoti } from 'utils/notification';
import { Link } from '@mui/material';
import CurrencyTextField from '@unicef/material-ui-currency-textfield/dist/CurrencyTextField';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function ExportDetail() {

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
  const [shelfHasVariant, setShelfHasVariant] = useState([]);
  const [shelfVariants, setShelfVariants] = useState([]);
  const [exportShelfVariantResponses, setExportShelfVariantResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);

  const [allShelfVariant, setAllShelfVariant] = useState([]);
  const [planing, setPlaning] = useState();

  let { id } = useParams();

  const getImportDetail = () => {
    request(
      "get",
      `admin/wms/export/${id}`,
      (res) => {
        setImportOrder(res.data);
        setFacility(res.data.facility)
        setLineItems(res.data.lineItems)
        // lineItems
        setListShelf(res.data.facility.listShelf)
        setShelfVariants(res.data.facility.shelfVariants)
      },
      {
        onError: (res) => {
          console.log("getExportDetail", res)
        },
      }
    );
  };

  const getAllShelfVariantInFacility = (id) => {
    request(
      "get",
      `/admin/wms/warehouse/products/shelf/facility/${id}`,
      (res) => {
        setAllShelfVariant(res.data)
      },
      {
        onError: (res) => {
          console.log("getAllShelfVariantInFacility", res)
        },
      }
    );
  };

  const getShelfByVariant = (variantId) => {
    request(
      "get",
      `admin/wms/export/variant/${variantId}`,
      (res) => {
        setShelfHasVariant(res.data);
      },
      {
        onError: (res) => {
        },
      }
    );
  };

  useEffect(() => {
    getImportDetail();
  }, [reload]);

  useEffect(() => {
    getAllShelfVariantInFacility(facility.id);
  }, [facility]);

  const addAnother = () => {
    history.push(`${path.replace("/:id", "/create")}`);
  }
  const exitButton = () => {
    history.push(`${path.replace("/:id", "")}`);
  }
  const putIntoShelf = (item, index) => {
    setOpenDialog(true)
    setCurrentIndex(index)
    setCurrentLineItem(item);

    getShelfByVariant(item.variantId);
    if (lineItems[currentIndex].exportShelfVariantResponses) {
      const sumQuantity = lineItems[currentIndex].exportShelfVariantResponses.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
      lineItems[currentIndex].sumQuantity = sumQuantity
      const newLineItems = [...lineItems]
      setLineItems(newLineItems)
    }
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleCloseConfirm = () => {
    setOpenConfirm(false)
  }
  const closePlan = () => {
    setOpenPlan(false)
  }


  const addExportShelfVariantResponsesLineItem = (value, num) => {

    const shelfVariant = shelfVariants.find(item => item.shelfId === value.shelfId && item.variantId === currentLineItem.variantId)
    const lineItemIndex = lineItems.findIndex(item => item.variantId === shelfVariant.variantId)


    const items = lineItems[lineItemIndex].exportShelfVariantResponses ? lineItems[lineItemIndex].exportShelfVariantResponses : [];
    const list = [...items]

    value.totalQuantity = shelfVariant.quantity;
    value.shelfVariant = shelfVariant;
    value.shelfVariantId = shelfVariant.id;
    value.exportLineItemId = lineItems[lineItemIndex].id;

    const find = list.find(item => item.shelfVariantId === value.shelfVariantId && item.exported != true);

    // value.quantity = 0;

    if (!find || find.exported === true) {
      value.shelfNum = num
      value.quantity = 0;
      list.push(value)
      // currentLineItem.
      lineItems[lineItemIndex].exportShelfVariantResponses = list;
      setExportShelfVariantResponses(list)
      // updateTotal(list)
      // if(lineItems[currentIndex].exportShelfVariantResponses[])
      // const sumQuantity = lineItems[currentIndex].exportShelfVariantResponses.map(item => {item.quantity? item.quantity : 0}).reduce((prev, curr) => prev + curr, 0);
      // lineItems[currentIndex].sumQuantity = sumQuantity
      // const newLineItems = [...lineItems]
      // setLineItems(newLineItems)
    }
  }

  const createExportShelfVariant = () => {
    const data = lineItems[currentIndex].exportShelfVariantResponses
    let sumQuantity = 0;
    sumQuantity = data.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
    if (isNaN(sumQuantity) || sumQuantity === 0) {
      errorNoti(
        "Số lượng lấy không hợp lệ, vui lòng kiểm tra lại"
      );
    } else if (sumQuantity > lineItems[currentIndex].totalQuantity) {
      setOpenConfirm(true)
    } else {
      submitCreate()
      setOpenConfirm(false)
    }
  }

  const submitCreate = () => {
    const data = {};
    data.shelfVariants = lineItems[currentIndex].exportShelfVariantResponses
    data.sumQuantity = lineItems[currentIndex].sumQuantity
    data.getQuantity = lineItems[currentIndex].totalQuantity
    data.exportLineItemId = lineItems[currentIndex].id
    request(
      "post",
      "/admin/wms/export/create-export",
      (res) => {
        // let id = res.data.id;
        successNoti("Thành công")
        setOpenDialog(false)
        setOpenConfirm(false)
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
  }
  const submitConfirmExported = (row, index) => {

    const data = row;
    if (lineItems[currentIndex].exportShelfVariantResponses[index].quantity <= 0) {
      errorNoti(
        "Số lượng sản phẩm không hợp lệ"
      );
    }
    else {
      request(
        "post",
        "/admin/wms/export/create-export/confirm",
        (res) => {
          // let id = res.data.id;
          successNoti("Thành công")
          setReload(!reload);
          setOpenDialog(false)
          // setOpenConfirm(false)
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

    }

    // lineItems[currentIndex].exportShelfVariantResponses[index].exported = true;
    // const oldQuantity = lineItems[currentIndex].exportShelfVariantResponses[index].shelfVariant.quantity
    // lineItems[currentIndex].exportShelfVariantResponses[index].shelfVariant.quantity = oldQuantity - lineItems[currentIndex].exportShelfVariantResponses[index].quantity;
    // const newLineItems = [...lineItems]
    // setLineItems(newLineItems)

  }

  const removeExportShelfVariantLineItem = (value, index) => {
    const exportShelfVariants = lineItems[currentIndex].exportShelfVariantResponses;
    const list = [...exportShelfVariants]
    list.splice(index, 1)
    lineItems[currentIndex].exportShelfVariantResponses = list
    setExportShelfVariantResponses(list)
    const sumQuantity = lineItems[currentIndex].exportShelfVariantResponses.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
    lineItems[currentIndex].sumQuantity = sumQuantity
    const newLineItems = [...lineItems]
    setLineItems(newLineItems)

  }


  const stageCanvasRef = useCallback((node) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
      setWarehouseHeight(node.getBoundingClientRect().width * facility.facilityLenght / facility.facilityWidth)
      setScale(node.getBoundingClientRect().width / facility.facilityWidth)
    }
  }, [facility]);

  function checkContain(shelfId, shelfHasVariant) {
    if (shelfHasVariant.length > 0 && shelfHasVariant.find(shelf => shelf.shelfId === shelfId)) {
      const item = shelfHasVariant.find(shelf => shelf.shelfId === shelfId);
      if (item.quantity > 0) {
        return true
      } else return false
    } else return false;
  }

  const changeQuantity = (item, value, index) => {
    const items = lineItems[currentIndex].exportShelfVariantResponses;
    const list = [...items];
    lineItems[currentIndex].exportShelfVariantResponses[index].quantity = value;
    const sumQuantity = lineItems[currentIndex].exportShelfVariantResponses.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
    lineItems[currentIndex].sumQuantity = sumQuantity
    const newLineItems = [...lineItems]
    setLineItems(newLineItems)

  }

  const searchPlan = () => {
    const data = {};
    data.listShelf = facility.listShelf;
    data.variants = allShelfVariant;
    data.lineItems = lineItems;


    request(
      "post",
      "/admin/wms/controller/planing/search",
      (res) => {
        setPlaning(res.data)
        setOpenPlan(true)
      },
      {
        onError: (error) => {
          errorNoti(
            "Đã có lỗi xảy ra. Vui lòng kiểm tra và thử lại."
          );
        },
      },
      data
    );
  }


  const DialogCustom = ({ open, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">
          {"Số lượng lấy lớn hơn số lượng cần lấy"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              Số lượng cần lấy : {lineItems[currentIndex].totalQuantity}
            </Typography>
            <Typography>
              Tổng số lượng lấy : {lineItems[currentIndex].sumQuantity}
            </Typography>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Sửa lại</Button>
          <Button autoFocus onClick={submitCreate}>
            Tiếp tục lấy
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  // const DidalogPlan = ({ open, onClose }) => {
  //   return (
  //     <Dialog open={open} onClose={onClose}>
  //       <DialogTitle id="alert-dialog-title">
  //         {"Lộ trình lấy hàng"}
  //       </DialogTitle>
  //       <DialogContent>
  //         {
  //           planing && planing.map((row, index) => (

  //             <Grid container spacing={3}>
  //               <Grid item xs={2} >
  //                 <Typography>
  //                   Kệ hàng số
  //                 </Typography>
  //               </Grid>
  //               <Grid item xs={10} >
  //                 <TableContainer className={classes.tableWrap}>
  //                   <Table stickyHeader size="small" >
  //                     <TableHead  >
  //                       <TableRow>
  //                         <TableCell style={{ width: '10%' }} align="left">SKU</TableCell>
  //                         <TableCell style={{ width: '30%' }} align="left">Tên sản phẩm</TableCell>
  //                         <TableCell style={{ width: '10%' }} align="center">Số lượng</TableCell>
  //                       </TableRow>
  //                     </TableHead>
  //                     <TableBody className={classes.tableBody}>
  //                       {
  //                         lineItems &&
  //                         lineItems.filter(item => (item.quantity > 0)).map((row, index) => (
  //                           <TableRow
  //                             key={index}
  //                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  //                           >
  //                             <TableCell align="left">
  //                               {row?.variant?.sku}
  //                             </TableCell>
  //                             <TableCell align="left">{row.variant?.name}</TableCell>
  //                             <TableCell align="center">{row.quantity}</TableCell>
  //                           </TableRow>
  //                         ))}
  //                     </TableBody>
  //                   </Table>
  //                 </TableContainer>
  //               </Grid>
  //             </Grid>
  //           ))
  //                         }
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleCloseConfirm}>Xác nhận</Button>
  //       </DialogActions>
  //     </Dialog>
  //   )
  // }

  const warehouseBox = (data, maxSize, shelfHasVariant) => {
    return (
      <Rect
        key={data.shelfId}
        x={setCanvasSize(data.x, maxSize)}
        y={setCanvasSize(data.y, maxSize)}
        width={setCanvasSize(data.width, maxSize)}
        height={setCanvasSize(data.lenght, maxSize)}
        fill={checkContain(data.shelfId, shelfHasVariant) ? "#90EC70" : "#87CEFA"}
        stroke={checkContain(data.shelfId, shelfHasVariant) ? "#009F23" : "#1976d2"}
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
          if (checkContain(data.shelfId, shelfHasVariant)) {
            setFacilityNum(e.target.index)
            addExportShelfVariantResponsesLineItem(data, e.target.index)
            // setShelfId(data.shelfId)
          }
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
              Chi tiết đơn xuất hàng
            </Typography>
          </Grid>
          <Grid className={classes.btnWrap}>
            <Grid className={classes.exitBtnWrap}>
              <Button variant="outlined" className={classes.exitBtn} onClick={exitButton} >Thoát</Button>
            </Grid>
            <Grid className={classes.editBtnWrap}>
              <Button variant="contained" className={classes.addButton} onClick={addAnother} >Tạo đơn khác</Button>
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
                    <Link style={{ marginLeft: 3 }} href={`${path.replace('/inventory/export/:id', '/warehouse')}/${facility.id}`} underline="none">
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
          <Box style={{display:"flex", justifyContent: "space-between"}}>
          <Typography className={classes.inforTitle} variant="h6">
            Danh sách sản phẩm
          </Typography>
            <Box component="span" style={{ fontSize: "18px !important",margin: "5px 20px ", textTransform: "none" }}
              className={classes.editBtnWrap}
            >
              <Button variant="contained" className={classes.addButton} style={{margin: 0}} onClick={searchPlan} >Gợi ý lấy hàng</Button>
            </Box>
          </Box>



          <TableContainer className={classes.tableWrap}>
            <Table stickyHeader size="small" >
              <TableHead  >
                <TableRow>
                  <TableCell style={{ width: '10%' }} align="left">SKU</TableCell>
                  <TableCell style={{ width: '30%' }} align="left">Tên sản phẩm</TableCell>
                  <TableCell style={{ width: '10%' }} align="center">Cần lấy</TableCell>
                  <TableCell style={{ width: '17%' }} align="center">Số lượng đã lấy</TableCell>
                  <TableCell style={{ width: '10%' }} align="center">Giá xuất hàng</TableCell>
                  <TableCell style={{ width: '10%' }} align="center">Tổng tiền</TableCell>
                  <TableCell style={{ width: '13%' }} align="left"></TableCell>
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
                      <TableCell align="left">
                        <Link style={{ marginLeft: 3 }} href={`${path.replace('/inventory/export/:id', '/warehouse/products')}/${row.productId}`} underline="none">
                          {row.variant?.sku}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{row.variant?.name}</TableCell>
                      <TableCell align="center">{row.totalQuantity}</TableCell>
                      <TableCell align="center">{row.totalQuantity - row.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(row.retailPrice)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                      <TableCell align="center">
                        <Grid className={classes.editBtnWrap}>
                          <Button variant="contained" className={classes.addButton} onClick={() => { putIntoShelf(row, index) }} >Lấy Hàng</Button>
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
          <DialogCustom
            onClose={handleCloseConfirm}
            open={openConfirm}
          />
          <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <Box style={{ width: "35%" }}>
                {currentLineItem?.variant?.name}
              </Box>
              <Box style={{ width: "25%", fontSize: 18, fontWeight: 500 }}>
                Cần lấy:  {lineItems[currentIndex] ? lineItems[currentIndex].totalQuantity : 0}
              </Box>
              <Box style={{ width: "25%", fontSize: 18, fontWeight: 500 }}>
                Tổng số lấy: {lineItems[currentIndex] && lineItems[currentIndex].sumQuantity ? lineItems[currentIndex].sumQuantity : 0}
              </Box>
            </Box>
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
              <TableContainer className={classes.tableWrap}>
                <Table stickyHeader size="small" >
                  <TableHead  >
                    <TableRow>
                      <TableCell style={{ width: '15%' }} align="left">Kệ hàng số</TableCell>
                      <TableCell style={{ width: '15%' }} align="left">Số lượng còn</TableCell>
                      <TableCell style={{ width: '20%' }} align="left">Số lượng lấy</TableCell>
                      <TableCell style={{ width: '40%' }} align="center">Xác nhận lấy hàng</TableCell>
                      <TableCell style={{ width: '10%' }} align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.tableBody}>
                    {lineItems[currentIndex] &&
                      lineItems[currentIndex].exportShelfVariantResponses &&
                      // exportShelfVariantResponses &&
                      lineItems[currentIndex].exportShelfVariantResponses.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="left">{row.shelfNum}</TableCell>
                          <TableCell align="left">{row.shelfVariant?.quantity}</TableCell>
                          <TableCell align="left">
                            <CurrencyTextField
                              fullWidth
                              variant="outlined"
                              currencySymbol=""
                              decimalPlaces={0}
                              disabled={row.exported ? row.exported : false}
                              value={row.quantity}
                              onChange={(event, value) => changeQuantity(row, value, index)}
                              size="small"
                              // maximumValue={99999999999}
                              maximumValue={row.id ? 999999999 : row.shelfVariant?.quantity}
                            />
                          </TableCell>


                          <TableCell align="center">
                            <Box className={classes.editBtnWrap}
                            >
                              <Button variant="contained" disabled={row.exported ? row.exported : false} className={classes.addButton} onClick={() => { submitConfirmExported(row, index) }} >Xác nhận Lấy hàng</Button>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Button disabled={row.exported ? row.exported : false} className={classes.removeIconBox}
                              onClick={() => removeExportShelfVariantLineItem(row, index)}
                            >
                              <HighlightOffIcon className={classes.removeIcon} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>


            <Box className={classes.boxInfor} style={{ marginTop: 20, marginBottom: 0 }}>
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
                      warehouseBox(data, scale, shelfHasVariant)
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
              {/* <Button variant="contained" className={classes.addButton} onClick={handleSubmit(submitForm)} >Xếp Hàng</Button> */}
              <Button variant="contained" className={classes.addButton} onClick={createExportShelfVariant} >Lưu</Button>
            </Grid>
          </DialogActions>
        </Dialog>

        <Dialog fullWidth maxWidth='md' open={openPlan} onClose={closePlan}>
          <DialogTitle id="plan-dialog-title" className={classes.planBoxHeader} >
            <Box style={{ color: "#FFF" }}>
              Lộ trình lấy hàng
            </Box>
            <IconButton
              aria-label="close"
              onClick={closePlan}
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
          <DialogContent>
            {
              planing && planing.map((row, index) => (
                <Grid container key={index} spacing={3} className={classes.planBox}>
                  <Grid item xs={2} >
                    <Typography>
                      Kệ hàng số {row.shelf?.num}
                    </Typography>
                  </Grid>
                  <Grid item xs={10} >
                    <TableContainer className={classes.tablePlanWrap}>
                      <Table stickyHeader size="small" >
                        <TableHead  >
                          <TableRow>
                            <TableCell style={{ width: '10%' }} align="left">SKU</TableCell>
                            <TableCell style={{ width: '30%' }} align="left">Tên sản phẩm</TableCell>
                            <TableCell style={{ width: '10%' }} align="center">Số lượng</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                          {
                            row.variantQuantityList &&
                            row.variantQuantityList.map((item, index) => (
                              <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="left">
                                  {item?.variant?.sku}
                                </TableCell>
                                <TableCell align="left">{item.variant?.name}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              ))
            }
          </DialogContent>
          <DialogActions>
            <Grid className={classes.editBtnWrap}>
              <Button variant="contained" className={classes.addButton} onClick={closePlan}>Xác nhận</Button>
            </Grid>
          </DialogActions>
        </Dialog>

      </Box>
    </Fragment>
  )
}

export default ExportDetail