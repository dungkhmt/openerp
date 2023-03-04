import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { request } from "../../../../api";
import TClassUpdatePopup from "./TClassUpdatePopup";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  positiveBtn: {
    minWidth: 112,
  }
}));

export default function TeacherViewDetailClassGeneralInfo(props) {
  const classId = props.classId;
  const classes = useStyles();
  const [classDetail, setClassDetail] = useState({});
  const [open, setOpen] = useState(false);
  const classAttrs = ["code", "courseId", "name", "classType"];
  const { t } = useTranslation("education/classmanagement/teacher/teacher-view-detail-class-general-info");

  useEffect(getClassDetail, []);

  function getClassDetail() {
    request("get", `/edu/class/${classId}`, res => setClassDetail(res.data));
  }

  function onUpdateClass() {
    setOpen(true);
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          title={<Typography variant="h5">{ t('title') }</Typography>}
          action={
            <PositiveButton
              label={ t('edit') }
              className={classes.positiveBtn}
              onClick={onUpdateClass}
            />
          }
        />

        <CardContent>
          <Grid container className={classes.grid}>
            <Grid item md={3} sm={3} xs={3} container direction="column">
              { classAttrs.map(attr =>
                <Typography key={attr}>
                  {t(`classDetail.${attr}`)}
                </Typography>
              )}
            </Grid>
            <Grid item md={8} sm={8} xs={8} container direction="column">
              { classAttrs.map(attr =>
                <Typography key={attr}>
                  <b>:</b> {classDetail[attr]}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TClassUpdatePopup open={open} setOpen={setOpen} classId={classId} />
    </div>
  );
}

