import React, { useEffect } from "react";
import { request } from "../api";
export default function Home() {
  function ping() {
    request(
      "get",
      "/ping",
      (res) => {
        console.log("ping server, res = ", res.data);
      },
      {
        onError: (e) => {
          console.log("error ", e);
        },
      }
    );
  }
  useEffect(() => {
    //ping();
  }, []);
  return <div></div>;
}
