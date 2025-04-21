import React from "react";
import Sidebar from "./Sidebar";

/**
 * AdminLayout - A wrapper component that provides a consistent layout for admin pages
 * Including the fixed sidebar and proper margins for the main content
 */
const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-72">{children}</div>
    </div>
  );
};

export default AdminLayout;
