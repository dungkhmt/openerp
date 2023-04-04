export const WMSV2 = {
  id: "MENU_WMSv2",
  path: "",
  isPublic: false,
  icon: "HomeSharpIcon",
  text: "QL Kho version 2",
  child: [
    {
      id: "MENU_WMSv2_VIEW_FACILITY",
      path: "/wmsv2/warehouse",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách kho",
      child: [],
    },
    {
      id: "MENU_WMSv2_PRODUCT_DETAIL",
      path: "/wmsv2/product",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách sản phẩm",
      child: [],
    },
    {
      id: "MENU_WMSv2_RECEIPT_DETAIL",
      path: "/wmsv2/receipt",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách đơn nhập hàng",
      child: [],
    },
    {
      id: "MENU_WMSv2_PRODUCT_PRICE_CONFIG",
      path: "/wmsv2/price-config",
      isPublic: false,
      icon: "StarBorder",
      text: "Cấu hình giá bán",
      child: [],
    }
  ],
};
