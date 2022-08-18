import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { axiosGet, request } from "api";
import moment from 'moment';

export default function ListWarehouse() {
  const { path } = useRouteMatch();
  const [listWarehouse, setListWarehouse] = useState([]);
  const history = useHistory();

  const getListWarehouse = () => {
    request(
      "get",
      "/admin/wms/warehouse",
      (res) => {
        setListWarehouse(res.data);
      },
      {
        onError: (res) => {
          console.log("getListWarehouse, error ", res)
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
    {
      title: "Ngày khởi tạo", field: "createAt", render: (rowData) => (
        // {moment(dateToBeFormate).format('DD/MM/YYYY')}
        <p>{rowData["createAt"] ? moment(rowData["createAt"]).format('DD/MM/YYYY') : ""}</p>
      )
    },
  ];

  return (
    <div>
      <MaterialTable
        title="Danh sách kho"
        columns={columns}
        data={listWarehouse.sort((a, b) => (b.facilityId - a.facilityId))}
        onRowClick={(event, rowData) => {
          history.push(`${path.replace('/list', '')}/${rowData["facilityId"]}`);
        }}
      />
    </div>
  )
}
