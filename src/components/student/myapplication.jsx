import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Users,
  Printer,
  FileText,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle,
  X,
  BookOpen,
  Briefcase,
  Server,
  Search,
  Database,
  Ruler,
  Network,
  AlertCircle,
  FlaskConical,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Star,
  Filter,
  Clock,
  Download,
  ExternalLink,
  ChevronDown,
  Menu,
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
} from "../admin/UIComponents";
import axios from "axios";
import Sidebar from "./Sidebar";

// Application Status Badge Component
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
    "Under Review": <BookOpen className="h-4 w-4 mr-1" />,
    "Interview Scheduled": <Calendar className="h-4 w-4 mr-1" />,
    Interviewed: <CheckCircle className="h-4 w-4 mr-1" />,
    Offered: <Award className="h-4 w-4 mr-1" />,
    Rejected: <X className="h-4 w-4 mr-1" />,
    Accepted: <Star className="h-4 w-4 mr-1" />,
    Declined: <AlertCircle className="h-4 w-4 mr-1" />,
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

// Initial application data (same as original)
const initialApplications = [
 
  // ... other initial applications
];

// Application Detail Modal Component with improved responsiveness
const ApplicationDetailModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold truncate">{application.jobTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Company Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md sm:text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium truncate">{application.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{application.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{application.salary}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md sm:text-lg">Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <StatusBadge status={application.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applied on:</span>
                  <span>
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </span>
                </div>
                {application.interviewDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Interview date:</span>
                    <span>
                      {new Date(application.interviewDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {application.status === "Accepted" &&
                  application.packageOffered && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600">Package Offered:</span>
                      <span className="font-medium text-green-600">
                        {application.packageOffered}
                      </span>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Description */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-md sm:text-lg">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-sm sm:text-base">{application.jobDescription}</p>
          </CardContent>
        </Card>

        {/* Required Skills */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-md sm:text-lg">Required Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {application.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs sm:text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Notes & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md sm:text-lg">Application Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm sm:text-base">{application.applicationNotes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md sm:text-lg">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm sm:text-base">
                {application.feedback || "No feedback received yet."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end mt-6 space-y-3 sm:space-y-0 sm:space-x-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 w-full sm:w-auto">
            <div className="flex items-center justify-center space-x-2">
              <Printer className="h-4 w-4" />
              <span>Print Details</span>
            </div>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto">
            <div className="flex items-center justify-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Update Status</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal with improved responsiveness
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  application,
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-center mb-2">
          Delete Application
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete your application for{" "}
          <span className="font-medium">{application.jobTitle}</span> at{" "}
          <span className="font-medium">{application.company}</span>? This
          action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(application.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Application Card for mobile view
const ApplicationCard = ({ application, onViewDetails, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{application.jobTitle}</h3>
            <p className="text-sm text-gray-600">{application.company}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
        
        <div className="text-sm space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{application.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Applied: {new Date(application.applicationDate).toLocaleDateString()}</span>
          </div>
          {application.status === "Accepted" && application.packageOffered && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-medium text-green-600">{application.packageOffered}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => onViewDetails(application)}
            className="px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg text-sm hover:bg-blue-100"
          >
            <div className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span>Details</span>
            </div>
          </button>
          <button
            onClick={() => onDelete(application)}
            className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg text-sm hover:bg-red-100"
          >
            <div className="flex items-center space-x-1">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component with improved responsiveness
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "applicationDate",
    direction: "desc",
  });
  const [selectedView, setSelectedView] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch student applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        // Use mock data for now instead of API call
        // In a real app, you would use your API call
        setTimeout(() => {
          setApplications(initialApplications);
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your applications. Please try again later.");
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: applications.length,
      interviews: applications.filter(
        (app) =>
          app.status === "Interview Scheduled" || app.status === "Interviewed"
      ).length,
      offers: applications.filter(
        (app) => app.status === "Offered" || app.status === "Accepted"
      ).length,
      pending: applications.filter(
        (app) => app.status === "Applied" || app.status === "Under Review"
      ).length,
    };
  }, [applications]);

  // Filtering and sorting applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Apply view filter
    if (selectedView === "active") {
      filtered = filtered.filter(
        (app) => !["Rejected", "Declined"].includes(app.status)
      );
    } else if (selectedView === "interviews") {
      filtered = filtered.filter((app) =>
        ["Interview Scheduled", "Interviewed"].includes(app.status)
      );
    } else if (selectedView === "offers") {
      filtered = filtered.filter((app) =>
        ["Offered", "Accepted"].includes(app.status)
      );
    }

    // Sort applications
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [applications, searchTerm, statusFilter, selectedView, sortConfig]);

  // Handler for sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle delete application
  const handleDeleteApplication = async (id) => {
    try {
      // In a real app, you would make an API call
      // await axios.delete(`http://localhost:6400/api/applications/${id}`, {
      //   withCredentials: true,
      // });

      setApplications(applications.filter((app) => app.id !== id));
      setIsDeleteModalOpen(false);
      setSelectedApplication(null);
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application. Please try again.");
    }
  };

  // Handle view application details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  // Handle prepare for delete
  const handlePrepareDelete = (application) => {
    setSelectedApplication(application);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 max-w-md w-full">
            <h3 className="font-bold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error
            </h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for larger screens */}
      
        <Sidebar />
      

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-white p-4 flex items-center justify-between border-b">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">My Applications</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 hidden md:block">
                My Applications
              </h1>
              {/*
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Application</span>
                </div>
              </button>
              */}
            </div>

            {/* Stats Overview - responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <Card>
                <CardContent className="pt-3 pb-3 px-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">
                        Total
                      </p>
                      <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-3 pb-3 px-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">
                        Pending
                      </p>
                      <p className="text-lg sm:text-2xl font-bold">{stats.pending}</p>
                    </div>
                    <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-3 pb-3 px-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">
                        Interviews
                      </p>
                      <p className="text-lg sm:text-2xl font-bold">{stats.interviews}</p>
                    </div>
                    <Calendar className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-3 pb-3 px-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">
                        Offers
                      </p>
                      <p className="text-lg sm:text-2xl font-bold">{stats.offers}</p>
                    </div>
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search - stacked on mobile */}
            <div className="mb-6 flex flex-col space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <select
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
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

                <div className="grid grid-cols-2 sm:flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setSelectedView("all")}
                    className={`px-3 py-2 text-sm text-center ${
                      selectedView === "all"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedView("active")}
                    className={`px-3 py-2 text-sm text-center ${
                      selectedView === "active"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setSelectedView("interviews")}
                    className={`px-3 py-2 text-sm text-center ${
                      selectedView === "interviews"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    Interviews
                  </button>
                  <button
                    onClick={() => setSelectedView("offers")}
                    className={`px-3 py-2 text-sm text-center ${
                      selectedView === "offers"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    Offers
                  </button>
                </div>
              </div>
            </div>

            {/* Applications display - Cards for mobile, Table for desktop */}

            {isMobile ? (
              <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onViewDetails={handleViewDetails}
                      onDelete={handlePrepareDelete}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="mb-2">No applications found</p>
                    {searchTerm || statusFilter || selectedView !== "all" ? (
                      <p className="text-sm text-gray-500">
                        Try adjusting your filters
                      </p>
                    ) : (
                      <button className="hidden max-md:hidden mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full">
                        <div className="flex items-center justify-center space-x-2">
                          <Plus className="h-4 w-4" />
                          <span>Add Your First Application</span>
                        </div>
                      </button> 
                    )}
                    </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort("jobTitle")}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Company Name</span>
                              {sortConfig.key === "jobTitle" && (
                                <ChevronDown
                                  className={`h-4 w-4 ${
                                    sortConfig.direction === "desc"
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort("company")}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Industry</span>
                              {sortConfig.key === "company" && (
                                <ChevronDown
                                  className={`h-4 w-4 ${
                                    sortConfig.direction === "desc"
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort("applicationDate")}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Applied On</span>
                              {sortConfig.key === "applicationDate" && (
                                <ChevronDown
                                  className={`h-4 w-4 ${
                                    sortConfig.direction === "desc"
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort("status")}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Status</span>
                              {sortConfig.key === "status" && (
                                <ChevronDown
                                  className={`h-4 w-4 ${
                                    sortConfig.direction === "desc"
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Package Offered</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.length > 0 ? (
                          filteredApplications.map((application) => (
                            <TableRow
                              key={application.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {application.jobTitle}
                              </TableCell>
                              <TableCell>{application.company}</TableCell>
                              <TableCell>
                                {new Date(
                                  application.applicationDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={application.status} />
                              </TableCell>
                              <TableCell>
                                {application.status === "Accepted" &&
                                application.packageOffered ? (
                                  <span className="text-green-600 font-medium">
                                    {application.packageOffered}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewDetails(application)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handlePrepareDelete(application)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete Application"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
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
                                <FileText className="h-10 w-10 mb-2 text-gray-400" />
                                <p>No applications found</p>
                                {searchTerm ||
                                statusFilter ||
                                selectedView !== "all" ? (
                                  <p className="text-sm mt-1">
                                    Try adjusting your filters
                                  </p>
                                ) : (
                                  <button className=" hidden max-md:hidden mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <div className="flex items-center space-x-2">
                                      <Plus className="h-4 w-4" />
                                      <span>Add Your First Application</span>
                                    </div>
                                  </button>
                                  
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
            )}
          </div>
        </div>
      </div>

      {/* Fixed Add Button for Mobile */}
      {isMobile && filteredApplications.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
            aria-label="Add Application"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Modals */}
      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleDeleteApplication}
        application={selectedApplication}
      />
    </div>
  );
};

export default MyApplications;