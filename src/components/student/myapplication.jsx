import React, { useState, useMemo, useRef, useEffect } from "react";
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

// Initial application data
const initialApplications = [
  {
    id: 1,
    jobTitle: "Software Developer Intern",
    company: "Tech Solutions Inc",
    location: "San Francisco, CA",
    salary: "$5000/month",
    applicationDate: "2024-02-10",
    interviewDate: "2024-02-25",
    status: "Offered",
    jobDescription: "Developing web applications using React and Node.js",
    requiredSkills: ["JavaScript", "React", "Node.js", "Git"],
    applicationNotes: "Completed technical assessment with 95% score",
    feedback: "Strong problem-solving skills demonstrated during interview",
  },
  {
    id: 2,
    jobTitle: "Data Analyst",
    company: "Analytics Corp",
    location: "Boston, MA",
    salary: "$4500/month",
    applicationDate: "2024-02-15",
    interviewDate: "2024-03-01",
    status: "Interview Scheduled",
    jobDescription:
      "Analyze large datasets and create visualization dashboards",
    requiredSkills: ["SQL", "Python", "Tableau", "Statistics"],
    applicationNotes: "Submitted portfolio of previous data projects",
    feedback: "",
  },
  {
    id: 3,
    jobTitle: "UX/UI Designer",
    company: "Creative Designs Ltd",
    location: "New York, NY",
    salary: "$4800/month",
    applicationDate: "2024-01-28",
    interviewDate: "2024-02-15",
    status: "Rejected",
    jobDescription: "Design user interfaces for mobile and web applications",
    requiredSkills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    applicationNotes: "Submitted design portfolio and case studies",
    feedback: "Need more experience with enterprise applications",
  },
  {
    id: 4,
    jobTitle: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Seattle, WA",
    salary: "$6000/month",
    applicationDate: "2024-02-20",
    interviewDate: null,
    status: "Applied",
    jobDescription: "Develop and deploy machine learning models for production",
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "Docker"],
    applicationNotes: "Highlighted ML projects from GitHub in cover letter",
    feedback: "",
  },
  {
    id: 5,
    jobTitle: "Backend Developer",
    company: "Cloud Systems Inc",
    location: "Austin, TX",
    salary: "$5500/month",
    applicationDate: "2024-02-05",
    interviewDate: "2024-02-18",
    status: "Interviewed",
    jobDescription: "Design and implement scalable backend services",
    requiredSkills: ["Java", "Spring Boot", "AWS", "Microservices"],
    applicationNotes:
      "Technical interview scheduled after initial phone screening",
    feedback: "Good technical knowledge but could improve system design skills",
  },
  {
    id: 6,
    jobTitle: "DevOps Engineer",
    company: "Deployment Solutions",
    location: "Denver, CO",
    salary: "$5800/month",
    applicationDate: "2024-01-15",
    interviewDate: "2024-02-10",
    status: "Accepted",
    jobDescription: "Manage CI/CD pipelines and cloud infrastructure",
    requiredSkills: ["Kubernetes", "Docker", "Jenkins", "Terraform"],
    applicationNotes: "Highlighted previous DevOps experience in resume",
    feedback:
      "Strong understanding of containerization and infrastructure as code",
  },
  {
    id: 7,
    jobTitle: "Mobile App Developer",
    company: "App Creators LLC",
    location: "Chicago, IL",
    salary: "$5200/month",
    applicationDate: "2024-02-12",
    interviewDate: null,
    status: "Under Review",
    jobDescription: "Develop native iOS applications using Swift",
    requiredSkills: ["Swift", "iOS SDK", "CoreData", "UI/UX Design"],
    applicationNotes: "Submitted portfolio of published apps on App Store",
    feedback: "",
  },
];

// Application Detail Modal Component
const ApplicationDetailModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">{application.jobTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Company Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{application.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{application.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{application.salary}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Application Status</CardTitle>
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
                {(application.status === "Accepted" ||
                  application.status === "Offered") &&
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
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{application.jobDescription}</p>
          </CardContent>
        </Card>

        {/* Required Skills */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Required Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {application.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Notes & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Application Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{application.applicationNotes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {application.feedback || "No feedback received yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "appliedDate",
    direction: "desc",
  });
  const [selectedView, setSelectedView] = useState("all");

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:6400/api/applications",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          // Transform API data to match our component structure
          const transformedApplications = response.data.map((app) => ({
            id: app._id,
            jobTitle: app.company.name,
            company: app.company.industry,
            location: app.company.location,
            salary: app.company.package,
            applicationDate: new Date(app.appliedDate)
              .toISOString()
              .split("T")[0],
            interviewDate: app.interviewDate
              ? new Date(app.interviewDate).toISOString().split("T")[0]
              : null,
            status: app.status,
            jobDescription: app.company.description,
            requiredSkills: app.company.requirements
              ? app.company.requirements.split("\n")
              : [],
            applicationNotes: app.additionalInfo || "",
            feedback: app.feedback || "",
            updates: app.company.updates || "",
            packageOffered: app.packageOffered || "",
          }));

          setApplications(transformedApplications);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your applications. Please try again later.");
      } finally {
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

  // Handle view application details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
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
      <div className="flex">
        <Sidebar />
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 max-w-md">
            <h3 className="font-bold flex items-center">
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
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              My Applications
            </h1>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Applications
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
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
                      Pending Applications
                    </p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
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
                      Interviews
                    </p>
                    <p className="text-2xl font-bold">{stats.interviews}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Offers Received
                    </p>
                    <p className="text-2xl font-bold">{stats.offers}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
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

              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setSelectedView("all")}
                  className={`px-4 py-2 ${
                    selectedView === "all"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedView("active")}
                  className={`px-4 py-2 ${
                    selectedView === "active"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedView("interviews")}
                  className={`px-4 py-2 ${
                    selectedView === "interviews"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  Interviews
                </button>
                <button
                  onClick={() => setSelectedView("offers")}
                  className={`px-4 py-2 ${
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

          {/* Applications Table */}
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
                            {(application.status === "Accepted" ||
                              application.status === "Offered") &&
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
                              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
        </div>
      </div>

      {/* Modals */}
      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />
    </div>
  );
};

export default MyApplications;
