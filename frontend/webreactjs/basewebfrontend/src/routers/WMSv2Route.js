import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreateWarehouse from "component/sscm/wmsv2/management/createWarehouse/createWarehouse";
import ListWarehouse from "component/sscm/wmsv2/management/listWarehouse/listWarehouses";
import ProductDetail from "component/sscm/wmsv2/management/product/productDetail";
import ProductListing from "component/sscm/wmsv2/management/product/productListing";
import ReceiptDetail from "component/sscm/wmsv2/management/receipt/receiptDetail";
import ReceiptListing from "component/sscm/wmsv2/management/receipt/receiptListing";
import PriceConfig from "component/sscm/wmsv2/management/product/priceConfig";
import ProductGeneralView from "component/sscm/wmsv2/management/ecommerce/productGeneralView";
import ProductCustomerDetailView from "component/sscm/wmsv2/management/ecommerce/productCustomerDetailView";
import CartDetail from "component/sscm/wmsv2/management/ecommerce/cartDetail";

export default function WMSv2Route() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={CreateWarehouse}
          exact
          path={`${path}/warehouse/create`}
        ></Route>
        <Route
          component={ListWarehouse}
          exact
          path={`${path}/warehouse`}
        ></Route>
        <Route
          component={CreateWarehouse}
          exact
          path={`${path}/warehouse/update/:id`}
        ></Route>
        <Route
          component={ProductListing}
          exact
          path={`${path}/product`}
        ></Route>
        <Route
          component={ProductDetail}
          exact
          path={`${path}/product/update/:id`}
        ></Route>
        <Route
          component={ProductDetail}
          exact
          path={`${path}/product/create`}
        ></Route>
        <Route
          component={ReceiptDetail}
          exact
          path={`${path}/receipt/create`}
        ></Route>
        <Route
          component={ReceiptDetail}
          exact
          path={`${path}/receipt/update/:id`}
        ></Route>
        <Route
          component={ReceiptListing}
          exact
          path={`${path}/receipt`}
        ></Route>
        <Route
          component={PriceConfig}
          exact
          path={`${path}/price-config`}
        ></Route>
        <Route
          component={ProductGeneralView}
          exact
          path={`${path}/customer/products`}
        ></Route>
        <Route
          component={ProductCustomerDetailView}
          exact
          path={`${path}/customer/products/:id`}
        ></Route>
        <Route
          component={CartDetail}
          exact
          path={`${path}/customer/cart`}
        ></Route>
      </Switch>
    </div>
  );
}
