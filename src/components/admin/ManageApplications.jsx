import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Users,
  FileText,
  CheckCircle,
  X,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  UserCheck,
  DollarSign,
  MessageSquare,
  Calendar,
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
  Label,
  Select,
  Button,
  Badge,
} from "./UIComponents";
import AdminSidebar from "./AdminSidebar";

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

      // Only include package if status is Accepted
      if (status === "Accepted") {
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
            <Label htmlFor="studentName">Student</Label>
            <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
              {application.student?.name || "Unknown Student"}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="companyName">Company</Label>
            <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
              {application.company?.name || "Unknown Company"}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full"
              required
            >
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </Select>
          </div>

          {status === "Accepted" && (
            <div className="mb-4">
              <Label htmlFor="packageOffered">Package Offered</Label>
              <Input
                id="packageOffered"
                type="text"
                placeholder="e.g., ₹10 LPA"
                value={packageOffered}
                onChange={(e) => setPackageOffered(e.target.value)}
                className="w-full"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <textarea
              id="feedback"
              placeholder="Provide feedback to the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Applications Management Component
const ManageApplications = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6400/api/companies",
          {
            withCredentials: true,
          }
        );
        setCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again later.");
      }
    };

    fetchCompanies();
  }, []);

  // Fetch applications when a company is selected
  useEffect(() => {
    if (!selectedCompany) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:6400/api/admin/applications/company/${selectedCompany._id}`,
          { withCredentials: true }
        );

        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [selectedCompany]);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const nameMatch = app.student?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = !statusFilter || app.status === statusFilter;
    return nameMatch && statusMatch;
  });

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setSearchTerm("");
    setStatusFilter("");
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

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Manage Student Applications</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Companies Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Companies</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg"
                    onChange={(e) => {
                      // Local search implementation for companies list
                      // Actual implementation would depend on your UI component library
                    }}
                  />
                </div>

                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <div className="divide-y">
                    {companies.map((company) => (
                      <div
                        key={company._id}
                        onClick={() => handleCompanySelect(company)}
                        className={`p-3 cursor-pointer hover:bg-gray-100 transition ${
                          selectedCompany?._id === company._id
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-gray-500">
                          {company.industry}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(company.visitingDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}

                    {companies.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No companies found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications Content */}
          <div className="md:col-span-3 space-y-4">
            {selectedCompany ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">
                        {selectedCompany.name} - Applications
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by student name..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <select
                        className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Interview Scheduled">
                          Interview Scheduled
                        </option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Offered">Offered</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>

                    {loading ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                        {error}
                      </div>
                    ) : (
                      <>
                        <div className="shadow rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>
                                  {statusFilter === "Accepted"
                                    ? "Package Offered"
                                    : "Action"}
                                </TableHead>
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
                                    <TableCell>
                                      {application.studentModel}
                                    </TableCell>
                                    <TableCell>
                                      {new Date(
                                        application.appliedDate
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <StatusBadge
                                        status={application.status}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {application.status === "Accepted" ? (
                                        <span className="font-medium text-green-600">
                                          {application.packageOffered || "—"}
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleOpenModal(application)
                                          }
                                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                          Update Status
                                        </button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-gray-500"
                                  >
                                    <div className="flex flex-col items-center justify-center">
                                      <FileText className="h-10 w-10 mb-2 text-gray-400" />
                                      <p>No applications found</p>
                                      {(searchTerm || statusFilter) && (
                                        <p className="text-sm mt-1">
                                          Try adjusting your filters
                                        </p>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">
                            {filteredApplications.length}
                          </span>{" "}
                          applications found
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Application Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-blue-800 font-medium">Total</div>
                        <div className="text-2xl font-bold">
                          {applications.length}
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-yellow-800 font-medium">
                          In Progress
                        </div>
                        <div className="text-2xl font-bold">
                          {
                            applications.filter(
                              (app) =>
                                app.status === "Applied" ||
                                app.status === "Under Review" ||
                                app.status === "Interview Scheduled" ||
                                app.status === "Interviewed" ||
                                app.status === "Offered"
                            ).length
                          }
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-green-800 font-medium">
                          Accepted
                        </div>
                        <div className="text-2xl font-bold">
                          {
                            applications.filter(
                              (app) => app.status === "Accepted"
                            ).length
                          }
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-red-800 font-medium">Rejected</div>
                        <div className="text-2xl font-bold">
                          {
                            applications.filter(
                              (app) =>
                                app.status === "Rejected" ||
                                app.status === "Declined"
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] bg-white p-6 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Company Selected
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Please select a company from the list to view and manage
                    student applications for that company.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Update Modal */}
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
    </div>
  );
};

export default ManageApplications;
