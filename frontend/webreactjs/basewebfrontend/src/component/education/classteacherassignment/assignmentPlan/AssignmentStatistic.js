import { request } from "api";
import StandardTable from "component/table/StandardTable";
import { useEffect, useState } from "react";

function AssignmentStatistic(props) {
  const planId = props.planId;
  const [teachers, setTeachers] = useState([]);

  const columns = [
    { title: "Mã giáo viên", field: "teacherId" },
    { title: "Tên giáo viên", field: "teacherName" },
    { title: "Tổng số giờ", field: "hourLoad" },
    { title: "Tổng số lớp", field: "numberOfClass" },
    { title: "Tổng số ngày", field: "numberOfWorkingDays" },
  ];

  function getTeacherList() {
    request(
      "GET",
      `edu/teaching-assignment/plan/${planId}/solution/teacher`,
      (res) => {
        setTeachers(res.data);
      }
    );
  }

  useEffect(() => {
    getTeacherList();
  }, []);

  return (
    teachers.length > 0 && (
      <div style={{ marginTop: 48 }}>
        <StandardTable
          hideCommandBar
          title={"Danh sách giáo viên"}
          columns={columns}
          data={teachers}
          options={{ selection: false, pageSize: 10 }}
        />
      </div>
    )
  );
}

export default AssignmentStatistic;
