import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Users,
  FileText,
  Search,
  ChevronDown,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const DepartmentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6400/api/admin/applications/all"
        );
        setApplications(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const departments = ["all", "CE", "CSE", "IT", "SFE", "ME", "EEE", "EC"];

  const filteredApplications = applications.filter((app) => {
    const matchesDepartment =
      selectedDepartment === "all" || app.studentModel === selectedDepartment;
    const matchesSearch =
      searchTerm === "" ||
      (app.student &&
        app.student.name &&
        app.student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.company &&
        app.company.name &&
        app.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDepartment && matchesSearch;
  });

  const groupedApplications = filteredApplications.reduce((acc, app) => {
    if (!app.company) return acc;

    const companyId = app.company._id;
    if (!acc[companyId]) {
      acc[companyId] = {
        company: app.company,
        applications: [],
      };
    }
    acc[companyId].applications.push(app);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 max-w-lg mx-auto">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Department Applications</h1>
            <div className="flex space-x-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-64"
                />
              </div>
            </div>
          </div>

          {Object.keys(groupedApplications).length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-500">
                No applications found for the selected department. Try selecting
                a different department or clearing your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {Object.values(groupedApplications).map(
                ({ company, applications }) => (
                  <div
                    key={company._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {company.name}
                        </h2>
                        <p className="text-gray-600">{company.industry}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Total Applications: {applications.length}
                        </p>
                        <p className="text-sm text-gray-600">
                          Package: ₹{company.package} LPA
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              CGPA
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Applied Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Resume
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {applications.map((app) => (
                            <tr key={app._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {app.student?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {app.student?.email || "No email"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.studentModel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.student?.cgpa || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(app.appliedDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    app.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : app.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : app.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {app.status.charAt(0).toUpperCase() +
                                    app.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.resume ? (
                                  <a
                                    href={app.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <LinkIcon className="h-4 w-4 mr-1" />
                                    View Resume
                                  </a>
                                ) : (
                                  <span className="text-gray-400">
                                    No resume
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentApplications;
