import React from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@material-ui/core";
import MaterialTable, { MTableToolbar } from "material-table";
export default function RouteDetail(props) {
  const { open, setOpen, route } = props;
  const columns = [
    { title: "Shelf", field: "shelfID" },
    { title: "Description", field: "description" },
  ];
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Rotue Detail</DialogTitle>
        <DialogContent>
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
