import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { axiosGet, request } from "api";

export default function ListWarehouse() {
  const { path } = useRouteMatch();
  const [listWarehouse, setListWarehouse] = useState([]);
  const history = useHistory();

  const getListWarehouse = () => {
    request(
      "get",
      "/admin/wms/warehouse",
      (res) => {
        console.log("res data", res.data);
        setListWarehouse(res.data);
      },
      {
        onError: (res) => {
          console.log("getListWarehouse, error ", error)
        },
      }
    );
  };


  useEffect(() => {
    getListWarehouse();
  }, []);


  const columns = [
    {
      title: "Tên Kho",
      field: "name",

      render: (rowData) => (
        <p>{rowData["name"]}</p>
      ),
    },
    {
      title: "Mã Kho", field: "code", render: (rowData) => (
        <p>{rowData["code"]}</p>
      )
    },
    {
      title: "Địa chỉ", field: "address", render: (rowData) => (
        <p>{rowData["address"]}</p>
      )
    },
  ];

  return (
    <div>
      <MaterialTable
        title="Danh sách kho"
        columns={columns}
        data={listWarehouse}
        onRowClick={(event, rowData) => {
          history.push(`${path.replace('/list', '')}/${rowData["facilityId"]}`);
        }}
      />
    </div>
  )
}
