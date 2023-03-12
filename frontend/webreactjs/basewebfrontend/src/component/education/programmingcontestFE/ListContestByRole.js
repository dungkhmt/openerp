// import { useState } from "react";

// import MaterialTable from "material-table";
// import { request } from "../../../api";
// import { toFormattedDateTime } from "../../../utils/dateutils";

// export default function ListContestByRole() {
//   const [contests, setContests] = useState([]);
//   const columns = [
//     { title: "ContestID", field: "contestId" },
//     { title: "Role", field: "roleId" },
//     { title: "Created At", field: "createdAt" },
//   ];
//   function getContestsByRole() {
//     request(
//       "get",
//       "/get-my-contest-by-role",
//       (res) => {
//         let L = res.data.map((c) => ({
//           ...c,
//           createdAt: toFormattedDateTime(c.createdDate),
//         }));
//         setContests(L);
//       },
//       { 401: () => {} }
//     );
//   }
//   return (
//     <div>
//       ListContestByRole
//       <MaterialTable>
//         columns = {columns}
//         data={contests}
//       </MaterialTable>
//     </div>
//   );
// }
