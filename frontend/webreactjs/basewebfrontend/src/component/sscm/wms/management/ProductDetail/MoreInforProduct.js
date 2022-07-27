import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, makeStyles, Radio, RadioGroup, Switch, TextField, Typography } from '@material-ui/core';
import { request } from 'api';
import React, { Fragment, useEffect, useState } from 'react'
import { readPropProduct, readWeightProduct } from '../../utilities';
import ProductInImport from './ProductInImport';

const useStyles = makeStyles((theme) => ({
  grid: {
    paddingLeft: 56,
  },
  productPage: {
  },
  inforTitle: {
    padding: "8px",
    borderBottom: "1px solid #E8EAEB",
    borderRadius: "3px 3px 0 0",
  },
  inforWrap: {
    padding: "16px 24px",
  },
  label: {
    padding: "4px 0",
  },
  boxInfor: {
    backgroundColor: "#FFF",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    borderRadius: "3px",
  },
  boxNoInfo:{
    display: "flex",
    padding: 30,
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  }
}));

function MoreInforProduct({product}) {
  const variant = product?.variants[0];
  const classes = useStyles();


  const [lineItems, setLineItems] = useState([]);

  const getVariantLineItem = () => {
    request(
      "get",
      `/admin/wms/warehouse/products/variant/${variant.id}`,
      (res) => {
        setLineItems(res.data);
      },
      {
        onError: (res) => {
          console.log("getVariantLineItem, error ", res)
        },
      }
    );
  }

  useEffect(() => {
    getVariantLineItem();
  }, [variant]);

  return (
    <Box className={classes.productPage} >
      <Box className={classes.boxInfor}>
        <Typography className={classes.inforTitle} variant="h6">
          Thông tin thêm
        </Typography>

        <Grid container spacing={3} className={classes.inforWrap}>
          <Grid item md={2} sm={2} xs={2} container direction="column">
            <Typography className={classes.label}>Khối lượng sản phẩm</Typography>
            <Typography className={classes.label}>Giá nhập</Typography>
            <Typography className={classes.label}>Giá bán buôn</Typography>
            <Typography className={classes.label}>Giá bán lẻ</Typography>
            <Typography className={classes.label}>Mã Sku</Typography>
            <Typography className={classes.label}>Tồn kho</Typography>
            <Typography className={classes.label}>Có thể bán</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6} container direction="column">
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b> {readWeightProduct(variant?.weightValue, variant?.weightUnit)}
            </Typography>
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b>  {variant?.importPrice}
            </Typography>
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b> {variant?.wholePrice}
            </Typography>
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b> {variant?.retailPrice}
            </Typography>
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b> {variant?.sku}
            </Typography>
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b> {variant?.onHand}
            </Typography>
            <Typography className={classes.label}>
              <b style={{ marginRight: 20 }}>:</b> {variant?.available}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {
        lineItems.length > 0 ?
          <ProductInImport
            lineItems={lineItems}
          />
          :

          <Box className={classes.boxNoInfo} >
            <Typography style={{fontSize: 24, color: "#CCC"}}>
              Sản phẩm chưa có đơn nhập hàng nào
            </Typography>
          </Box>
      }

    </Box>
  )
}

export default MoreInforProduct