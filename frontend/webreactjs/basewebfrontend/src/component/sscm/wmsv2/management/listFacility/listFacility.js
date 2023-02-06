import { successNoti } from "utils/notification";
import { request } from "api";
import CommandBarButton from "../components/commandBarButton";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import StandardTable from "component/table/StandardTable";

const ListFacility = () => {

  const [isHideCommandBar, setHideCommandBar] = useState(true);
  const [facilitiesTableData, setFacilitiesTableData] = useState([]);

  useEffect(() => {
    request(
      "get",
      "/wmsv2/admin/facility",
      (res) => {
        const tableData = res.data.map(obj => {
          obj.tableData = { "checked": false };
          return obj;
        })
        setFacilitiesTableData(tableData);
      })
  }, []);

  const columns = [
    { title: "Tên", field: "name" },
    { title: "Code", field: "code" },
    { title: "Địa chỉ", field: "address" }
  ];

  const removeSelectedFacilities = () => {
    const selectedFacilityIds = facilitiesTableData.filter((facility) => facility.tableData.checked == true).map((obj) => obj.facilityId);
    request(
      "delete",
      "/wmsv2/admin/facility",
      (res) => { 
        successNoti("Xóa thành công");
      const newTableData = facilitiesTableData.filter((facility) => !selectedFacilityIds.includes(facility.facilityId));
      setFacilitiesTableData(newTableData);
      },
      { },
      selectedFacilityIds
    )
  }

  const onSelectionChangeHandle = (rows) => {
    setFacilitiesTableData(facilitiesTableData);
    if (rows.length === 0) {
      setHideCommandBar(true);
    } else {
      setHideCommandBar(false);
    }
  }

  return <div>
    <div>
      <StandardTable
        title={"Danh sách nhà kho"}
        columns={columns}
        data={facilitiesTableData}
        hideCommandBar={isHideCommandBar}
        options={{
          selection: true,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
        // onRowClick={ (selectedRows) => console.log(selectedRows) }
        onSelectionChange={onSelectionChangeHandle}
        commandBarComponents={ <CommandBarButton onClick={removeSelectedFacilities}>Xóa</CommandBarButton> }
      />
    </div>
  </div>
}

export default ListFacility;
