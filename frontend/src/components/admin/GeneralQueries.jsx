import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  Bell,
  MessageSquare,
  Clock,
  Filter,
  Check,
  X,
  ChevronDown,
  Tag,
} from "lucide-react";
import axios from "axios";
import { useUser } from "../../pages/UserContext";
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
  Alert,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Button,
  Textarea,
} from "./UIComponents";
import Sidebar from "./Sidebar";

const QueryManagement = () => {
  const { user } = useUser();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteQueryId, setDeleteQueryId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Fetch all queries
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/queries", {
          withCredentials: true,
        });
        setQueries(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching queries:", err);
        setError("Failed to load queries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  // Calculate batch years based on admission year
  const calculateBatch = (admissionYear) => {
    if (!admissionYear) return "";
    const gradYear = parseInt(admissionYear) + 4;
    return `${admissionYear}-${gradYear}`;
  };

  // Filtering logic
  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLabel =
      filterLabel === "all" || !filterLabel || query.category === filterLabel;
    const matchesPriority =
      filterPriority === "all" ||
      !filterPriority ||
      query.priority === filterPriority;
    const matchesStatus =
      filterStatus === "all" || !filterStatus || query.status === filterStatus;

    return matchesSearch && matchesLabel && matchesPriority && matchesStatus;
  });

  // Priority badge color mapping
  const priorityColors = {
    urgent: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    normal: "bg-blue-100 text-blue-800",
    low: "bg-gray-100 text-gray-800",
  };

  // Label badge color mapping
  const labelColors = {
    "Interview Preparation": "bg-purple-100 text-purple-800",
    "Interview Process": "bg-purple-100 text-purple-800",
    Documents: "bg-green-100 text-green-800",
    General: "bg-blue-100 text-blue-800",
    "Job Offers": "bg-orange-100 text-orange-800",
    Technical: "bg-indigo-100 text-indigo-800",
  };

  // Status badge color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  const handleResponse = async () => {
    if (!responseText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `/api/queries/${selectedQuery._id}/reply`,
        {
          message: responseText,
        },
        {
          withCredentials: true,
        }
      );

      // Update the query in the state
      setQueries(
        queries.map((query) =>
          query._id === selectedQuery._id ? response.data : query
        )
      );

      showNotification(`Response sent to ${selectedQuery.studentName}`);
      setResponseText("");
      setIsResponseModalOpen(false);
    } catch (err) {
      console.error("Error sending response:", err);
      showNotification("Failed to send response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsResolved = async (queryId) => {
    try {
      const response = await axios.put(
        `/api/queries/${queryId}/status`,
        {
          status: "resolved",
        },
        {
          withCredentials: true,
        }
      );

      // Update the query in the state
      setQueries(
        queries.map((query) => (query._id === queryId ? response.data : query))
      );

      showNotification("Query marked as resolved");
    } catch (err) {
      console.error("Error marking query as resolved:", err);
      showNotification("Failed to update query status. Please try again.");
    }
  };

  const handleDeleteQuery = (queryId) => {
    setDeleteQueryId(queryId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteQuery = async () => {
    if (isDeleting || !deleteQueryId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/queries/${deleteQueryId}`, {
        withCredentials: true,
      });

      // Remove the deleted query from state
      setQueries(queries.filter((query) => query._id !== deleteQueryId));

      setShowDeleteConfirmation(false);
      setDeleteQueryId(null);
      showNotification("Query deleted successfully");
    } catch (err) {
      console.error("Error deleting query:", err);
      showNotification("Failed to delete query. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const showNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
    };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Check if a query has new messages
  const hasNewMessages = (query) => {
    // Logic to determine if there are unread messages
    // This is a placeholder - would need to be implemented with actual unread message tracking
    return query.replies && query.replies.length > 0 && !query.repliesRead;
  };

  // Count new messages
  const countNewMessages = (query) => {
    // This is a placeholder - would need to be implemented with actual unread message tracking
    return query.replies ? query.replies.length : 0;
  };

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="min-h-screen w-full bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center py-12 bg-white rounded-lg border border-red-200">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Queries
              </h3>
              <p className="text-gray-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen w-full bg-gray-50">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <Alert key={notification.id} className="bg-white shadow-lg w-72">
              <Bell className="h-4 w-4" />
              <div className="ml-2">{notification.message}</div>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notification.id)
                  )
                }
                className="absolute right-2 top-2"
              >
                <X className="h-4 w-4" />
              </button>
            </Alert>
          ))}
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Student Query Management
            </h1>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Queries
                    </p>
                    <p className="text-2xl font-bold">{queries.length}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">
                      {queries.filter((q) => q.status === "pending").length}
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
                      In Progress
                    </p>
                    <p className="text-2xl font-bold">
                      {queries.filter((q) => q.status === "in-progress").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Resolved
                    </p>
                    <p className="text-2xl font-bold">
                      {queries.filter((q) => q.status === "resolved").length}
                    </p>
                  </div>
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student ID, name, or query..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              {/* Label Filter */}
              <Select value={filterLabel} onValueChange={setFilterLabel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Interview Preparation">
                    Interview Preparation
                  </SelectItem>
                  <SelectItem value="Documents">Documents</SelectItem>
                  <SelectItem value="Interview Process">
                    Interview Process
                  </SelectItem>
                  <SelectItem value="Job Offers">Job Offers</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Queries Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-16">
                  <Clock className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-pulse" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Loading queries...
                  </h3>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Details</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead>Category/Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                            <Search className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">
                            No queries found
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQueries.map((query) => (
                        <TableRow
                          key={query._id}
                          className={
                            query.status === "resolved" ? "opacity-70" : ""
                          }
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {query.studentName} (
                                {query.branch || query.department || "CSE"},{" "}
                                {query.regNo ||
                                  query.registrationNumber ||
                                  "CS2022"}
                                ,{" "}
                                {calculateBatch(query.admissionYear || "2022")})
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <p className="font-medium">{query.title}</p>
                              {hasNewMessages(query) && (
                                <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5">
                                  {countNewMessages(query)}
                                </span>
                              )}
                            </div>
                            <p className="max-w-md truncate text-sm text-gray-600">
                              {query.description}
                            </p>
                            {query.replies && query.replies.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                {query.replies.length} response(s)
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  labelColors[query.category] ||
                                  "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {query.category}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  priorityColors[query.priority]
                                }`}
                              >
                                {query.priority}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[query.status]
                              }`}
                            >
                              {query.status === "pending" && "Pending"}
                              {query.status === "in-progress" && "In Progress"}
                              {query.status === "resolved" && "Resolved"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-500">
                              {formatDate(
                                query.replies && query.replies.length > 0
                                  ? query.replies[query.replies.length - 1]
                                      .timestamp
                                  : query.createdAt
                              )}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedQuery(query);
                                  setIsResponseModalOpen(true);
                                }}
                                className={`p-2 text-blue-600 hover:bg-blue-50 rounded ${
                                  query.status === "resolved"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title="Reply to query"
                                disabled={query.status === "resolved"}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              {query.status !== "resolved" && (
                                <button
                                  onClick={() =>
                                    handleMarkAsResolved(query._id)
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                  title="Mark as resolved"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteQuery(query._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Delete query"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={showDeleteConfirmation}
            onOpenChange={setShowDeleteConfirmation}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Query</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this query? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteQuery}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Response Modal */}
          <Dialog
            open={isResponseModalOpen}
            onOpenChange={setIsResponseModalOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Respond to Query</DialogTitle>
                <DialogDescription>
                  <div className="mt-4">
                    <p className="font-medium">
                      {selectedQuery?.studentName} (
                      {selectedQuery?.branch ||
                        selectedQuery?.department ||
                        "CSE"}
                      ,{" "}
                      {selectedQuery?.regNo ||
                        selectedQuery?.registrationNumber ||
                        "CS2022"}
                      , {calculateBatch(selectedQuery?.admissionYear || "2022")}
                      )
                    </p>
                    <div className="mt-2">
                      <p className="font-medium">{selectedQuery?.title}</p>
                      <p className="text-gray-700 bg-gray-50 p-3 mt-1 rounded-lg">
                        {selectedQuery?.description}
                      </p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              {/* Previous Responses */}
              {selectedQuery?.replies && selectedQuery.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Previous Responses
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-3">
                    {selectedQuery.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <p className="text-sm text-gray-700">{reply.message}</p>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatDate(reply.timestamp)}</span>
                          <span
                            className={
                              reply.isAdmin ? "font-medium text-blue-600" : ""
                            }
                          >
                            {reply.author}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  className="min-h-[100px]"
                  disabled={selectedQuery?.status === "resolved"}
                />
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsResponseModalOpen(false);
                    setResponseText("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsResponseModalOpen(false);
                    handleDeleteQuery(selectedQuery?._id);
                  }}
                  disabled={isSubmitting}
                >
                  Delete Query
                </Button>
                {selectedQuery?.status !== "resolved" && (
                  <Button
                    onClick={() => handleMarkAsResolved(selectedQuery?._id)}
                    disabled={isSubmitting || !selectedQuery}
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button
                  onClick={handleResponse}
                  disabled={
                    !responseText.trim() ||
                    isSubmitting ||
                    selectedQuery?.status === "resolved"
                  }
                >
                  {isSubmitting ? "Sending..." : "Send Response"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default QueryManagement;
