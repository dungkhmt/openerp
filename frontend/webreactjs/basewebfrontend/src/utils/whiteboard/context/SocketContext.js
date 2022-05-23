import React from "react";
import { io } from "socket.io-client";

export const socket = io("https://openerp.dailyopt.ai");

export const SocketContext = React.createContext({ socket });

const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
