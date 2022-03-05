import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";

const columns = [
  { title: "OrderID", field: "orderID" },
  { title: "Description", field: "description" },
];
function OrderList(props) {
  const { orders } = props;

  return (
    <div>
      <MaterialTable title={"Route Detail"} columns={columns} data={orders} />
    </div>
  );
}
export default OrderList;
