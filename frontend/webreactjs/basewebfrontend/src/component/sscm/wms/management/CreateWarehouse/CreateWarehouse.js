import { Box, Button, FormGroup, Grid, InputAdornment, OutlinedInput, TextField, Typography } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';
import { setCanvasSize } from "../../utilities"
import { Stage, Layer, Rect, Text } from "react-konva";
import useStyles from "./CreateWarehouse.style";
import { useHistory } from "react-router";
import { authGet, authPost, axiosPost, request } from "api";
import { errorNoti, successNoti } from "utils/notification";
import { Link, useRouteMatch } from "react-router-dom";

export default function CreateWarehouse() {

  const classes = useStyles();
  const [listShelf, setListShelf] = useState([{ x: "", y: "", width: "", lenght: "" }]);
  const [canvanData, setCanvasData] = useState([]);
  const [maxSize, setMaxsize] = useState();
  const { register, errors, handleSubmit, watch, getValues } = useForm();
  const history = useHistory();
  const { path } = useRouteMatch();

  const handleAddShelf = () => {
    console.log("add ")
    setListShelf([...listShelf, { x: "", y: "", width: "", lenght: "" }])
    console.log("listShelf", listShelf)
  }

  let removeFormFields = (i) => {
    let newFormValues = [...listShelf];
    newFormValues.splice(i, 1);
    setListShelf(newFormValues)
  }

  let submitForm = (data) => {
    data.listShelf = listShelf;
    request(
      "post",
      "/admin/wms/warehouse",
      (res) => {
        let id = res.data.id;
        successNoti("Tạo kho thành công")
        history.push(`${path.replace('/create', '')}/${id}`);
      },
      { 401: () => { } },
      data
    );
  };

  const handleChange = (i, e) => {
    const { name, value } = e.target;
    const list = [...listShelf];
    list[i][name] = value;
    setListShelf(list);
  };

  const resetCanvas = () => {
    setCanvasData(listShelf)
    const data = getValues();
    setMaxsize(data.facilityWidth);
  };

  const warehouseBox = (data, maxSize) => {
    return (
      <Rect
        key={data.shelfID}
        x={setCanvasSize(data.x, maxSize)}
        y={setCanvasSize(data.y, maxSize)}
        width={setCanvasSize(data.width, maxSize)}
        height={setCanvasSize(data.lenght, maxSize)}
        draggable={true}
        fill={"#afaf"}
        shadowBlur={5}
      />
    );
  }

  return (
    <Fragment>
      <Box sx={{ padding: '8px' }} className={classes.header}>
        <Typography variant="h5" >
          Tạo Mới Kho
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        sx={{ flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1, paddingTop: 30 }}>
          <Grid container spacing={4} >
            <Grid item xs={6}>
              <Box
                sx={{
                  width: 800,
                  maxWidth: '100%',
                }}
              >
                <TextField
                  fullWidth
                  inputRef={register({ required: "Vui lòng điền tên kho" })}
                  label="Tên Kho"
                  name="name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  width: 800,
                  maxWidth: '100%',
                }}
              >
                <TextField
                  fullWidth
                  inputRef={register({ required: "Vui lòng điền mã kho" })}
                  label="Mã Kho"
                  name="code"
                  error={!!errors.code}
                  helperText={errors.code?.message}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  width: "100%",
                  marginTop: 10,
                  maxWidth: '100%',
                }}
              >
                <TextField
                  fullWidth
                  inputRef={register({ required: "Vui lòng điền địa chỉ" })}
                  label="Địa chỉ"
                  name="address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ backgroundColor: "#fefefe", width: "100%", height: "auto", marginTop: 30, }}>
          <TextField
            label=""
            defaultValue="Chi tiết kho"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="standard"
          />
          <Grid container>
            <Grid xs={4} sx={{ display: "flex", }} item className={classes.boxWrap}>
              <Box className={classes.title}>
                <Typography align="center">
                  Kích thước
                </Typography>
              </Box>
              <Box width={"100%"} display={"flex"} alignItems={"center"} marginTop={"16px"} padding={"8px"}>
                <Box width={"120px"}>
                  <Typography>Chiều dài</Typography>
                </Box>
                <Box style={{ width: `calc(100% - 120px` }} className={classes.rootInput}>
                  <OutlinedInput
                    fullWidth
                    inputRef={register({ required: false })}
                    name="facilityWidth"
                    className={classes.settingInput}
                    endAdornment={<InputAdornment position="end">{`(mét)`}</InputAdornment>}
                  />
                </Box>
              </Box>
              <Box width={"100%"} display={"flex"} alignItems={"center"} marginTop={"8px"} padding={"8px"}>
                <Box width={"120px"}>
                  <Typography>Chiều rộng</Typography>
                </Box>
                <Box style={{ width: `calc(100% - 120px` }} className={classes.rootInput}>
                  <OutlinedInput
                    fullWidth
                    name="facilityLenght"
                    inputRef={register({ required: false })}
                    className={classes.settingInput}
                    endAdornment={<InputAdornment position="end">{`(mét)`}</InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      'aria-label': 'weight',
                    }}
                  />
                </Box>
              </Box>

              <Box className={classes.listWrap}>
                {
                  listShelf.map((data, index) => (
                    <Box key={index} width={"100%"} display={"flex"} alignItems={"center"} marginTop={"8px"} padding={"8px"} >
                      <Box className={classes.shelfInput} width={"100%"} display={"flex"} padding={"8px"}>
                        <Box width={"100px"}>
                          <Typography>Kệ số {index + 1}</Typography>
                        </Box>

                        <Button onClick={() => removeFormFields(index)} size="small" variant="contained" className={classes.icon} startIcon={<ClearIcon className={classes.iconColor} />} />
                        <Box style={{ width: `calc(100% - 100px` }} className={classes.rootInput}>
                          <Grid container spacing={2} >
                            <Grid item xs={4} >
                              <FormGroup>
                                <Box
                                  sx={{
                                    width: "100%",
                                    marginTop: 10,
                                    maxWidth: '100%',
                                    display: 'flex',
                                  }}
                                >
                                  <Typography style={{ width: '40px' }}>X = </Typography>
                                  <TextField fullWidth name="x" value={data.x} onChange={e => handleChange(index, e)} />
                                </Box>
                              </FormGroup>
                            </Grid>
                            <Grid item xs={8}>
                              <FormGroup>
                                <Box
                                  sx={{
                                    width: "100%",
                                    marginTop: 10,
                                    maxWidth: '100%',
                                    display: 'flex',
                                  }}
                                >
                                  <Typography style={{ width: '160px' }}>Chiều dài = </Typography>
                                  <TextField fullWidth name={`width`} value={data.width} onChange={e => handleChange(index, e)} />
                                </Box>
                              </FormGroup>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} >
                            <Grid item xs={4} >
                              <FormGroup>
                                <Box
                                  sx={{
                                    width: "100%",
                                    marginTop: 10,
                                    maxWidth: '100%',
                                    display: 'flex',
                                  }}
                                >
                                  <Typography style={{ width: '40px' }}>Y = </Typography>
                                  <TextField fullWidth name={`y`} value={data.y} onChange={e => handleChange(index, e)} />
                                </Box>
                              </FormGroup>
                            </Grid>
                            <Grid item xs={8}>
                              <FormGroup>
                                <Box
                                  sx={{
                                    width: "100%",
                                    marginTop: 10,
                                    maxWidth: '100%',
                                    display: 'flex',
                                  }}
                                >
                                  <Typography style={{ width: '180px' }}>Chiều Rộng = </Typography>
                                  <TextField fullWidth name={`lenght`} value={data.lenght} onChange={e => handleChange(index, e)} />
                                </Box>
                              </FormGroup>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  ))
                }
              </Box>
              <Box width={"100%"} display={"flex"} alignItems={"center"} marginTop={"8px"} padding={"8px"}>
                <Button variant="contained" color="primary" fullWidth onClick={() => handleAddShelf()}>Thêm Kệ hàng</Button>
              </Box>
            </Grid>
            <Grid xs={8} item sx={{ display: "flex", }} className={classes.boxWrap}>
              <Box className={classes.title}>
                <Typography>
                  Mô phỏng
                </Typography>
                <Box className={classes.reserBtn} onClick={resetCanvas}>
                  <Typography>
                    Reset
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.canvasWrap}>
                <Stage
                  width={1000}
                  height={700}
                >
                  <Layer>
                    {canvanData.map((data) => (
                      warehouseBox(data, maxSize)
                    ))}
                  </Layer>
                </Stage>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box >
          <Button className={classes.btnSubmit}
            type="submit"
          >
            Tạo Kho
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
}