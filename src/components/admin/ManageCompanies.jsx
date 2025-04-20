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
  MessageSquare,
  DollarSign,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminLayout from "./AdminLayout";
import axios from "axios"; // Make sure to install axios

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
    Interviewed: <User className="h-4 w-4 mr-1" />,
    Offered: <span className="mr-1">₹</span>,
    Rejected: <XCircle className="h-4 w-4 mr-1" />,
    Accepted: <CheckCircle className="h-4 w-4 mr-1" />,
    Declined: <AlertTriangle className="h-4 w-4 mr-1" />,
  };

  return (
    <span
      className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusIcons[status]}
      {status}
    </span>
  );
};

// Application Modal Component
const ApplicationModal = ({ application, isOpen, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(application?.status || "Applied");
  const [feedback, setFeedback] = useState(application?.feedback || "");
  const [packageOffered, setPackageOffered] = useState(
    application?.packageOffered || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (application) {
      setStatus(application.status || "Applied");
      setFeedback(application.feedback || "");
      setPackageOffered(application.packageOffered || "");
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData = { status, feedback };

      // Only include package if status is Accepted or Offered
      if (status === "Accepted" || status === "Offered") {
        updateData.packageOffered = packageOffered;
      }

      const response = await axios.put(
        `http://localhost:6400/api/admin/applications/${application._id}`,
        updateData,
        { withCredentials: true }
      );

      onUpdateStatus(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating application:", err);
      setError(err.response?.data?.message || "Failed to update application");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    "Applied",
    "Under Review",
    "Interview Scheduled",
    "Interviewed",
    "Offered",
    "Accepted",
    "Rejected",
    "Declined",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
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
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <div className="p-3 border rounded-md bg-gray-50">
                <div className="font-medium">
                  {application.student?.name || "Unknown"}
                </div>
                <div className="text-sm text-gray-500">
                  {application.studentModel || "N/A"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(status === "Accepted" || status === "Offered") && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Offered
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., ₹10 LPA"
                  value={packageOffered}
                  onChange={(e) => setPackageOffered(e.target.value)}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 font-medium">₹</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md min-h-[120px]"
              placeholder="Provide feedback for the student..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Applications List Modal Component
const ApplicationsListModal = ({ company, isOpen, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch applications when the modal opens
  useEffect(() => {
    console.log(
      "ApplicationsListModal mounted, company:",
      company?._id,
      "isOpen:",
      isOpen
    );

    const fetchData = async () => {
      if (!company?._id) {
        console.log("No company ID available, skipping fetch");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching applications for company:", company?._id);
        const response = await axios.get(
          `http://localhost:6400/api/admin/applications/company/${company._id}`,
          { withCredentials: true }
        );
        console.log(
          "Applications fetched:",
          response.data.length,
          "applications"
        );
        console.log("First application:", response.data[0]);
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
        setLoading(false);
      }
    };

    if (isOpen && company?._id) {
      console.log("Modal is open and company ID exists, fetching data");
      fetchData();
    }
  }, [company, isOpen]);

  // Don't render anything if the modal is not open
  if (!isOpen) {
    console.log("ApplicationsListModal not rendering because isOpen is false");
    return null;
  }

  console.log(
    "ApplicationsListModal rendering with isOpen=true, applications count:",
    applications.length
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUpdateApplication = (updatedApp) => {
    setApplications((apps) =>
      apps.map((app) => (app._id === updatedApp._id ? updatedApp : app))
    );
  };

  const openUpdateModal = (application) => {
    console.log("Opening update modal for application:", application._id);
    setSelectedApplication(application);
    setApplicationModalOpen(true);
  };

  const closeUpdateModal = () => {
    setApplicationModalOpen(false);
    setSelectedApplication(null);
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const studentName = app.student?.name?.toLowerCase() || "";
    const regNumber = app.student?.registrationNumber?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    return studentName.includes(searchLower) || regNumber.includes(searchLower);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-lg w-[85%] h-[80vh] max-h-[85vh] overflow-hidden z-50 flex flex-col">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10 shadow-sm">
          <h2 className="text-xl font-bold flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            {company.name} - Applications
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by student name or registration number..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-500">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm
                  ? "No matching applications found"
                  : "No applications yet"}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "No students have applied to this company yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            {application.student?.name?.charAt(0) || "U"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {application.student?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student?.registrationNumber || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.studentModel || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.appliedDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={application.status || "Applied"} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.packageOffered || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="max-w-[250px] truncate">
                          {application.feedback || "No feedback yet"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openUpdateModal(application)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md font-medium"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Update Modal */}
      {applicationModalOpen && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isOpen={applicationModalOpen}
          onClose={closeUpdateModal}
          onUpdateStatus={handleUpdateApplication}
        />
      )}
    </div>
  );
};

// Offers Status Modal Component
const OffersStatusModal = ({ company, isOpen, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, accepted, pending, declined

  // Fetch applications when the modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!company?._id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:6400/api/admin/applications/company/${company._id}`,
          { withCredentials: true }
        );
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
        setLoading(false);
      }
    };

    if (isOpen && company?._id) {
      fetchData();
    }
  }, [company, isOpen]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter applications based on search term and filter type
  const filteredApplications = applications.filter((app) => {
    // First filter for offered status
    const isOffered =
      app.status === "Offered" ||
      app.status === "Accepted" ||
      app.status === "Declined";
    if (!isOffered) return false;

    // Then apply the selected filter
    if (filter === "accepted" && app.status !== "Accepted") return false;
    if (filter === "pending" && app.status !== "Offered") return false;
    if (filter === "declined" && app.status !== "Declined") return false;

    // Finally filter by search term
    const studentName = app.student?.name?.toLowerCase() || "";
    const regNumber = app.student?.registrationNumber?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    return studentName.includes(searchLower) || regNumber.includes(searchLower);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-lg w-[85%] h-[80vh] max-h-[85vh] overflow-hidden z-50 flex flex-col">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10 shadow-sm">
          <h2 className="text-xl font-bold flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            {company.name} - Offers & Acceptance Status
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search and Filter bar */}
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by student name or registration number..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-2 rounded-md ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Offers
              </button>
              <button
                onClick={() => setFilter("accepted")}
                className={`px-3 py-2 rounded-md ${
                  filter === "accepted"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ThumbsUp className="h-4 w-4 inline mr-1" />
                Accepted
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-2 rounded-md ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="h-4 w-4 inline mr-1" />
                Pending
              </button>
              <button
                onClick={() => setFilter("declined")}
                className={`px-3 py-2 rounded-md ${
                  filter === "declined"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ThumbsDown className="h-4 w-4 inline mr-1" />
                Declined
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-500">Loading offers...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                {filter !== "all"
                  ? `No ${filter} offers found`
                  : "No offers made yet"}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : filter !== "all"
                  ? `No students have ${filter} offers from this company yet.`
                  : "No students have been offered positions by this company yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            {application.student?.name?.charAt(0) || "U"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {application.student?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student?.registrationNumber || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.studentModel || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(
                          application.updatedAt || application.appliedDate
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {application.status === "Accepted" ? (
                          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepted
                          </span>
                        ) : application.status === "Declined" ? (
                          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-4 w-4 mr-1" />
                            Declined
                          </span>
                        ) : (
                          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-4 w-4 mr-1" />
                            Pending Response
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {application.packageOffered || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.responseDate
                          ? formatDate(application.responseDate)
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="max-w-[250px] truncate">
                          {application.feedback || "No feedback available"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Company Card Component with Actions
const CompanyCard = ({ company, onViewDetails, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [applicationsModalOpen, setApplicationsModalOpen] = useState(false);
  const [offersStatusModalOpen, setOffersStatusModalOpen] = useState(false);

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

  // Function to handle opening the applications modal
  const handleOpenApplicationsModal = (e) => {
    e.stopPropagation();
    console.log("Opening applications modal for company:", company.name);
    setApplicationsModalOpen(true);
  };

  // Function to handle closing the applications modal
  const handleCloseApplicationsModal = () => {
    console.log("Closing applications modal for company:", company.name);
    setApplicationsModalOpen(false);
  };

  // Function to handle opening the offers status modal
  const handleOpenOffersStatusModal = (e) => {
    e.stopPropagation();
    console.log("Opening offers status modal for company:", company.name);
    setOffersStatusModalOpen(true);
  };

  // Function to handle closing the offers status modal
  const handleCloseOffersStatusModal = () => {
    console.log("Closing offers status modal for company:", company.name);
    setOffersStatusModalOpen(false);
  };

  // Debug log modal state
  useEffect(() => {
    console.log(
      "Applications modal state for " + company.name + ":",
      applicationsModalOpen
    );
  }, [applicationsModalOpen, company.name]);

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
                  console.log(
                    "Manage Applications clicked from menu for company:",
                    company.name
                  );
                  setApplicationsModalOpen(true);
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-4 w-4" />
                <span>Manage Applications</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOffersStatusModalOpen(true);
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Briefcase className="h-4 w-4" />
                <span>View Offers Status</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openApplicationsInNewTab();
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" />
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleOpenApplicationsModal}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Applications
          </button>
          <button
            onClick={handleOpenOffersStatusModal}
            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Offers Status
          </button>
        </div>
      </div>

      {/* Applications List Modal */}
      <ApplicationsListModal
        company={company}
        isOpen={applicationsModalOpen}
        onClose={handleCloseApplicationsModal}
      />

      {/* Offers Status Modal */}
      <OffersStatusModal
        company={company}
        isOpen={offersStatusModalOpen}
        onClose={handleCloseOffersStatusModal}
      />
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
    updates: "",
    package: "",
    minimumCgpa: "",
    backlogsAllowed: 0,
    department: [],
    batch: [],
  });

  // Calculate the current year and generate years around it
  const currentYear = new Date().getFullYear();

  // Generate batches for 3 years before and 3 years after current year
  const batchOptions = [];
  for (let year = currentYear - 3; year <= currentYear + 3; year++) {
    batchOptions.push({
      value: `${year}-${year + 4}`,
      label: `${year}-${year + 4}`,
    });
  }

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

  const handleBatchChange = (e) => {
    const selectedBatch = e.target.value;
    setFormData({
      ...formData,
      batch: [selectedBatch],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.department.length === 0) {
      alert("Please select at least one department");
      return;
    }
    if (formData.batch.length === 0) {
      alert("Please select a batch");
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligible Batch
              </label>
              <select
                value={formData.batch[0] || ""}
                onChange={handleBatchChange}
                className="w-full p-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a batch</option>
                {batchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
    batch: company.batch || [],
  });

  // Calculate the current year and generate years around it
  const currentYear = new Date().getFullYear();

  // Generate batches for 3 years before and 3 years after current year
  const batchOptions = [];
  for (let year = currentYear - 3; year <= currentYear + 3; year++) {
    batchOptions.push({
      value: `${year}-${year + 4}`,
      label: `${year}-${year + 4}`,
    });
  }

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

  const handleBatchChange = (e) => {
    const selectedBatch = e.target.value;
    setFormData({
      ...formData,
      batch: [selectedBatch],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.department.length === 0) {
      alert("Please select at least one department");
      return;
    }
    if (formData.batch.length === 0) {
      alert("Please select a batch");
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligible Batch
              </label>
              <select
                value={formData.batch[0] || ""}
                onChange={handleBatchChange}
                className="w-full p-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a batch</option>
                {batchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
      console.log("Adding new company:", newCompany);
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
    console.log("Editing company:", company);
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedCompany) => {
    try {
      console.log("Saving company edits:", updatedCompany);
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
    console.log("Opening delete modal for company:", companyToDelete.name);
    setCompanyToDelete(companyToDelete);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("Confirming delete for company:", companyToDelete.name);
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
    console.log("Viewing details for company:", company.name);
    setSelectedCompany(company);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Companies</h1>
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
            <p className="mt-2 text-gray-500">
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
    </AdminLayout>
  );
};

export default ManageCompany;
