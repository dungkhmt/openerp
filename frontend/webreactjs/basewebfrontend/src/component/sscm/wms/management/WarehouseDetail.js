import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import { Link, useRouteMatch, useParams } from "react-router-dom";
import { Grid, Tab, Typography } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Stage, Layer, Rect, Text } from "react-konva";
import {setCanvasSize} from "../utilities"
import { axiosGet, request } from "api";
import { useDispatch, useSelector } from "react-redux";


const useStyles = makeStyles((theme) => ({
  grid: {
    paddingLeft: 56,
  },
  label: {
    padding: "4px 0",
  },
  desLabel: {
    fontSize: 18,
    fontWeight: 500,
  },
  desLabelWrap: {
    marginTop: 20,
    padding: "8px 0",
    borderTop: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
  },
  desWrap: {
    padding: "20px 30px",
    width: "100%",
    height: 500,
  }
}));


function WarehouseDetail() {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');
  const [warehouesData, setWarehouseData] = React.useState([]);
  const [maxSize, setMaxsize] = React.useState(100);
  const [listShelf, setListShelf] = React.useState([]);
  const token = useSelector((state) => state.auth.token);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let { id } = useParams();
  console.log("id", id)

  const getWarehouseDetail = () => {
    request(
      "get",
      `/admin/wms/warehouse/${id}`,
      (res) => {
        setWarehouseData(res.data);
        setListShelf(res.data.listShelf)
      },
      {
        onError: (res) => {
          console.log("getWarehouseDetail, error ", error)
        },
      }
    );
  };


  useEffect(() => {
    getWarehouseDetail();
  }, []);


  const warehouseBox = (data, maxSize) => {
    return (
      <Rect
        key={data.shelfId}
        x={setCanvasSize(data.x, maxSize)}
        y={setCanvasSize(data.y, maxSize)}
        width={setCanvasSize(data.width, maxSize)}
        height={setCanvasSize(data.lenght, maxSize)}
        draggable= {true}
        fill={"#afaf"}
        shadowBlur={5}
      />
    );
  }
  return (
    <Fragment>
      <Box>
        <Typography variant="h5">Kho : WH01 </Typography>
      </Box>
      <Box style={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Tổng quan" value="1"></Tab>
              <Tab label="Danh sách sản phẩm" value="2"></Tab>
            </TabList>
          </Box>
          <Box>
            <TabPanel value="1">
              <Grid container className={classes.grid} >
                <Grid item md={2} sm={2} xs={2} container direction="column">
                  <Typography className={classes.label}>Tên kho</Typography>
                  <Typography className={classes.label}>Mã kho</Typography>
                  <Typography className={classes.label}>Địa chỉ</Typography>
                </Grid>
                <Grid item md={8} sm={8} xs={8} container direction="column">
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.code}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.name}
                  </Typography>
                  <Typography className={classes.label}>
                    <b style={{ marginRight: 20 }}>:</b> {warehouesData.address}
                  </Typography>
                </Grid>
              </Grid>
              <Box className={classes.desLabelWrap}>
                <Typography className={classes.desLabel} variant="h5">Chi tiết </Typography>
              </Box >
              <Box className={classes.desWrap}>
                <Stage
                  width={1407}
                  height={800}
                >
                  <Layer>
                    {listShelf.map((data) => (
                      warehouseBox(data, maxSize)
                    ))}
                  </Layer>
                </Stage>
              </Box>
            </TabPanel>
            <TabPanel value="2">Item 2  </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </Fragment>
  )
}

export default WarehouseDetail
