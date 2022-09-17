import React, { useState, useEffect } from "react";
import { request } from "../../../api";
import StandardTable from "component/table/StandardTable";
import { Button } from "@mui/material";
import { errorNoti, successNoti } from "utils/notification";
import { toFormattedDateTime } from "utils/dateutils";
import UpdatePermissionMemberOfContestDialog from "./UpdatePermissionMemberOfContestDialog";
export default function ContestManagerListMember(props) {
  const contestId = props.contestId;
  const [members, setMembers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openUpdateMemberDialog, setOpenUpdateMemberDialog] = useState(false);
  const [permissionIds, setPermissionIds] = useState([]);
  const [selectedUserRegisId, setSelectedUserRegisId] = useState(null);

  const columns = [
    { title: "Index", field: "index" },
    { title: "userID", field: "userId" },
    { title: "FullName", field: "fullName" },
    { title: "Role", field: "roleId" },
    { title: "Permission", field: "permissionId" },
    { title: "updated Date", field: "lastUpdatedDate" },
    { title: "Updated By UserId", field: "updatedByUserId" },
    {
      title: "Remove",
      render: (row) => (
        <Button onClick={() => handleRemove(row.id)}>Remove</Button>
      ),
    },
    {
      title: "Permission Submit",
      render: (row) => (
        <Button onClick={() => handleForbidSubmit(row.id)}>
          Update Permission Submit
        </Button>
      ),
    },
  ];

  function handleForbidSubmit(id) {
    // alert("remove " + id);
    setSelectedUserRegisId(id);
    setOpenUpdateMemberDialog(true);
  }
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
        permissionId: e.permissionId,
        lastUpdatedDate: toFormattedDateTime(e.lastUpdatedDate),
        updatedByUserId: e.updatedByUserId,
      }));
      setMembers(data);
    });
  }
  function onUpdateInfo(selectedPermission, selectedUserRegisId) {
    setIsProcessing(true);
    let body = {
      userRegisId: selectedUserRegisId,
      permissionId: selectedPermission,
    };
    request(
      "post",
      //"/forbid-member-from-submit-to-contest",
      "/update-permission-of-member-to-contest",
      (res) => {
        successNoti("Đã hoàn thành phân công tự động.");
        setIsProcessing(false);
        setOpenUpdateMemberDialog(false);
        getMembersOfContest();
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
  function handleModelClose() {
    setOpenUpdateMemberDialog(false);
  }
  function getPermissions() {
    request("get", "/get-permissions-of-members-of-contest", (res) => {
      setPermissionIds(res.data);
    });
  }
  useEffect(() => {
    getMembersOfContest();
    getPermissions();
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
      <UpdatePermissionMemberOfContestDialog
        open={openUpdateMemberDialog}
        onClose={handleModelClose}
        onUpdateInfo={onUpdateInfo}
        selectedUserRegisId={selectedUserRegisId}
        permissionIds={permissionIds}
      />
    </div>
  );
}
