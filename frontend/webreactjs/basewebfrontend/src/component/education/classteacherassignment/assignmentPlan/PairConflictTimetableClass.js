import { request } from "api";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";

const columns = [
  { title: "class 1", field: "classId1" },
  { title: "course 1", field: "courseId1" },
  { title: "timetable 1", field: "timetable1" },
  { title: "timetableCode 1", field: "timetableCode1" },
  { title: "class 2", field: "classId2" },
  { title: "course 2", field: "courseId2" },
  { title: "timetable 2", field: "timetable2" },
  { title: "timetableCode 2", field: "timetableCode2" },
];

function PairConflictTimetableClass({ planId }) {
  const [conflictList, setConflictList] = useState([]);

  //
  function getConflictTimetableClassList() {
    request("GET", "/get-pair-of-conflict-timetable-class/" + planId, (res) => {
      setConflictList(res.data);
    });
  }

  useEffect(() => {
    getConflictTimetableClassList();
  }, []);

  return (
    <StandardTable
      title={"Danh sách lớp trùng giờ"}
      columns={columns}
      data={conflictList}
      options={{
        selection: false,
      }}
    />
  );
}

export default PairConflictTimetableClass;
