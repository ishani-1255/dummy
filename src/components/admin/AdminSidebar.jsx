import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Briefcase,
  Award,
  Settings,
  LogOut,
  FileText,
  BarChart3,
  ChevronDown,
  Mail,
  User,
  LayoutDashboard,
  Home,
} from "lucide-react";
import axios from "axios";

const AdminSidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:6400/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items with nested subitems
  const navItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      path: "/admin/dashboard",
    },
    {
      title: "Companies",
      icon: <Building2 size={20} />,
      path: "/admin/companies",
    },
    {
      title: "Applications",
      icon: <FileText size={20} />,
      path: "/admin/applications",
    },
    {
      title: "Department Applications",
      icon: <Building2 size={20} />,
      path: "/admin/department-applications",
    },
    {
      title: "Students",
      icon: <Users size={20} />,
      path: "/admin/students",
    },
    {
      title: "Placements",
      icon: <Briefcase size={20} />,
      path: "/admin/placements",
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-white min-h-screen border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Campus Placements</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                path === item.path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3 text-gray-500">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-2">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Admin User</div>
            <div className="text-xs text-gray-500">admin@example.com</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
