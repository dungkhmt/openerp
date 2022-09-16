import React, { useState, useEffect } from "react";
import { request } from "../../../api";
import StandardTable from "component/table/StandardTable";
import { Button } from "@mui/material";
import { errorNoti, successNoti } from "utils/notification";

export default function ContestManagerListMember(props) {
  const contestId = props.contestId;
  const [members, setMembers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const columns = [
    { title: "Index", field: "index" },
    { title: "userID", field: "userId" },
    { title: "FullName", field: "fullName" },
    { title: "Role", field: "roleId" },
    {
      title: "Action",
      render: (row) => (
        <Button onClick={() => handleRemove(row.id)}>Remove</Button>
      ),
    },
  ];

  function handleRemove(id) {
    // alert("remove " + id);
    setIsProcessing(true);
    let body = {
      id: id,
    };
    request(
      "post",
      "/remove-member-from-contest",
      (res) => {
        successNoti("Đã hoàn thành phân công tự động.");
        setIsProcessing(false);
      },
      {
        onError: () => {
          setIsProcessing(false);
          errorNoti("Đã có lỗi xảy ra.");
        },
        401: () => {},
      },
      body
    );
  }
  function getMembersOfContest() {
    request("get", "/get-members-of-contest/" + contestId, (res) => {
      const data = res.data.map((e, i) => ({
        index: i + 1,
        id: e.id,
        userId: e.userId,
        fullName: e.fullName,
        roleId: e.roleId,
      }));
      setMembers(data);
    });
  }
  useEffect(() => {
    getMembersOfContest();
  }, []);
  return (
    <div>
      <StandardTable
        title={"DS Users"}
        columns={columns}
        data={members}
        hideCommandBar
        options={{
          selection: false,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
}
