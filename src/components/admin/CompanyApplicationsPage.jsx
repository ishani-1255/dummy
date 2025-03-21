import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Download,
  ChevronLeft,
  Users,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  X,
  AlertTriangle,
  UserCheck,
  DollarSign,
  MessageSquare,
  Pencil,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Select,
  Button,
  Badge,
} from "./UIComponents";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusColors = {
    Applied: "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    "Interview Scheduled": "bg-purple-100 text-purple-800",
    Interviewed: "bg-indigo-100 text-indigo-800",
    Offered: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Accepted: "bg-emerald-100 text-emerald-800",
    Declined: "bg-gray-100 text-gray-800",
  };

  const statusIcons = {
    Applied: <FileText className="h-4 w-4 mr-1" />,
    "Under Review": <Search className="h-4 w-4 mr-1" />,
    "Interview Scheduled": <Calendar className="h-4 w-4 mr-1" />,
    Interviewed: <UserCheck className="h-4 w-4 mr-1" />,
    Offered: <DollarSign className="h-4 w-4 mr-1" />,
    Rejected: <X className="h-4 w-4 mr-1" />,
    Accepted: <CheckCircle className="h-4 w-4 mr-1" />,
    Declined: <AlertTriangle className="h-4 w-4 mr-1" />,
  };

  return (
    <span
      className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {statusIcons[status]}
      {status}
    </span>
  );
};

// Application Update Modal Component
const ApplicationUpdateModal = ({ isOpen, onClose, application, onUpdate }) => {
  const [status, setStatus] = useState(application ? application.status : "");
  const [packageOffered, setPackageOffered] = useState(
    application ? application.packageOffered || "" : ""
  );
  const [feedback, setFeedback] = useState(
    application ? application.feedback || "" : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setPackageOffered(application.packageOffered || "");
      setFeedback(application.feedback || "");
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData = {
        status,
        feedback,
      };

      // Only include package if status is Accepted or Offered
      if (status === "Accepted" || status === "Offered") {
        updateData.packageOffered = packageOffered;
      }

      const response = await axios.put(
        `http://localhost:6400/api/admin/applications/${application._id}`,
        updateData,
        { withCredentials: true }
      );

      onUpdate(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating application:", err);
      setError(
        err.response?.data?.message || "Failed to update application status"
      );
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "Applied", label: "Applied" },
    { value: "Under Review", label: "Under Review" },
    { value: "Interview Scheduled", label: "Interview Scheduled" },
    { value: "Interviewed", label: "Interviewed" },
    { value: "Offered", label: "Offered" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" },
    { value: "Declined", label: "Declined" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Application Status</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </div>
            <div className="text-gray-700 p-2 border rounded-md bg-gray-50 flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              {application.student?.name || "Unknown Student"}
            </div>
          </div>

          <div className="mb-4">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </div>
            <div className="text-gray-700 p-2 border rounded-md bg-gray-50 flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
              {application.studentModel || "Unknown"}
            </div>
          </div>

          <div className="mb-4">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </div>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none pl-10"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {(status === "Accepted" || status === "Offered") && (
            <div className="mb-4">
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Package Offered
              </div>
              <div className="relative">
                <Input
                  id="packageOffered"
                  type="text"
                  placeholder="e.g., ₹10 LPA"
                  value={packageOffered}
                  onChange={(e) => setPackageOffered(e.target.value)}
                  className="pl-10 w-full"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Feedback (Optional)
            </div>
            <div className="relative">
              <textarea
                id="feedback"
                placeholder="Provide feedback to the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 pl-10 border rounded-md min-h-[100px]"
              />
              <div className="absolute top-2 left-3 pointer-events-none">
                <MessageSquare className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Company Applications Page Component
const CompanyApplicationsPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch company details and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch company details
        const companyResponse = await axios.get(
          `http://localhost:6400/api/companies/${companyId}`,
          { withCredentials: true }
        );
        setCompany(companyResponse.data);

        // Fetch applications for this company
        const applicationsResponse = await axios.get(
          `http://localhost:6400/api/admin/applications/company/${companyId}`,
          { withCredentials: true }
        );
        setApplications(applicationsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId]);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const nameMatch = app.student?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = !statusFilter || app.status === statusFilter;
    return nameMatch && statusMatch;
  });

  // Download applications as Excel
  const handleDownloadExcel = () => {
    try {
      // Create a CSV string with headers
      let csvContent =
        "Student Name,Branch,Applied Date,Status,Package Offered,Feedback\n";

      // Add data rows
      filteredApplications.forEach((app) => {
        const studentName = app.student?.name || "Unknown";
        const branch = app.studentModel || "N/A";
        const appliedDate = formatDate(app.appliedDate);
        const status = app.status || "N/A";
        const packageOffered = app.packageOffered || "N/A";
        const feedback = (app.feedback || "N/A").replace(/,/g, ";"); // Replace commas to avoid CSV issues

        csvContent += `${studentName},${branch},${appliedDate},${status},${packageOffered},${feedback}\n`;
      });

      // Create a Blob and generate download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set up download link attributes
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${company.name}_Applications_${new Date().toLocaleDateString()}.csv`
      );
      link.style.visibility = "hidden";

      // Add to document, click to download, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading applications:", err);
      alert("Failed to export applications. Please try again.");
    }
  };

  // Handle application update
  const handleApplicationUpdate = (updatedApplication) => {
    setApplications(
      applications.map((app) =>
        app._id === updatedApplication._id ? updatedApplication : app
      )
    );
  };

  // Handle opening the update modal
  const handleOpenModal = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-200 max-w-lg">
          <h3 className="font-bold flex items-center text-lg mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Error
          </h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Company Not Found</h3>
          <p className="text-gray-500 mt-2">
            The requested company could not be found.
          </p>
          <Link
            to="/manage-companies"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center">
          <Link
            to="/manage-companies"
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">
            Applications for {company.name}
          </h1>
        </div>

        {/* Company Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{company.name}</h2>
                  <p className="text-gray-500">{company.industry}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">
                    Visiting: {formatDate(company.visitingDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">
                    Departments: {company.department?.join(", ")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">{company.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 w-full md:w-auto">
            <div className="relative w-40">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
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
            </div>

            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <TableRow
                        key={application._id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {application.student?.name || "Unknown"}
                        </TableCell>
                        <TableCell>{application.studentModel}</TableCell>
                        <TableCell>
                          {formatDate(application.appliedDate)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={application.status} />
                        </TableCell>
                        <TableCell>
                          {application.packageOffered || "—"}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleOpenModal(application)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center"
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Update
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-10 w-10 text-gray-400 mb-2" />
                          <p>No applications found</p>
                          {searchTerm || statusFilter ? (
                            <p className="text-sm mt-1">
                              Try adjusting your filters
                            </p>
                          ) : (
                            <p className="text-sm mt-1">
                              No students have applied to this company yet
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      applications.filter(
                        (app) =>
                          app.status === "Applied" ||
                          app.status === "Under Review" ||
                          app.status === "Interview Scheduled" ||
                          app.status === "Interviewed"
                      ).length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Accepted/Offered
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      applications.filter(
                        (app) =>
                          app.status === "Accepted" || app.status === "Offered"
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Rejected/Declined
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      applications.filter(
                        (app) =>
                          app.status === "Rejected" || app.status === "Declined"
                      ).length
                    }
                  </p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Application Modal */}
      <ApplicationUpdateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onUpdate={handleApplicationUpdate}
      />
    </div>
  );
};

export default CompanyApplicationsPage;
