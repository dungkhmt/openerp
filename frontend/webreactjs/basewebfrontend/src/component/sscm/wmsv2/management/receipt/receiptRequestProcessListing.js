import { request } from "api";
import { API_PATH } from "../apiPaths";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

const { default: StandardTable } = require("component/table/StandardTable");
const { Fragment, useState, useEffect } = require("react")

const ReceiptRequestProcessListing = () => {

  const [receiptTableData, setReceiptTableData] = useState([]);
  const history = useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    request(
      "get",
      API_PATH.SALE_MANAGEMENT_RECEIPT_REQUEST + "?status=APPROVED",
      (res) => {
        setReceiptTableData(res.data);
      }
    )
  }, []);

  return <Fragment>
    <StandardTable 
      title="Danh sách đơn hàng cần xử lý"
      columns={[
        { title: "Ngày tạo đơn", field: "createdDate" },
        { title: "Ngày muốn nhận hàng", field: "expectedReceiveDate" },
        { title: "Người tạo đơn", field: "createdBy" },
        { title: "Người phê duyệt", field: "approvedBy" }
      ]}
      data={receiptTableData}
      options={{
        selection: false,
        pageSize: 20,
        search: true,
        sorting: true,
      }}
      hideCommandBar={true}
      onRowClick={ (event, rowData) => {
        window.location.href = `${path}/${rowData.receiptRequestId}`;
      } }
    />
  </Fragment>
}

export default ReceiptRequestProcessListing;