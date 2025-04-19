import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Plus,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  X,
  Filter,
  Pencil,
  Trash2,
  MoreVertical,
  AlertTriangle,
  BookOpen,
  Award,
  Download,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios"; // Make sure to install axios

// Company Card Component with Actions
const CompanyCard = ({ company, onViewDetails, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to open applications in a new tab
  const openApplicationsInNewTab = () => {
    window.open(`/admin/applications/view/${company._id}`, "_blank");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 relative">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-3 flex-1 cursor-pointer"
          onClick={() => onViewDetails(company)}
        >
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openApplicationsInNewTab();
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-4 w-4" />
                <span>View Applications</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(company);
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Company</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(company);
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Company</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{company.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Visiting: {formatDate(company.visitingDate)}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openApplicationsInNewTab();
            }}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            <Users className="h-4 w-4 mr-2" />
            View Applications
          </button>
        </div>
      </div>
    </div>
  );
};

// Company Details Modal Component
const CompanyDetailsModal = ({ company, onClose }) => {
  if (!company) return null;

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {company.name}
                </h2>
                <p className="text-gray-500">{company.industry}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Contact Information
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>{company.website || "Not provided"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{company.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-gray-600">{company.location}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Eligible Departments
                </h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {company.department &&
                    company.department.map((dept) => (
                      <span
                        key={dept}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Package Details
                </h3>
                <p className="mt-1 text-gray-900 font-semibold">
                  {company.package}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Eligibility Requirements
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>Minimum CGPA: {company.minimumCgpa}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>Backlogs Allowed: {company.backlogsAllowed}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Visit Date
                </h3>
                <p className="mt-1 text-gray-600">
                  {formatDate(company.visitingDate)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">About Company</h3>
            <p className="mt-1 text-gray-600">
              {company.description || "No description available"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
            <p className="mt-1 text-gray-600">
              {company.requirements || "No specific requirements provided"}
            </p>
          </div>

          {company.updates && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Updates</h3>
              <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-gray-700">{company.updates}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Company Modal Component
const AddCompanyModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    visitingDate: "",
    description: "",
    requirements: "",
    updates: "", // Add updates field to formData
    package: "",
    minimumCgpa: "",
    backlogsAllowed: 0,
    department: [],
  });

  const handleDepartmentChange = (dept) => {
    if (formData.department.includes(dept)) {
      setFormData({
        ...formData,
        department: formData.department.filter((d) => d !== dept),
      });
    } else {
      setFormData({
        ...formData,
        department: [...formData.department, dept],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.department.length === 0) {
      alert("Please select at least one department");
      return;
    }
    onAdd({
      ...formData,
      minimumCgpa: parseFloat(formData.minimumCgpa),
      backlogsAllowed: parseInt(formData.backlogsAllowed),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Company</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligible Departments
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"].map((dept) => (
                  <div key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dept-${dept}`}
                      checked={formData.department.includes(dept)}
                      onChange={() => handleDepartmentChange(dept)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`dept-${dept}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {dept}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Package
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.package}
                  onChange={(e) =>
                    setFormData({ ...formData, package: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visiting Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.visitingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, visitingDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum CGPA Required
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  step="0.1"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.minimumCgpa}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumCgpa: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Backlogs Allowed
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.backlogsAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      backlogsAllowed: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Updates
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                placeholder="Add any updates or important information for students"
                value={formData.updates}
                onChange={(e) =>
                  setFormData({ ...formData, updates: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Add Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Company Modal Component
const EditCompanyModal = ({ company, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...company,
    visitingDate: company.visitingDate
      ? new Date(company.visitingDate).toISOString().split("T")[0]
      : "",
  });

  const handleDepartmentChange = (dept) => {
    if (formData.department.includes(dept)) {
      setFormData({
        ...formData,
        department: formData.department.filter((d) => d !== dept),
      });
    } else {
      setFormData({
        ...formData,
        department: [...formData.department, dept],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.department.length === 0) {
      alert("Please select at least one department");
      return;
    }
    onSave({
      ...formData,
      minimumCgpa: parseFloat(formData.minimumCgpa),
      backlogsAllowed: parseInt(formData.backlogsAllowed),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Company</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligible Departments
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"].map((dept) => (
                  <div key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-dept-${dept}`}
                      checked={formData.department.includes(dept)}
                      onChange={() => handleDepartmentChange(dept)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`edit-dept-${dept}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {dept}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Package
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.package}
                  onChange={(e) =>
                    setFormData({ ...formData, package: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visiting Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.visitingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, visitingDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum CGPA Required
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  step="0.1"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.minimumCgpa}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumCgpa: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Backlogs Allowed
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.backlogsAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      backlogsAllowed: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Updates
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                placeholder="Add any updates or important information for students"
                value={formData.updates}
                onChange={(e) =>
                  setFormData({ ...formData, updates: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Delete Company
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium">{companyName}</span>? This action cannot
          be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ManageCompany Component
const ManageCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:6400/api/companies");
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch companies. Please try again later.");
        setLoading(false);
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !filterDepartment ||
      (company.department && company.department.includes(filterDepartment));
    return matchesSearch && matchesDepartment;
  });

  const departments = ["CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"];

  const handleAddCompany = async (newCompany) => {
    try {
      const response = await axios.post(
        "http://localhost:6400/api/companies",
        newCompany
      );
      setCompanies([...companies, response.data]);
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Failed to add company. Please try again.");
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedCompany) => {
    try {
      const response = await axios.put(
        `http://localhost:6400/api/companies/${updatedCompany._id}`,
        updatedCompany
      );
      setCompanies(
        companies.map((company) =>
          company._id === updatedCompany._id ? response.data : company
        )
      );
    } catch (err) {
      console.error("Error updating company:", err);
      alert("Failed to update company. Please try again.");
    }
  };

  const handleDeleteCompany = (companyToDelete) => {
    setCompanyToDelete(companyToDelete);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:6400/api/companies/${companyToDelete._id}`
      );
      setCompanies(
        companies.filter((company) => company._id !== companyToDelete._id)
      );
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Failed to delete company. Please try again.");
    }
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Companies
            </h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Company</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading companies...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No companies found
              </h3>
              <p className="mt-1 text-gray-500">
                {searchTerm || filterDepartment
                  ? "Try adjusting your search or filter"
                  : "Add a company to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company._id}
                  company={company}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedCompany && (
          <CompanyDetailsModal
            company={selectedCompany}
            onClose={() => setSelectedCompany(null)}
          />
        )}

        {/* Add Modal */}
        <AddCompanyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCompany}
        />

        {/* Edit Modal */}
        {editingCompany && (
          <EditCompanyModal
            company={editingCompany}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingCompany(null);
            }}
            onSave={handleSaveEdit}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCompanyToDelete(null);
          }}
          onConfirm={confirmDelete}
          companyName={companyToDelete?.name || ""}
        />
      </div>
    </div>
  );
};

export default ManageCompany;
