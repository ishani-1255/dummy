import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="mt-6">
        <ul>
          <li className="px-6 py-3 hover:bg-gray-700">
            <Link to="/admin/dashboard" className="flex items-center">
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="px-6 py-3 hover:bg-gray-700 bg-gray-700">
            <Link to="/admin/interviews" className="flex items-center">
              <span>Interviews</span>
            </Link>
          </li>
          <li className="px-6 py-3 hover:bg-gray-700">
            <Link to="/admin/students" className="flex items-center">
              <span>Students</span>
            </Link>
          </li>
          <li className="px-6 py-3 hover:bg-gray-700">
            <Link to="/admin/companies" className="flex items-center">
              <span>Companies</span>
            </Link>
          </li>
          <li className="px-6 py-3 hover:bg-gray-700">
            <Link to="/admin/settings" className="flex items-center">
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
