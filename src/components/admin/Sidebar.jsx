import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Search,
  GraduationCap,
  Users,
  Calendar,
  BarChart3,
  Wallet,
  DollarSign,
  UserCog,
  FileText,
  ChevronRight
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, path, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-200
      ${isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
    <ChevronRight className={`h-4 w-4 ml-auto transform transition-transform duration-200
      ${isActive ? 'rotate-90' : ''}`} />
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState('/admin');

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Building2, label: 'Manage Companies', path: '/manage-companies' },
    { icon: Search, label: 'Student Info', path: '/search-student' },
    { icon: Users, label: 'Batches', path: '/batches' },
    { icon: Calendar, label: 'Manage Interviews', path: '/manage-interviews' },
    { icon: BarChart3, label: 'Placement Records', path: '/placement-records' },
    { icon: UserCog, label: 'Coordinator Management', path: '/coordinator-management' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: FileText, label: 'LogOut', path: '/logout', onClick: () => window.location.href = 'http://localhost:6400/logout' }
  ];

  return (
    <div className="h-screen w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Placement Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={activePath === item.path}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <UserCog className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;