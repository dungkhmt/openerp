import { Card, CardContent, Button } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";
import Player from "../../../utils/Player";
import withScreenSecurity from "../../withScreenSecurity";

function TeacherCourseChapterMaterialDetail() {
  const params = useParams();
  const chapterMaterialId = params.chapterMaterialId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [chapterMaterial, setChapterMaterial] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [displayImage, setDisplayImage] = useState(0);

  async function getImages(slideId) {
    let res = await authPost(dispatch, token, "/file", {
      // fileId: "62829f1693445a31606162b6;62829f1793445a31606162b8",
      fileId: slideId,
    });
    //let res = authGet(dispatch, token, '/edu/class/get-course-chapter-material-detail/' + chapterMaterialId);
    setListImage(res);
  }

  async function getCourseChapterMaterialDetail() {
    let res = await authGet(
      dispatch,
      token,
      "/edu/class/get-course-chapter-material-detail/" + chapterMaterialId
    );
    //let res = authGet(dispatch, token, '/edu/class/get-course-chapter-material-detail/' + chapterMaterialId);
    setChapterMaterial(res);
    console.log("getCourseChapterMaterialDetail ", res);
    if (res.sourceId !== null) {
      setSourceId(res.sourceId);
    } else {
      getImages(res.slideId);
    }
  }

  const prevImage = () => {
    if (displayImage > 0) {
      setDisplayImage(displayImage - 1);
    }
  };

  const nextImage = () => {
    if (displayImage < listImage.length) {
      setDisplayImage(displayImage + 1);
    }
  };
  useEffect(() => {
    getCourseChapterMaterialDetail();
    //setSourceId(chapterMaterial.sourceId);
  }, []);

  return (
    <Card>
      <CardContent>
        MaterialDetail{" "}
        <Link to={"/edu/teacher/course/chapter/detail/" + chapterMaterialId}>
          {chapterMaterialId}
        </Link>
        {sourceId !== null ? (
          <Player id={sourceId} />
        ) : (
          <>
            {listImage && (
              <>
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src={`data:image/png;base64,${listImage[displayImage]}`}
                    alt="img"
                    width={"80%"}
                    style={{ border: "1px solid #000" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={prevImage}
                    disabled={displayImage === 0 ? true : false}
                  >
                    <KeyboardArrowLeft />
                    Prev
                  </Button>
                  <span
                    style={{
                      width: "120px",
                      maxWidth: "120px",
                      textAlign: "center",
                    }}
                  >{`Page ${displayImage + 1}/${listImage.length}`}</span>
                  <Button
                    variant="contained"
                    onClick={nextImage}
                    disabled={
                      displayImage === listImage.length - 1 ? true : false
                    }
                  >
                    Next
                    <KeyboardArrowRight />
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default withScreenSecurity(
  TeacherCourseChapterMaterialDetail,
  screenName,
  true
);
