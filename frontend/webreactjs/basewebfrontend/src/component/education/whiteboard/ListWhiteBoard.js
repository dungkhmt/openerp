import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { request } from "../programmingcontestFE/Request";

export default function ListWhiteBoard() {
  const { path } = useRouteMatch();
  const [listWhiteboard, setListWhiteboard] = useState([])

  const columns = [
    {
      title: "WhiteboardId",
      field: "id",
      render: (rowData) => (
        <Link to={`${path.replace('/list', '')}/${rowData["id"]}`}>{rowData["id"]}</Link>
      ),
    },
    { title: "Name", field: "name", render: (rowData) => (
      <p>{rowData["name"] ?? `Whiteboard ${rowData["id"]}`}</p>
    ) },
    { title: "Created user", field: "createdUser", render: (rowData) => (
      <p>{rowData["createdBy"]}</p>
    )},
  ];

  useEffect(() => {
    void (async () => {
      await request("get", '/whiteboards', (res) => {setListWhiteboard(res.data)}, {}, {});
    })()
  }, [])

  return (
    <div>
      <MaterialTable
        title="Whiteboard List"
        columns={columns}
        data={listWhiteboard}
      />
    </div>
  )
  
}
