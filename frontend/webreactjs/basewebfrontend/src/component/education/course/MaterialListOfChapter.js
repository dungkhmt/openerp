import { Card, CardContent } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";
import {errorNoti} from "../../../utils/notification";
import StandardTable from "../../table/StandardTable";
import Button from "@mui/material/Button";
import {useParams} from "react-router";

const MATERIAL_TYPES = {
  EDU_COURSE_MATERIAL_TYPE_VIDEO: "Video",
  EDU_COURSE_MATERIAL_TYPE_SLIDE: "Slide"
}

function MaterialListOfChapter(props) {
  const params = useParams();
  const history = useHistory();
  const chapterId = params.chapterId;
  const [chapterMaterials, setChapterMaterials] = useState([]);

  useEffect(getChapterMaterialList, []);

  function getChapterMaterialList() {
    let successHandler = res => setChapterMaterials(res.data);
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", true)
    }
    request("GET", `/edu/class/get-chapter-materials-of-course/${chapterId}`, successHandler, errorHandlers);
  }

  function navigateToMaterialDetailPage(_, {eduCourseMaterialId}) {
    let role = props.role === "TEACHER" ? "teacher" : "student";
    let url = `/edu/${role}/course/chapter/material/detail/${eduCourseMaterialId}`;
    history.push(url);
  }

  function navigateToCreateMaterialPage() {
    history.push(`/edu/course/detail/chapter/material/create/${chapterId}`)
  }

  const CreateMaterialButton = (
    <Button color="primary"
            variant="outlined"
            onClick={navigateToCreateMaterialPage}>
      <AddIcon/> Thêm mới
    </Button>)

  const actions = props.role === "TEACHER" ? [{ icon: () => CreateMaterialButton, isFreeAction: true }] : null;

  const columns = [
    { title: "ID tài liệu", field: "eduCourseMaterialId"},
    { title: "Tên tài liệu", field: "eduCourseMaterialName" },
    { title: "Thể loại", field: "eduCourseMaterialType", lookup: MATERIAL_TYPES },
  ];

  return (
    <Card>
      <CardContent>
        <StandardTable title="Danh sách học liệu"
                       columns={columns}
                       data={chapterMaterials}
                       hideCommandBar
                       options={{
                         selection: false,
                         search: true,
                         sorting: true
                       }}
                       actions={actions}
                       onRowClick={navigateToMaterialDetailPage}/>
      </CardContent>
    </Card>
  );
}

export default MaterialListOfChapter;
