export const warehouse = {
  id: "MENU_WAREHOUSE",
  path: "",
  isPublic: false,
  icon: "HomeSharpIcon",
  text: "QL Kho",
  child: [
    {
      id: "MENU_WAREHOUSE_CREATE",
      path: "/wms/warehouse/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới kho",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_VIEW",
      path: "/wms/warehouse/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách kho",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_VIEW",
      path: "/wms/warehouse/products",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách sản phẩm",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_IMPORT",
      path: "/wms/inventory/import",
      isPublic: false,
      icon: "StarBorder",
      text: "Nhập kho",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_EXPORT",
      path: "/wms/inventory/order",
      isPublic: false,
      icon: "StarBorder",
      text: "Xuất kho",
      child: [],
    },
    {
      id: "MENU_WAREHOUSE_INVENTORY_ITEM",
      path: "/wms/inventory/list",
      isPublic: false,
      icon: "StarBorder",
      text: "QL tồn kho",
      child: [],
    },
    {
      id: "MENU_ORDER_PICKUP_PLANNING",
      path: "/wms/order-pickup-planning/home",
      isPublic: false,
      icon: null,
      text: "Order Pickup Planning",
      child: [],
    },
  ],
};
