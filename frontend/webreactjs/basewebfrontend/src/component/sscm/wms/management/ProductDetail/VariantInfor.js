import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, makeStyles, Radio, RadioGroup, Switch, TextField, Typography } from '@material-ui/core';
import { request } from 'api';
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { formatCurrency, getStatus, readPropProduct, readWeightProduct } from '../../utilities';
import ProductInImport from './ProductInImport';

const useStyles = makeStyles((theme) => ({
  grid: {
    paddingLeft: 56,
  },
  productPage: {
    // backgroundColor: "#FFF",
  },
  inforTitle: {
    padding: "8px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #E8EAEB",
    borderRadius: "3px 3px 0 0",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
  },
  inforWrap: {
    padding: "16px 24px",
  },
  label: {
    padding: "4px 0",
  },
  labelName: {
    padding: "4px 0",
    overflow: "hidden",
    textOverflow : "ellipsis",
    whiteSpace: "nowrap"
  },
  variantWrap: {

  },
  variantList: {
    backgroundColor: "#FFF",
    borderRadius: "0 0 3px 3px",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    "& :hover": {
      backgroundColor: "#afd8ff8a"
    }
  },
  variantItem: {
    display: "flex",
    padding: "18px",
  },
  variantItemActive: {
    display: "flex",
    padding: "18px",
    backgroundColor: "#afd8ff8a"
  },
  itemContent: {
    paddingLeft: 12
  },
  variantName: {
    fontWeight: 500,
  },
  variantSku: {
    fontSize: 14,
    color: "#666"
  },
  itemImg: {
    display: "flex",
    alignItems: "center",
  },
  variantDetail: {
    height: 'calc(100% - 41px)',
    backgroundColor: "#FFF",
    borderRadius: "0 0 3px 3px",
    padding: "16px 24px",
    boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
  },
  boxNoInfo: {
    display: "flex",
    padding: 30,
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  }

}));

function VariantInfor({ variants, product }) {

  const classes = useStyles();
  const [currentVariant, setCurrentVariant] = useState([]);
  // const [variantId, setVariantId] = useState();

  useEffect(() => {
    setCurrentVariant(variants ? variants[0] : [])
    // setVariantId(variants? variants[0].id : "")
  }, [variants]
  )

  const [lineItems, setLineItems] = useState([]);

  const getVariantLineItem = (variantId) => {
    request(
      "get",
      `/admin/wms/warehouse/products/variant/${variantId}`,
      (res) => {
        setLineItems(res.data);
      },
      {
        onError: (res) => {
          console.log("getProductDetail, error ")
        },
      }
    );
  }

  useEffect(() => {
    getVariantLineItem(currentVariant.id)
  }, []
  )


  const renderDetailVariant = useMemo(() => {

    return (
      <Box>
        <Box className={classes.variantDetail}>
          <Grid container >
            <Grid item xs={3} direction="column">
              <Typography className={classes.label}>Tên phiên bản</Typography>
              <Typography className={classes.label}>Mã SKU</Typography>
              <Typography className={classes.label}>Trạng thái</Typography>
              <Typography className={classes.label}>Khối lượng</Typography>
              {
                product.opt1 &&
                <Typography className={classes.label}>{product.opt1}</Typography>
              }
              {
                product.opt2 &&
                <Typography className={classes.label}>{product.opt2}</Typography>
              }
              <Typography className={classes.label}>Giá nhập</Typography>
              <Typography className={classes.label}>Giá bán buôn</Typography>
              <Typography className={classes.label}>Giá bán lẻ</Typography>
              <Typography className={classes.label}>Tồn kho</Typography>
              <Typography className={classes.label}>Có thể bán</Typography>
            </Grid>
            <Grid item xs={4} direction="column">
              <Typography className={classes.labelName}>
                <b style={{ marginRight: 20 }}>:</b>  {currentVariant?.name}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b>  {currentVariant?.sku}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b>  {getStatus(currentVariant?.isActive, 26)}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {readWeightProduct(currentVariant?.weightValue, currentVariant?.weightUnit)}
              </Typography>
              {
                product.opt1 && currentVariant.opt1 &&
                <Typography className={classes.label}>
                  <b style={{ marginRight: 20 }}>:</b>  {currentVariant?.opt1}
                </Typography>
              }
              {
                 !currentVariant.opt1 &&
                <Typography className={classes.label}>
                  <b style={{ marginRight: 20 }}>:</b> 
                </Typography>
              }
              {
                product.opt2 && currentVariant.opt2 &&
                <Typography className={classes.label}>
                  <b style={{ marginRight: 20 }}>:</b>  {currentVariant?.opt2}
                </Typography>
              }
              {
                 !currentVariant.opt2 &&
                <Typography className={classes.label}>
                  <b style={{ marginRight: 20 }}>:</b>  
                </Typography>
              }
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {formatCurrency(currentVariant?.importPrice)} đồng 
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {formatCurrency(currentVariant?.wholePrice)} đồng 
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {formatCurrency(currentVariant?.retailPrice)} đồng 
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {currentVariant?.onHand}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {currentVariant?.available}
              </Typography>
            </Grid>
            <Grid item xs={5} direction="column" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box className={classes.itemImg}>
                <img style={{ width: 250 }} src={require("../../common/image/default.jpg").default} alt="" />
              </Box>
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
              <Typography style={{ fontSize: 24, color: "#CCC" }}>
                Phiên bản chưa có đơn nhập hàng nào
              </Typography>
            </Box>
        }
      </Box>
    );
  }, [currentVariant,lineItems]
  )

  return (
    <Box className={classes.productPage} >
      <Box className={classes.boxInfor}>
        <Typography className={classes.inforTitle} variant="h6">
          Thông tin Phiên bản
        </Typography>

        <Grid container spacing={3} className={classes.variantWrap}>
          <Grid item xs={4} >
            <Typography className={classes.inforTitle} style={{ fontWeight: 500 }}>
              Danh sách phiên bản
            </Typography>
            <Box className={classes.variantList}>
              {variants &&
                variants.map((variant, key) => {
                  return (
                    <Box key={variant.id} onClick={() => {setCurrentVariant(variant) ;getVariantLineItem(variant.id)}} className={variant.id == currentVariant.id ? classes.variantItemActive : classes.variantItem}>
                      <Box className={classes.itemImg}>
                        <img style={{ width: 46 }} src={require("../../common/image/default.jpg").default} alt="" />
                      </Box>
                      <Box className={classes.itemContent}>
                        <Typography className={classes.variantName}>{variant.name}</Typography>
                        <Typography className={classes.variantSku}>{variant.sku}</Typography>
                      </Box>
                    </Box>
                  )
                })
              }
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.inforTitle} style={{ fontWeight: 500 }}>
              Chi tiết phiên bản
            </Typography>
            {renderDetailVariant}
          </Grid>
        </Grid>


        {/* <Grid container spacing={3} className={classes.inforWrap}> */}
        {/* <Grid item md={2} sm={2} xs={2} container direction="column">
              <Typography className={classes.label}>Khối lượng sản phẩm</Typography>
              <Typography className={classes.label}>Giá nhập</Typography>
              <Typography className={classes.label}>Giá bán buôn</Typography>
              <Typography className={classes.label}>Giá bán lẻ</Typography>
            </Grid> */}
        {/* <Grid item md={6} sm={6} xs={6} container direction="column">
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
            </Grid> */}
        {/* </Grid> */}
      </Box>

    </Box>
  )
}

export default VariantInfor