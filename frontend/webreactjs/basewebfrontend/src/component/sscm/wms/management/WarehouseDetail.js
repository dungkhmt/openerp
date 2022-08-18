import React, { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import { useRouteMatch, useParams, useHistory } from "react-router-dom";
import { Button, Grid, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Stage, Layer, Rect, Text } from "react-konva";
import { setCanvasSize } from "../utilities"
import { axiosGet, request } from "api";
import { useDispatch, useSelector } from "react-redux";
import ListProductComponent from "./components/ListProductComponent";
import { Link } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: 24,
    backgroundColor: "#FFF",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
  },
  label: {
    padding: "4px 0",
  },
  desLabel: {
    fontSize: 18,
    fontWeight: 500,
    // marginTop: 20,
  },
  desLabelWrap: {
    marginTop: 20,
    marginBottom: 20,
    padding: "10px",
    backgroundColor: "#FFF",
    // borderTop: "1px solid #ccc",
    // borderBottom: "1px solid #ccc",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",

  },
  desWrap: {
    padding: "20px 30px",
    width: "100%",
    height: 500,
  },
  headerBox: {
    backgroundColor: "#FFF",
    marginBottom: 30,
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    borderRadius: 3,
  },
  addButton: {
    marginLeft: 10,
    color: "#FFF",
    backgroundColor: "#1976d2",
    margin: "10px 0",
  },
  buttonWrap: {
    "& .MuiButton-contained:hover": {
      backgroundColor: "#1565c0"
    }
  },
  btnWrap: {
    display: "flex",
  },
  exitBtnWrap:{
    marginLeft: 10,
    "& .MuiButton-contained:hover" :{
      backgroundColor : "#fcdcdc"
    }
  },
  exitBtn:{
    color: "#de4343",
    border: "1px solid #de4343",
    margin: "10px 0",
    textTransform: "none",
  },
  tabWrap: {
    backgroundColor: "#FFF",
    "& .MuiTab-textColorInherit.Mui-selected": {
      backgroundColor: "#87CEFA",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#1565c0"
    },
    "& .MuiTab-wrapper": {
      textTransform: "none",
      fontSize: 18,
    }
  },
  canvasWrap: {
    height: 800,
    // maxHeight: 800,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
  },
  shelfDetail: {
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    height: "100%",
    backgroundColor: "#FFF",
  },
  stageWrap: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  tableWrap: {
    minHeight: 200,
    maxHeight: 700,
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
  tableBody: {
    "& .MuiTableCell-sizeSmall": {
      padding: "10px 24px 10px 16px",
    },
  },
}));


function WarehouseDetail() {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');
  const [warehouesData, setWarehouseData] = React.useState([]);
  const [maxSize, setMaxsize] = React.useState(100);
  const [listShelf, setListShelf] = React.useState([]);
  const token = useSelector((state) => state.auth.token);

  const [width, setWidth] = useState();
  const [warehouseHeight, setWarehouseHeight] = useState();
  const [height, setHeight] = useState();
  const [pos, setPos] = useState();
  const [shelf, setShelf] = useState();
  const [scale, setScale] = useState();
  // const stageCanvasRef = useRef(null);
  const [products, setProducts] = React.useState([]);
  const [lineItems, setLineItems] = React.useState([]);
  const [shelfId, setShelfId] = useState();
  const [facilityNum, setFacilityNum] = useState("1");
  const history = useHistory();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let { id } = useParams();
  const { path } = useRouteMatch();

  const getWarehouseDetail = () => {
    request(
      "get",
      `/admin/wms/warehouse/${id}`,
      (res) => {
        setWarehouseData(res.data);
        setListShelf(res.data.listShelf)
        setShelfId(res.data.listShelf[0].shelfId)
        getLineItem(res.data.listShelf[0].shelfId)
      },
      {
        onError: (res) => {
          console.log("getWarehouseDetail, error ")
        },
      }
    );
  };

  const getProducts = () => {
    request(
      "get",
      `/admin/wms/warehouse/products/facility/${id}`,
      (res) => {
        setProducts(res.data);
      },
      {
        onError: (res) => {
          console.log("getListWarehouse, error ")
        },
      }
    );
  };

  const getLineItem = (id) => {
    request(
      "get",
      `/admin/wms/warehouse/products/shelf/${id}`,
      (res) => {
        setLineItems(res.data);
      },
      {
        onError: (res) => {
          console.log("getListWarehouse, error ")
        },
      }
    );
  };

  const stageCanvasRef = useCallback((node) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
      setWarehouseHeight(node.getBoundingClientRect().width * warehouesData.facilityLenght / warehouesData.facilityWidth)
      setScale(node.getBoundingClientRect().width / warehouesData.facilityWidth)
    }
  }, [warehouesData]);

  const handleImport = () => {
    history.push(`${path.replace("/warehouse/:id", "/inventory/import/create")}`);
  }
  const handleExit = () => {
    history.push(`${path.replace("/:id", "/list")}`);  }
  const handleEdit = () => {
    history.push(`${path.replace("/:id", `/update/${id}`)}`);  
  }

  useEffect(() => {
    getLineItem(shelfId)
  }, [shelfId]);

  useEffect(() => {
    getWarehouseDetail();
    getProducts();
  }, []);


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
          // let mousePos = e.target.getStage().getPointerPosition();
          setPos(mousePos)
          setShelf(data.num? data.num : e.target.index)
        }}
        onClick={e => {
          setFacilityNum(data.num? data.num : e.target.index)
          setShelfId(data.shelfId)
          // getLineItem(shelfId)
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
      <Grid container justifyContent="space-between" className={classes.headerBox} >
        <Grid>
          <Typography variant="h5">
            Kho : {warehouesData.name}
          </Typography>
        </Grid>
        <Grid className={classes.btnWrap}>
        <Grid className={classes.exitBtnWrap}>
              <Button variant="outlined" className={classes.exitBtn} onClick={handleExit} >Thoát</Button>
            </Grid>
          <Grid className={classes.buttonWrap}>
            <Button variant="contained" className={classes.addButton} onClick={handleImport} >Nhập kho</Button>
          </Grid>
          <Grid className={classes.buttonWrap}>
            <Button variant="contained" className={classes.addButton} onClick={handleEdit} >Chỉnh sửa</Button>
          </Grid>
        </Grid>
      </Grid>

      <Box style={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" className={classes.tabWrap}>
              <Tab label="Tổng quan" value="1"></Tab>
              <Tab label="Chi tiết kho" value="2"></Tab>
            </TabList>
          </Box>
          <Box>
            <TabPanel value="1" style={{ padding: 0, }}>
              <Grid container className={classes.grid} >
                <Grid item md={2} sm={2} xs={2} container direction="column">
                  <Typography className={classes.label}>Tên kho</Typography>
                  <Typography className={classes.label}>Mã kho</Typography>
                  <Typography className={classes.label}>Địa chỉ</Typography>
                  <Typography className={classes.label}>Chiều dài</Typography>
                  <Typography className={classes.label}>Chiều rộng</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8} container direction="column">
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.name}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.code}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.address}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.facilityWidth} m
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.facilityLenght} m
                  </Typography>
                </Grid>
              </Grid>

              <Box className={classes.desLabelWrap}>
                <Typography className={classes.desLabel} variant="h5">Danh sách sản phẩm</Typography>
              </Box >

              <ListProductComponent
                products={products}
              />

            </TabPanel>
            <TabPanel value="2" style={{ padding: 0, display: "flex", justifyContent: "space-between" }}>
              <Box style={{ padding: 10, width: '66.66%' }} >
                <Box >
                  <Box className={classes.canvasWrap}>
                    <Box className={classes.stageWrap} ref={stageCanvasRef} >
                      <Stage
                        width={width}
                        height={height}
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
                </Box>
              </Box>
              <Box style={{ padding: 10, width: '33.33%' }} >
                <Box className={classes.shelfDetail}>
                  <Box className={classes.desLabelWrap} style={{ margin: 0 }}>
                    <Typography className={classes.desLabel} variant="h5">Danh sách sản phẩm : kệ hàng số {facilityNum}</Typography>
                  </Box >
                  <Box className={classes.listProduct}>
                    <TableContainer className={classes.tableWrap}>
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
                            lineItems &&
                            lineItems.filter(item => (item.quantity > 0)).map((row, index) => (
                              <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="left">
                                  <Link style={{ marginLeft: 3 }} href={`${path.replace('/:id', '/products')}/${row.productId}`} underline="none">
                                    {row?.variant?.sku}
                                  </Link>
                                </TableCell>
                                <TableCell align="left">{row.variant?.name}</TableCell>
                                <TableCell align="center">{row.quantity}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>

              </Box>
            </TabPanel>
          </Box>
        </TabContext>
      </Box >
    </Fragment >
  )
}

export default WarehouseDetail
