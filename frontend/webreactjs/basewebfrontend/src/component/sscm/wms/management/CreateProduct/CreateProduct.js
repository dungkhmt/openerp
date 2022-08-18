import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from '@material-ui/core';
import React, { Fragment, useState } from 'react'
import useStyles from "./CreateProduct.style";
import { Controller, useForm } from "react-hook-form";
import TagsInput from '../components/TagInput';
import CurrencyTextField from '@unicef/material-ui-currency-textfield/dist/CurrencyTextField';
import CloseIcon from '@mui/icons-material/Close';
import { request } from 'api';
import { errorNoti, successNoti } from 'utils/notification';
import { useHistory, useRouteMatch } from 'react-router';




function CreateProduct() {

  const history = useHistory();
  const { path } = useRouteMatch();

  const classes = useStyles();
  const { register, errors, handleSubmit, watch, getValues ,control  } = useForm();
  const [type, setType] = useState("normal");
  const [checked, setChecked] = React.useState(false);
  const [opt1, setOpt1] = useState("Kích thước"); 
  const [opt1Val, setOpt1Val] = useState(); 

  const [opt2, setOpt2] = useState("Màu sắc"); 
  const [opt2Val, setOpt2Val] = useState(); 
  const [importPrice, setImportPrice] = useState(); 
  const [wholePrice, setwholePrice] = useState(); 
  const [retailPrice, setRetailPrice] = useState(); 
  const [weightUnit, setWeightUnit] = useState("g"); 


  const setProductType = (event) => {
    setType(event.target.value)
  }

  const addProduct = (data) => {
    if(checked){
      data.opt1 = opt1;
      data.opt1Val = opt1Val;
      data.opt2 = opt2;
      data.opt2Val = opt2Val;
    }
    data.type = type;
    data.importPrice = importPrice;
    data.wholePrice = wholePrice;
    data.retailPrice = retailPrice;
    data.weightUnit = weightUnit;

    request(
      "post",
      "/admin/wms/warehouse/products",
      (res) => {
        let id = res.data.id;
        successNoti("Tạo sản phẩm thành công")
        history.push(`${path.replace('/create', '')}/${id}`);
      },
      {
        onError: (error) => {
          console.error(error);
          errorNoti(
            "Mã sản phẩm đã tồn tại"
          );
        },
      },
      data
    );



  }
  const handleChangeOpt = (event) => {
    setChecked(event.target.checked);
  }

  const handleChangeOpt1Value = (items) => {
    setOpt1Val(items)
  }
  const handleChangeOpt1 = (event) =>{
    setOpt1(event.target.value);
  }

  const handleChangeOpt2Value = (items) => {
    setOpt2Val(items)
  }
  const handleChangeOpt2 = (event) =>{
    setOpt2(event.target.value);
  }
  const handChangeWeightUnit = (event) =>{
    setWeightUnit(event.target.value);
  }



  return (
    <Fragment>
      <Box className={classes.productPage} >
        <Grid container justifyContent="space-between" className={classes.headerBox} >
          <Grid>
            <Typography variant="h5">
              Tạo sản phẩm
            </Typography>
          </Grid>
          <Grid className={classes.buttonWrap}>
            <Button variant="contained" className={classes.addButton} type="submit" onClick={handleSubmit(addProduct)} >Lưu</Button>
          </Grid>
        </Grid>

        <Box className={classes.bodyBox}>
          <Box className={classes.formWrap}
            component="form"
            onSubmit={handleSubmit(addProduct)}>
            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Thông tin chung
              </Typography>
              <Grid container spacing={3} className={classes.inforWrap}>
                <Grid item xs={6}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Tên sản phẩm
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền tên sản phẩm" })}
                      name="name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Mã sản phẩm
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register({ required: "Vui lòng điền mã sản phẩm" })}
                      name="code"
                      error={!!errors.code}
                      helperText={errors.code?.message}
                    />
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Khối lượng
                    </Box>
                    <Box style={{display : "flex"}}>
                    <TextField
                      className={classes.inputRight}
                      style={{flexGrow:1, marginRight: 4}}
                      variant="outlined"
                      size="small"
                      inputRef={register(false)}
                      name="weightValue"
                      error={!!errors.weightValue}
                      helperText={errors.weightValue?.message}
                    />
                    <FormControl size="small" sx={{ m: 1 }} >
                    <Select
                      variant="outlined"
                      labelId="demo-customized-select-label"
                      id="demo-customized-select"
                      defaultOpen={true}
                      value={weightUnit}
                      onChange={handChangeWeightUnit}
                    >
                      <MenuItem value={"g"}>g</MenuItem>
                      <MenuItem value={"kg"}>kg</MenuItem>
                    </Select>
                    </FormControl>
                  </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Mô tả sản phẩm
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      inputRef={register(false)}
                      name="description"
                      // error={!!errors.description}
                      // helperText={errors.description?.message}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Hình thức quản lý
              </Typography>
              <Grid container spacing={3} className={classes.inforWrap}>
                <Grid item xs={12}>
                  <RadioGroup
                    row
                    onChange={setProductType}
                  >
                    <FormControlLabel value="normal" control={<Radio size="small" className={classes.radio} />} label="Sản phẩm thường" style={{ width: "40%", marginLeft: 16 }} />
                    <FormControlLabel value="lots" control={<Radio size="small" className={classes.radio} />} label="Sản phẩm lô date" style={{ width: "30%" }} />
                  </RadioGroup>

                </Grid>
              </Grid>
            </Box>

            <Box className={classes.boxInfor}>
              <Typography className={classes.inforTitle} variant="h6">
                Giá sản phẩm
              </Typography>
              <Grid container spacing={3} className={classes.inforWrap}>
                <Grid item xs={6}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Giá nhập
                    </Box>
                    <CurrencyTextField
                      fullWidth
                      variant="outlined"
                      currencySymbol=""
                      decimalPlaces={0}
                      value={importPrice}
                      onChange={(event, value)=> setImportPrice(value)}
                      size="small"
                      maximumValue={1000000000}
                      />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Giá bán buôn
                    </Box>
                    <CurrencyTextField
                      fullWidth
                      variant="outlined"
                      currencySymbol=""
                      decimalPlaces={0}
                      value={wholePrice}
                      onChange={(event, value)=> setwholePrice(value)}
                      size="small"
                      maximumValue={1000000000}
                      />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className={classes.inputWrap}>
                    <Box className={classes.labelInput}>
                      Giá bán lẻ
                    </Box>
                    <CurrencyTextField
                      fullWidth
                      variant="outlined"
                      currencySymbol=""
                      decimalPlaces={0}
                      value={retailPrice}
                      onChange={(event, value)=> setRetailPrice(value)}
                      size="small"
                      maximumValue={1000000000}
                      />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box className={classes.boxInfor}>
              <Box className={classes.titleWrap}>
                <Typography variant="h6" style={{ padding: "8px" }}>
                  Thuộc tính
                </Typography>

                <Switch
                  checked={checked}
                  onChange={handleChangeOpt}
                  className={classes.switch}
                />

                <Typography style={{ padding: "8px", width: "100%" }}>
                  Thêm các thuộc tính của sản phẩm như kích cỡ, màu sắc
                </Typography>
              </Box>
              {
                checked &&
                <Grid container spacing={3} className={classes.inforWrap} >
                  <Grid item xs={4}>
                    <Box className={classes.inputWrap}>
                      <Box className={classes.labelOptInput}>
                        Tên thuộc tính
                      </Box>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        inputRef={register({ required: "Vui lòng điền tên thuộc tính" })}
                        name="opt1"
                        value={opt1}
                        onChange={handleChangeOpt1}
                        error={!!errors.opt1}
                        helperText={errors.opt1?.message}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Box className={classes.inputWrap}>
                      <Box className={classes.labelOptInput}>
                        Giá trị
                      </Box>
                      <TagsInput
                        selectedTags={handleChangeOpt1Value}
                        fullWidth
                        variant="outlined"
                        id="tags"
                        name="tags"
                        placeholder="Thêm thuộc tính"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <Box className={classes.inputWrap}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        inputRef={register({ required: "Vui lòng điền tên thuộc tính" })}
                        name="opt2"
                        value={opt2}
                        onChange={handleChangeOpt2}
                        error={!!opt2.code}
                        helperText={opt2.code?.message}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Box className={classes.inputWrap}>
                      <TagsInput
                        selectedTags={handleChangeOpt2Value}
                        fullWidth
                        variant="outlined"
                        id="tags"
                        name="tags"
                        placeholder="Thêm thuộc tính"
                      />
                    </Box>
                  </Grid>
                </Grid>
              }
            </Box>

          </Box>

        </Box>
      </Box>
    </Fragment>
  )
}

export default CreateProduct