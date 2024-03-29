const getWarehouseNameByWarehouseId = (id, warehouseGeneralList) => {
  for (var i = 0; i < warehouseGeneralList.length; i++) {
    if (warehouseGeneralList[i].warehouseId == id) {
      return warehouseGeneralList[i].name;
    }
  };
}

const getProductNameFromProductId = (id, productList) => {
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].productId == id) {
      return productList[i].name;
    }
  }
}

const convertTimeStampToDate = ( time ) => {
  const date = new Date(time.slice(0, time.indexOf("T")));
  return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
}

export { getWarehouseNameByWarehouseId, getProductNameFromProductId, convertTimeStampToDate };