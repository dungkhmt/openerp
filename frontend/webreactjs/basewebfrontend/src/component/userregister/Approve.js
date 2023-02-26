// import { CircularProgress } from "@material-ui/core";
// import Button from "@material-ui/core/Button";
// import MaterialTable from "material-table";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import { authGet, request } from "../../api";

// // TODO: consider remove
// export default function Approve() {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const history = useHistory();

//   const [waiting, setWaiting] = useState({});
//   const [approved, setApproved] = useState({});

//   const [userRegisterList, setUserRegisterList] = useState([]);

//   function getUserRegisterList() {
//     request("get", "/user/get-all-register-user", (res) => {
//       let userRegisterList = res.data;
//       setUserRegisterList(userRegisterList);
//     });
//   }

//   useEffect(() => {
//     getUserRegisterList();
//   }, []);

//   const columns = [
//     { title: "Tên đăng nhập", field: "userLoginId" },
//     { title: "Email", field: "email" },
//     { title: "Tên đầy đủ", field: "fullName" },
//     {
//       title: "",
//       render: (rowData) =>
//         waiting[rowData["userLoginId"]] ? (
//           <CircularProgress color="secondary" />
//         ) : approved[rowData["userLoginId"]] ? (
//           <Button variant="contained" disabled>
//             Đã phê duyệt
//           </Button>
//         ) : (
//           <Button
//             color={"primary"}
//             variant={"contained"}
//             onClick={() => handleApprove(rowData["userLoginId"])}
//           >
//             Phê duyệt
//           </Button>
//         ),
//     },
//   ];

//   //phamducdat

//   const handleUpdatePassWord = () => {
//     history.push("/userregister/Register");
//   };

//   async function handleApprove(userLoginId) {
//     waiting[userLoginId] = true;
//     setWaiting(Object.assign({}, waiting));
//     let response = await authGet(
//       dispatch,
//       token,
//       "/user/approve-register/" + userLoginId
//     );
//     waiting[userLoginId] = false;
//     setWaiting(Object.assign({}, waiting));
//     if (response) {
//       approved[userLoginId] = true;
//       setApproved(Object.assign({}, approved));
//     } else {
//       alert("Phê duyệt thất bại!");
//     }
//   }

//   return (
//     <div>
//       <MaterialTable
//         title={"Danh sách người dùng cần phê duyệt"}
//         columns={columns}
//         data={userRegisterList}
//         options={{ search: false }}
//       />
//     </div>
//   );
// }
