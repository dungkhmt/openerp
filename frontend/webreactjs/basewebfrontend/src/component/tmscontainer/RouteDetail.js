import React from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@material-ui/core";
import MaterialTable, { MTableToolbar } from "material-table";
//import OrderList from "./OrderList";

export default function RouteDetail(props) {
  const { open, setOpen, route, orders } = props;
  const columns = [
    { title: "Location", field: "locationCode" },
    { title: "Action", field: "action" },
    { title: "ArrivalTime", field: "arrivalTime" },
    { title: "DepartureTime", field: "departureTime" },
    { title: "TravelTime", field: "travelTime" },
  ];
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Route Detail</DialogTitle>
        <DialogContent>
          {/*
                  <OrderList orders={orders} /> */}
          <MaterialTable
            title={"Route Detail"}
            columns={columns}
            data={route}
          />
          <div>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
