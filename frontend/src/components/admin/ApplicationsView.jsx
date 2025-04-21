import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Info,
  User,
  Mail,
  Phone,
  Book,
  Award,
  AlertTriangle,
  FileType,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const ApplicationsView = () => {
  const { companyId } = useParams();
  const location = useLocation();

  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    // Check if we have data passed via POST
    const searchParams = new URLSearchParams(location.search);
    const companyData = searchParams.get("companyData");
    const applicationsData = searchParams.get("applicationsData");

    if (companyData && applicationsData) {
      try {
        setCompany(JSON.parse(companyData));
        setApplications(JSON.parse(applicationsData));
        setLoading(false);
      } catch (err) {
        console.error("Error parsing data:", err);
        fetchDataFromAPI();
      }
    } else {
      fetchDataFromAPI();
    }
  }, [companyId, location]);

  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);

      // Fetch company data
      const companyResponse = await axios.get(
        `http://localhost:6400/api/companies/${companyId}`
      );
      setCompany(companyResponse.data);

      // Fetch applications data
      const applicationsResponse = await axios.get(
        `http://localhost:6400/api/admin/applications/company/${companyId}`,
        { withCredentials: true }
      );
      setApplications(applicationsResponse.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to load data. " + (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    // Prepare data for Excel export
    const exportData = applications.map((app) => ({
      "Student Name": app.student?.name || "N/A",
      "Registration Number": app.student?.registrationNumber || "N/A",
      Department: app.studentModel || "N/A",
      "Year of Admission": app.student?.yearOfAdmission || "N/A",
      Semester: app.student?.semester || "N/A",
      CGPA: app.student?.cgpa || "N/A",
      "Last Sem GPA": app.student?.lastSemGPA || "N/A",
      Backlogs: app.student?.backlog || "0",
      Email: app.student?.email || "N/A",
      Phone: app.student?.phone || "N/A",
      "Father Name": app.student?.fatherName || "N/A",
      "Mother Name": app.student?.motherName || "N/A",
      Address: app.student?.address || "N/A",
      "Applied Date": new Date(app.appliedDate).toLocaleDateString(),
      Status: app.status || "Applied",
      "Package Offered": app.packageOffered || "N/A",
      "Resume Link": app.resume || "Not provided",
      "Cover Letter": app.coverLetter || "Not provided",
      "Additional Info": app.additionalInfo || "None",
      Feedback: app.feedback || "None",
    }));

    // Generate CSV content
    const headers = Object.keys(exportData[0] || {}).join(",");
    const rows = exportData.map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${company?.name || "company"}-applications.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      const searchMatch =
        searchTerm === "" ||
        (app.student?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (app.student?.registrationNumber || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (app.studentModel || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "" || app.status === statusFilter;

      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "name":
          valueA = a.student?.name || "";
          valueB = b.student?.name || "";
          break;
        case "regNumber":
          valueA = a.student?.registrationNumber || "";
          valueB = b.student?.registrationNumber || "";
          break;
        case "cgpa":
          valueA = parseFloat(a.student?.cgpa || 0);
          valueB = parseFloat(b.student?.cgpa || 0);
          break;
        case "backlog":
          valueA = parseInt(a.student?.backlog || 0);
          valueB = parseInt(b.student?.backlog || 0);
          break;
        case "date":
          valueA = new Date(a.appliedDate || 0).getTime();
          valueB = new Date(b.appliedDate || 0).getTime();
          break;
        default:
          valueA = a.student?.name || "";
          valueB = b.student?.name || "";
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Status badge component
  const StatusBadge = ({ status }) => {
    let color = "";
    let icon = null;

    switch (status) {
      case "Applied":
        color = "bg-blue-100 text-blue-800";
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case "Under Review":
        color = "bg-yellow-100 text-yellow-800";
        icon = <Info className="h-3 w-3 mr-1" />;
        break;
      case "Interview Scheduled":
        color = "bg-purple-100 text-purple-800";
        icon = <Calendar className="h-3 w-3 mr-1" />;
        break;
      case "Interviewed":
        color = "bg-indigo-100 text-indigo-800";
        icon = <FileText className="h-3 w-3 mr-1" />;
        break;
      case "Offered":
      case "Accepted":
        color = "bg-green-100 text-green-800";
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case "Rejected":
      case "Declined":
        color = "bg-red-100 text-red-800";
        icon = <XCircle className="h-3 w-3 mr-1" />;
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        {icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto ml-72">
          <div className="p-4 md:p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto ml-72">
          <div className="p-4 md:p-6">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Company Not Found
            </h2>
            <p className="text-gray-600 text-center mb-4">
              The company information could not be loaded.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto ml-72">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {company?.name} - Applications
                </h1>
                <p className="text-gray-500 mt-1">
                  {applications.length}{" "}
                  {applications.length === 1 ? "application" : "applications"}{" "}
                  received
                </p>
              </div>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-fit"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or registration number..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Offered">Offered</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Declined">Declined</option>
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="regNumber">Sort by Reg. Number</option>
                <option value="cgpa">Sort by CGPA</option>
                <option value="date">Sort by Date</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration No.
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
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {application.student?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.student?.registrationNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.studentModel || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            parseFloat(application.student?.cgpa) >= 8.5
                              ? "text-green-600"
                              : parseFloat(application.student?.cgpa) >= 7.0
                              ? "text-blue-600"
                              : parseFloat(application.student?.cgpa) >= 6.0
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {application.student?.cgpa || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.appliedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {application.packageOffered ? (
                          <span className="text-green-600 font-medium">
                            ₹{application.packageOffered} LPA
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.student?.phone || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No applications found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter
                    ? "Try adjusting your search or filters"
                    : "No students have applied yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Student Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {selectedApplication.student?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium">
                      {selectedApplication.student?.registrationNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">
                      {selectedApplication.studentModel || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {selectedApplication.student?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {selectedApplication.student?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {selectedApplication.student?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Book className="mr-2 h-5 w-5 text-blue-600" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">CGPA</p>
                    <p
                      className={`font-medium ${
                        parseFloat(selectedApplication.student?.cgpa) >= 8.5
                          ? "text-green-600"
                          : parseFloat(selectedApplication.student?.cgpa) >= 7.0
                          ? "text-blue-600"
                          : parseFloat(selectedApplication.student?.cgpa) >= 6.0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedApplication.student?.cgpa || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Semester GPA</p>
                    <p className="font-medium">
                      {selectedApplication.student?.lastSemGPA || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Backlogs</p>
                    <p className="font-medium">
                      {selectedApplication.student?.backlog || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year of Admission</p>
                    <p className="font-medium">
                      {selectedApplication.student?.yearOfAdmission || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Semester</p>
                    <p className="font-medium">
                      {selectedApplication.student?.semester || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Skills</p>
                    <p className="font-medium">
                      {selectedApplication.student?.skills || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Status and Documents */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Application Status and Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Application Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedApplication.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p className="font-medium">
                      {formatDate(selectedApplication.appliedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Package Offered</p>
                    <p className="font-medium text-green-600">
                      {selectedApplication.packageOffered
                        ? `₹${selectedApplication.packageOffered} LPA`
                        : "Not offered yet"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    {selectedApplication.resume ? (
                      <a
                        href={selectedApplication.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 mt-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                      >
                        <FileType className="h-4 w-4 mr-2" />
                        View Resume
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <p className="text-gray-500">No resume provided</p>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Cover Letter</p>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    {selectedApplication.coverLetter ? (
                      <p className="whitespace-pre-wrap">
                        {selectedApplication.coverLetter}
                      </p>
                    ) : (
                      <p className="text-gray-500">No cover letter provided</p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Additional Information
                  </p>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    {selectedApplication.additionalInfo ? (
                      <p className="whitespace-pre-wrap">
                        {selectedApplication.additionalInfo}
                      </p>
                    ) : (
                      <p className="text-gray-500">
                        No additional information provided
                      </p>
                    )}
                  </div>
                </div>

                {/* Feedback */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Feedback</p>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    {selectedApplication.feedback ? (
                      <p className="whitespace-pre-wrap">
                        {selectedApplication.feedback}
                      </p>
                    ) : (
                      <p className="text-gray-500">No feedback provided yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsView;
