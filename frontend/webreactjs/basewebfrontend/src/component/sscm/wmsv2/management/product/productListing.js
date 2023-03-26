import { request } from "api";
import StandardTable from "component/table/StandardTable";
import { API_PATH } from "../apiPaths";
const { Fragment, useState, useEffect } = require("react");

const ProductListing =  () => {

  const [productTableData, setProductTableData] = useState([]);
  
  const columns = [
    { title: "Tên sản phẩm", field: "name" },
    { title: "Mã sản phẩm", field: "code" },
    { title: "Giá bán lẻ (VNĐ)", field: "retailPrice" },
    { title: "Số lượng hàng tồn", field: "onHandQuantity" }
  ];

  useEffect(() => {
    async function fetchData() {
      request(
        "get",
        API_PATH.PRODUCT,
        (res) => {
          console.log("data response -> ", res);
          setProductTableData(res.data);
          console.log("product table data -> ", productTableData);
        }
      )
    }

    fetchData();
  }, []);

  return (
    <Fragment>
      <StandardTable
        title={"Danh sách sản phẩm"}
        columns={columns}
        data={productTableData}
        options={{
          selection: true,
          pageSize: 20,
          search: true,
          sorting: true,
        }} 
      />
    </Fragment>
  );
}

export default ProductListing;