import { Box, Button, Grid, Typography } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react'
import useStyles from "./ProductDetail.style";
import { useHistory, useParams, useRouteMatch } from 'react-router';
import { request } from 'api';
import MoreInforProduct from './MoreInforProduct';
import { getStatus, getType } from '../../utilities';
import VariantInfor from './VariantInfor';
import { successNoti } from 'utils/notification';


function ProductDetail() {

  const classes = useStyles();
  const [product, setProduct] = useState({});
  const history = useHistory();
  const { path } = useRouteMatch();


  let { id } = useParams();

  const getProductDetail = () => {
    request(
      "get",
      `/admin/wms/warehouse/products/${id}`,
      (res) => {
        setProduct(res.data);
      },
      {
        onError: (res) => {
          console.log("getProductDetail, error ", res)
        },
      }
    );
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  const editProduct = () => {
    history.push(`${path.replace(`/:id`, "")}`);
  }
  const exitProduct = () => {
    history.push(`${path.replace(`/:id`, "")}`);
  }
  const deleteProduct = () => {
    request(
      "delete",
      `/admin/wms/warehouse/products/${id}`,
      (res) => {
        history.push(`${path.replace(`/:id`, "")}`);
        successNoti("Xóa sản phẩm thành công")
      },
      {
        onError: (res) => {
          console.log("getAllVariantActive")
        },
      }
    );
  }

  return (
    <Fragment>
      <Box className={classes.productPage} >
        <Grid container justifyContent="space-between" className={classes.headerBox} >
          <Grid>
            <Typography variant="h5">
              {/* {product?.name} */}
              Chi tiết sản phẩm
            </Typography>
          </Grid>
          <Grid className={classes.btnWrap}>
            <Grid className={classes.exitBtnWrap}>
              <Button variant="outlined" className={classes.exitBtn} onClick={exitProduct} >Thoát</Button>
            </Grid>
          {product.isActive && 
            <>
            <Grid className={classes.deleteBtnWrap}>
              <Button variant="contained" className={classes.deleteBtn} onClick={deleteProduct} >Xóa</Button>
            </Grid>
            <Grid className={classes.editBtnWrap}>
              <Button variant="contained" className={classes.addButton} onClick={editProduct} >Sửa sản phẩm</Button>
            </Grid>
            </>
          }
          </Grid>
        </Grid>

        <Box className={classes.boxInfor}>
          <Typography className={classes.inforTitle} variant="h6">
            Thông tin chung
          </Typography>

          <Grid container spacing={3} className={classes.inforWrap}>
            <Grid item md={2} sm={2} xs={2} container direction="column">
              <Typography className={classes.label}>Tên sản phẩm</Typography>
              <Typography className={classes.label}>Trạng thái</Typography>
              <Typography className={classes.label}>Mã sản phẩm</Typography>
              <Typography className={classes.label}>Loại sản phẩm</Typography>
              <Typography className={classes.label}>Mô tả </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={6} container direction="column">
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> <b>{product?.name} </b>
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {getStatus(product?.isActive, 26)}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {product?.code}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {getType(product?.type)}
              </Typography>
              <Typography className={classes.label}>
                <b style={{ marginRight: 20 }}>:</b> {product?.description}
              </Typography>
            </Grid>

            <Grid item md={4} sm={4} xs={4} container direction="column">
              <img style={{ width: 176 }} src={require("../../common/image/default.jpg").default} alt="" />
            </Grid>
          </Grid>
        </Box>
        {
          product.variants?.length > 1 &&
          <VariantInfor
            product={product}
            variants={product?.variants}
          />}
        {
          product.variants?.length <= 1 &&


          <MoreInforProduct
            product={product}
          />
        }


      </Box>
    </Fragment>
  )
}

export default ProductDetail