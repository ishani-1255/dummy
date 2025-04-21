import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  X,
  Send,
  User,
  Filter,
  Plus,
  Bell,
  FileText,
  Calendar,
  Bookmark as BookmarkIcon,
  Check,
} from "lucide-react";
import axios from "axios";
import { useUser } from "../../pages/UserContext";

// UI Component imports inspired by Learning Resources page
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../admin/UIComponents";
import Sidebar from "./Sidebar";

// Query List component
const QueryList = ({
  queries,
  expandedQuery,
  toggleExpand,
  handleQueryClick,
  formatDate,
  getStatusBadge,
  toggleFavorite,
  activeQueryId,
  setActiveQueryId,
  newReply,
  setNewReply,
  handleSubmitReply,
  setShowNewQueryForm,
  loading,
  handleMarkAsResolved,
  handleDeleteQuery,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12 bg-white">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Clock size={36} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">
          Loading queries...
        </h3>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {queries.length === 0 ? (
        <div className="text-center py-12 bg-white">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={36} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">
            No queries found
          </h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Try adjusting your search or filters, or ask a new question
          </p>
          <Button onClick={() => setShowNewQueryForm(true)} className="mt-6">
            <Plus size={18} className="mr-2" />
            Ask a Question
          </Button>
        </div>
      ) : (
        queries.map((query) => (
          <div
            key={query._id}
            className={`hover:bg-gray-50 ${
              query.status === "resolved" ? "opacity-70" : ""
            }`}
          >
            <div
              onClick={() => toggleExpand(query._id)}
              className="px-6 py-4 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div>
                    {expandedQuery === query._id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 transform -rotate-90" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {query.title}
                      {query.favorite && (
                        <BookmarkIcon
                          className="ml-2 h-4 w-4 text-yellow-500"
                          fill="currentColor"
                        />
                      )}
                      {query.replies &&
                        query.replies.length > 0 &&
                        !query.repliesRead && (
                          <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5">
                            {query.replies.length}
                          </span>
                        )}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {query.category}
                      </Badge>
                      {getStatusBadge(query.status)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(query.createdAt)}
                </div>
              </div>
            </div>

            {expandedQuery === query._id && (
              <div className="px-6 pb-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {query.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQueryClick(query);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(query._id);
                      }}
                    >
                      {query.favorite ? "Remove Favorite" : "Add to Favorites"}
                    </Button>
                    {query.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsResolved(query._id);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as Resolved
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuery(query._id);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Display replies if any */}
                {query.replies && query.replies.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Replies:
                    </h4>
                    {query.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className={`p-4 rounded-lg ${
                          reply.isAdmin
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                              reply.isAdmin
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            <User size={14} />
                          </div>
                          <div>
                            <div className="font-medium">{reply.author}</div>
                            <div className="text-xs text-gray-500">
                              {formatDate(reply.timestamp)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {query.status !== "resolved" && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                      <input
                        type="text"
                        value={activeQueryId === query._id ? newReply : ""}
                        onChange={(e) => {
                          setActiveQueryId(query._id);
                          setNewReply(e.target.value);
                        }}
                        placeholder="Type your reply..."
                        className="flex-grow p-3 border-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        onClick={() => handleSubmitReply(query._id)}
                        disabled={
                          !newReply.trim() || activeQueryId !== query._id
                        }
                        variant={
                          newReply.trim() && activeQueryId === query._id
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-none"
                      >
                        <Send size={16} className="mr-2" />
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const StudentQuerySystem = () => {
  const { user } = useUser();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newQuery, setNewQuery] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);
  const [activeQueryId, setActiveQueryId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteQueryId, setDeleteQueryId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const categories = [
    "General",
    "Interview Preparation",
    "Documents",
    "Interview Process",
    "Job Offers",
    "Technical",
  ];

  // Fetch student queries
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/queries/student", {
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

  // Query statistics
  const stats = {
    totalQueries: queries.length,
    pending: queries.filter((q) => q.status === "pending").length,
    inProgress: queries.filter((q) => q.status === "in-progress").length,
    answered: queries.filter((q) => q.status === "resolved").length,
    totalReplies: queries.reduce(
      (acc, query) => acc + (query.replies ? query.replies.length : 0),
      0
    ),
  };

  const handleInputChange = (e) => {
    setNewQuery({
      ...newQuery,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await axios.post("/api/queries", newQuery, {
        withCredentials: true,
      });

      // Add the new query to the state
      setQueries([response.data, ...queries]);

      setNewQuery({
        title: "",
        description: "",
        category: "General",
      });

      setShowNewQueryForm(false);
      addNotification(
        `Your query about "${newQuery.title}" has been submitted successfully.`
      );
    } catch (err) {
      console.error("Error submitting query:", err);
      addNotification("Failed to submit query. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (queryId) => {
    if (newReply.trim() === "" || isSubmitting || activeQueryId !== queryId)
      return;

    try {
      setIsSubmitting(true);
      console.log("Submitting reply for query:", queryId);
      console.log("Reply content:", newReply);

      const response = await axios.post(
        `/api/queries/${queryId}/reply`,
        {
          message: newReply,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reply response:", response.data);

      if (response.data) {
        // Update queries state with the updated query
        setQueries(
          queries.map((query) =>
            query._id === queryId ? response.data : query
          )
        );

        setNewReply("");
        setActiveQueryId(null);
        addNotification("Reply sent successfully");
      } else {
        console.error("Reply sent but received unexpected response format");
        addNotification(
          "Reply sent but there was an issue updating the display"
        );
      }
    } catch (err) {
      console.error(
        "Error submitting reply:",
        err.response?.data || err.message || err
      );

      let errorMessage = "Failed to submit reply. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      addNotification(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsResolved = async (queryId) => {
    try {
      setIsSubmitting(true);

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

      addNotification("Query marked as resolved");
    } catch (err) {
      console.error("Error marking query as resolved:", err);
      addNotification("Failed to update query status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFavorite = async (queryId) => {
    try {
      const response = await axios.put(
        `/api/queries/${queryId}/favorite`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the query in the state
      setQueries(
        queries.map((query) => (query._id === queryId ? response.data : query))
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
      addNotification("Failed to update favorite status. Please try again.");
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
      addNotification("Query deleted successfully");
    } catch (err) {
      console.error("Error deleting query:", err);
      addNotification("Failed to delete query. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || query.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || query.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort queries (pending first, then in-progress, then by date)
  const sortedQueries = [...filteredQueries].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    if (a.status === "in-progress" && b.status === "resolved") return -1;
    if (a.status === "resolved" && b.status === "in-progress") return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getStatusBadge = (status) => {
    if (status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Awaiting Response</span>
        </Badge>
      );
    } else if (status === "in-progress") {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>In Progress</span>
        </Badge>
      );
    } else if (status === "resolved") {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Resolved</span>
        </Badge>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Toggle expanded query details
  const toggleExpand = (id) => {
    if (expandedQuery === id) {
      setExpandedQuery(null);
    } else {
      setExpandedQuery(id);
    }
  };

  // Handle query click to show details modal
  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setShowQueryDetails(true);
  };

  // Add notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      timestamp: new Date().toISOString(),
    };

    setNotifications([newNotification, ...notifications]);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center py-12 bg-white rounded-lg border border-red-200">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={36} className="text-red-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                Error Loading Queries
              </h3>
              <p className="mt-2 text-gray-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-6">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with Notification */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Ask Queries</h1>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative"
                      >
                        <Bell size={20} />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                onClick={() => setShowNewQueryForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                <Plus size={18} className="mr-2" />
                Ask a Question
              </Button>
            </div>
          </div>

          {/* Notification Panel */}
          {showNotifications && (
            <Card className="mb-6 border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs"
                    >
                      Mark all as read
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto pt-0">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-md ${
                          notification.read ? "bg-gray-50" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <MessageSquare
                            className={`h-5 w-5 mt-0.5 ${
                              notification.read
                                ? "text-gray-400"
                                : "text-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                notification.read
                                  ? "text-gray-600"
                                  : "text-gray-800 font-medium"
                              }`}
                            >
                              {notification.message}
                            </p>
                            {notification.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Queries
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {stats.totalQueries}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Awaiting Response
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      In Progress
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {stats.inProgress}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Resolved
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.answered}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <div className="relative flex-grow mt-4 md:mb-0">
                  <input
                    type="text"
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center mt-4 justify-center px-4 py-3 mb-4 md:mb-0 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  <Filter size={18} className="mr-2" />
                  Filters
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${
                      showFilters ? "transform rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      <option value="all">Choose Status</option>
                      <option value="pending">Awaiting Response</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      <option value="all">Choose Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Query Form Modal */}
          {showNewQueryForm && (
            <Dialog open={showNewQueryForm} onOpenChange={setShowNewQueryForm}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Query</DialogTitle>
                  <DialogDescription>
                    Submit your question or concern to the placement office.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmitQuery}>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Query Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newQuery.title}
                      onChange={handleInputChange}
                      placeholder="Brief title for your query"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newQuery.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newQuery.description}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="Provide details about your query or question..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewQueryForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Query"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* Queries List with Tabs */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <Tabs
                defaultValue="all"
                onValueChange={setFilterStatus}
                className="w-full"
              >
                <div className="border-b">
                  <div className="px-6 pt-6 pb-2">
                    <h2 className="text-lg font-medium text-gray-800">
                      Your Queries
                    </h2>
                  </div>
                  <TabsList className="w-full bg-transparent border-b border-gray-100 pl-6 rounded-none">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      Awaiting Response
                    </TabsTrigger>
                    <TabsTrigger
                      value="in-progress"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger
                      value="resolved"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      Resolved
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0 pt-0">
                  <QueryList
                    queries={sortedQueries}
                    expandedQuery={expandedQuery}
                    toggleExpand={toggleExpand}
                    handleQueryClick={handleQueryClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    toggleFavorite={toggleFavorite}
                    activeQueryId={activeQueryId}
                    setActiveQueryId={setActiveQueryId}
                    newReply={newReply}
                    setNewReply={setNewReply}
                    handleSubmitReply={handleSubmitReply}
                    setShowNewQueryForm={setShowNewQueryForm}
                    loading={loading}
                    handleMarkAsResolved={handleMarkAsResolved}
                    handleDeleteQuery={handleDeleteQuery}
                  />
                </TabsContent>

                <TabsContent value="pending" className="mt-0 pt-0">
                  <QueryList
                    queries={sortedQueries.filter(
                      (q) => q.status === "pending"
                    )}
                    expandedQuery={expandedQuery}
                    toggleExpand={toggleExpand}
                    handleQueryClick={handleQueryClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    toggleFavorite={toggleFavorite}
                    activeQueryId={activeQueryId}
                    setActiveQueryId={setActiveQueryId}
                    newReply={newReply}
                    setNewReply={setNewReply}
                    handleSubmitReply={handleSubmitReply}
                    setShowNewQueryForm={setShowNewQueryForm}
                    loading={loading}
                    handleMarkAsResolved={handleMarkAsResolved}
                    handleDeleteQuery={handleDeleteQuery}
                  />
                </TabsContent>

                <TabsContent value="in-progress" className="mt-0 pt-0">
                  <QueryList
                    queries={sortedQueries.filter(
                      (q) => q.status === "in-progress"
                    )}
                    expandedQuery={expandedQuery}
                    toggleExpand={toggleExpand}
                    handleQueryClick={handleQueryClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    toggleFavorite={toggleFavorite}
                    activeQueryId={activeQueryId}
                    setActiveQueryId={setActiveQueryId}
                    newReply={newReply}
                    setNewReply={setNewReply}
                    handleSubmitReply={handleSubmitReply}
                    setShowNewQueryForm={setShowNewQueryForm}
                    loading={loading}
                    handleMarkAsResolved={handleMarkAsResolved}
                    handleDeleteQuery={handleDeleteQuery}
                  />
                </TabsContent>

                <TabsContent value="resolved" className="mt-0 pt-0">
                  <QueryList
                    queries={sortedQueries.filter(
                      (q) => q.status === "resolved"
                    )}
                    expandedQuery={expandedQuery}
                    toggleExpand={toggleExpand}
                    handleQueryClick={handleQueryClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    toggleFavorite={toggleFavorite}
                    activeQueryId={activeQueryId}
                    setActiveQueryId={setActiveQueryId}
                    newReply={newReply}
                    setNewReply={setNewReply}
                    handleSubmitReply={handleSubmitReply}
                    setShowNewQueryForm={setShowNewQueryForm}
                    loading={loading}
                    handleMarkAsResolved={handleMarkAsResolved}
                    handleDeleteQuery={handleDeleteQuery}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Query</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this query? This action cannot be
              undone.
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

      {/* Query Details Modal */}
      <Dialog open={showQueryDetails} onOpenChange={setShowQueryDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedQuery?.title}</DialogTitle>
            <DialogDescription>
              Category: {selectedQuery?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Submitted on:{" "}
                  {selectedQuery && formatDate(selectedQuery.createdAt)}
                </span>
              </div>
              <div>{selectedQuery && getStatusBadge(selectedQuery.status)}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-medium mb-2">Details</h4>
              <p className="text-gray-700">{selectedQuery?.description}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">
                Replies ({selectedQuery?.replies?.length || 0})
              </h4>
              {selectedQuery?.replies && selectedQuery.replies.length > 0 ? (
                selectedQuery.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className={`p-4 rounded-lg ${
                      reply.isAdmin
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          reply.isAdmin
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <User size={14} />
                      </div>
                      <div>
                        <div className="font-medium">{reply.author}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(reply.timestamp)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {reply.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No replies yet.</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowQueryDetails(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowQueryDetails(false);
                handleDeleteQuery(selectedQuery?._id);
              }}
              disabled={isDeleting}
            >
              <X className="h-4 w-4 mr-2" />
              Delete Query
            </Button>
            {selectedQuery?.status !== "resolved" && (
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => {
                  handleMarkAsResolved(selectedQuery?._id);
                  setShowQueryDetails(false);
                }}
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
            )}
            {selectedQuery?.status !== "resolved" && (
              <Button
                onClick={() => {
                  setShowQueryDetails(false);
                  setExpandedQuery(selectedQuery?._id);
                  setActiveQueryId(selectedQuery?._id);
                }}
              >
                Reply
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentQuerySystem;
