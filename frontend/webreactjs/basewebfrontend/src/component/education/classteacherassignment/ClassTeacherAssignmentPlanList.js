import { Button, Card } from "@material-ui/core/";
import { request } from "api";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateClassTeacherAssignmentPlanModal from "./CreateClassTeacherAssignmentPlan";

function ClassTeacherAssignmentPlanList() {
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = React.useState(false);

  const columns = [
    {
      title: "Tên",
      field: "planName",
      render: (rowData) => (
        <Link
          to={{
            pathname: `/edu/teaching-assignment/plan/${rowData.id}/?tab=0`,
          }}
          style={{
            textDecoration: "none",
            whiteSpace: "pre-wrap" /* css-3 */,
            whiteSpace: "-moz-pre-wrap" /* Mozilla, since 1999 */,
            whiteSpace: "-pre-wrap" /* Opera 4-6 */,
            whiteSpace: "-o-pre-wrap" /* Opera 7 */,
            wordWrap: "break-word" /* Internet Explorer 5.5+ */,
          }}
        >
          {rowData.planName}
        </Link>
      ),
    },
    { title: "Tên Plan", field: "planName" },
    { title: "Người tạo", field: "createdByUserLoginId" },
    { title: "Ngày tạo", field: "createdStamp" },
  ];

  async function getClassTeacherAssignmentList() {
    request("GET", "/get-all-class-teacher-assignment-plan", (res) => {
      setPlans(res.data);
    });
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  function createPlan(planName) {
    let data = { planName: planName };
    request(
      "post",
      "create-class-teacher-assignment-plan",
      (res) => {
        console.log("create-class-teacher-assignment-plan ", res);
        //alert("create-class-teacher-assignment-plan " + res.data);
      },
      { 401: () => {} },
      data
    );
  }

  const customCreateHandle = (planName) => {
    console.log(planName);
    //setSearchString(sString);
    alert("create plan " + planName);
    createPlan(planName);
    handleModalClose();
  };

  useEffect(() => {
    getClassTeacherAssignmentList();
  }, []);

  return (
    <Card>
      <MaterialTable
        title={"Danh sách bản kế hoach phân công"}
        columns={columns}
        data={plans}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />
              <div
                style={{ position: "absolute", top: "16px", right: "350px" }}
              >
                <Button onClick={handleModalOpen} color="primary">
                  Thêm mới
                </Button>
              </div>
            </div>
          ),
        }}
      />

      <CreateClassTeacherAssignmentPlanModal
        open={open}
        onClose={handleModalClose}
        onCreate={customCreateHandle}
      />
    </Card>
  );
}

export default ClassTeacherAssignmentPlanList;
