import { Card, CardContent } from "@material-ui/core/";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";

function TeacherCourseList() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [courses, setCourses] = useState([]);

  const columns = [
    {
      title: "CourseID",
      field: "id",
      render: (rowData) => (
        <Link to={"/edu/course/detail/" + rowData["id"]}>{rowData["id"]}</Link>
      ),
    },
    { title: "Tên môn", field: "name" },
    { title: "Số tín chỉ", field: "credit" },
  ];

  async function getCourseList() {
    let lst = await authGet(dispatch, token, "/edu/class/get-all-courses");
    setCourses(lst);
  }

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <Card>
      <CardContent>
        <MaterialTable
          title={"Danh sách môn học"}
          columns={columns}
          data={courses}
        />
      </CardContent>
    </Card>
  );
}

const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default TeacherCourseList;
