import { Outlet } from "react-router-dom";
import React from "react";
import { Sidebar } from "../components/Sidebar";

export const RootLayout: React.FC = () => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};
