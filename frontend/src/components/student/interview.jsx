import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  FileText,
  Award,
  Bell,
  X,
  Info,
} from "lucide-react";
import Sidebar from "./Sidebar";
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
  Alert,
  AlertDescription,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../admin/UIComponents";
import axios from "axios";

const InterviewScheduler = () => {
  // State for interviews
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'completed'
  const [showInterviewDetailModal, setShowInterviewDetailModal] =
    useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get scheduled interviews from applications
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        // Fetch applications from API
        const response = await axios.get(
          "http://localhost:6400/api/applications",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          // Filter and transform applications with "Interview Scheduled" status
          const scheduledInterviews = response.data
            .filter((app) => app.status === "Interview Scheduled")
            .map((app) => {
              // Get interview date from the interviewDateTime field if available, or fallback to interviewDate
              const interviewDate = app.interviewDateTime
                ? new Date(app.interviewDateTime)
                : app.interviewDate
                ? new Date(app.interviewDate)
                : new Date();

              const company =
                app.company && typeof app.company === "object"
                  ? app.company
                  : null;

              return {
                id: app._id,
                companyName: company ? company.name : "Unknown Company",
                position: company
                  ? company.role || "Position Not Specified"
                  : "Position Not Specified",
                date: interviewDate.toISOString().split("T")[0],
                time: interviewDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                location:
                  app.interviewLocation ||
                  (company
                    ? company.location || "Location Not Specified"
                    : "Location Not Specified"),
                round: "Interview",
                status: interviewDate > new Date() ? "upcoming" : "completed",
                documents: ["Resume"],
                confirmed: true,
                notes:
                  app.interviewNotes ||
                  app.feedback ||
                  "No specific instructions provided.",
                originalApplication: app,
                // Add a flag to indicate if this is an official scheduled interview
                isOfficialSchedule: !!app.interviewDateTime,
              };
            });

          setInterviews(scheduledInterviews);
        }
      } catch (err) {
        console.error("Error fetching interviews:", err);
        // If API fails, keep the sample data (optional)
        const sampleInterviews = [
          // Sample interviews can remain as fallback
          {
            id: 1,
            companyName: "Tech Innovators Inc.",
            position: "Software Developer Intern",
            date: "2025-03-18",
            time: "10:00 AM - 11:30 AM",
            location: "Online (Zoom)",
            round: "Technical Interview",
            status: "upcoming",
            documents: ["Resume", "Portfolio"],
            confirmed: true,
            notes:
              "Prepare coding examples in React and Python. Review system design concepts.",
            isOfficialSchedule: false,
          },
          // ... other sample interviews
        ];
        setInterviews(sampleInterviews);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Interview statistics
  const stats = {
    total: interviews.length,
    upcoming: interviews.filter((i) => i.status === "upcoming").length,
    completed: interviews.filter((i) => i.status === "completed").length,
  };

  const filteredInterviews = interviews.filter((interview) => {
    if (filter === "all") return true;
    return interview.status === filter;
  });

  // Sort interviews by date (upcoming first)
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (a.status === "upcoming" && b.status !== "upcoming") return -1;
    if (a.status !== "upcoming" && b.status === "upcoming") return 1;
    return new Date(a.date) - new Date(b.date);
  });

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusBadge = (status, confirmed) => {
    if (status === "upcoming") {
      return confirmed ? (
        <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
          <Check className="w-3 h-3" />
          <span>Confirmed</span>
        </Badge>
      ) : (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Confirmation Needed</span>
        </Badge>
      );
    } else if (status === "completed") {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
          <Check className="w-3 h-3" />
          <span>Completed</span>
        </Badge>
      );
    }
    return null;
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const interviewDate = new Date(dateString);
    interviewDate.setHours(0, 0, 0, 0);

    const diffTime = interviewDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 0) return `In ${diffDays} days`;
    return "Past";
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const handleInterviewClick = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewDetailModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="pt-16 pl-64 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Schedule
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and prepare for your upcoming interviews
              </p>
            </div>
            <div className="flex items-center mt-4 sm:mt-0">
              {stats.upcoming > 0 && (
                <div className="bg-yellow-50 text-yellow-800 p-2 rounded flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>
                    You have {stats.upcoming} upcoming interview
                    {stats.upcoming > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-blue-800 font-semibold">Total</h3>
                      <span className="text-2xl font-bold text-blue-800">
                        {stats.total}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-green-800 font-semibold">Upcoming</h3>
                      <span className="text-2xl font-bold text-green-800">
                        {stats.upcoming}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-purple-800 font-semibold">
                        Completed
                      </h3>
                      <span className="text-2xl font-bold text-purple-800">
                        {stats.completed}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle>Your Interviews</CardTitle>
                <div className="flex overflow-auto space-x-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="whitespace-nowrap"
                  >
                    All ({interviews.length})
                  </Button>
                  <Button
                    variant={filter === "upcoming" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("upcoming")}
                    className="whitespace-nowrap"
                  >
                    Upcoming ({stats.upcoming})
                  </Button>
                  <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                    className="whitespace-nowrap"
                  >
                    Completed ({stats.completed})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <InterviewList
                  interviews={sortedInterviews}
                  handleInterviewClick={handleInterviewClick}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  getDaysUntil={getDaysUntil}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interview Detail Modal */}
      <InterviewDetailModal
        interview={selectedInterview}
        isOpen={showInterviewDetailModal}
        onClose={() => setShowInterviewDetailModal(false)}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
};

// Interview List Component
const InterviewList = ({
  interviews,
  handleInterviewClick,
  formatDate,
  getStatusBadge,
  getDaysUntil,
}) => {
  if (interviews.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          No Interviews Found
        </h3>
        <p className="text-gray-600">
          You don't have any scheduled interviews at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          onClick={handleInterviewClick}
          getStatusBadge={getStatusBadge}
          getDaysUntil={getDaysUntil}
        />
      ))}
    </div>
  );
};

const InterviewCard = ({
  interview,
  onClick,
  getStatusBadge,
  getDaysUntil,
}) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="text-xl font-semibold">{interview.companyName}</h3>
            <p className="text-gray-600">{interview.position}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span>{interview.date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                <span>{interview.time}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                <span>{interview.location}</span>
              </div>
            </div>

            {interview.isOfficialSchedule && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    This interview schedule is set by the placement office and
                    cannot be modified. If you need to request any changes,
                    please contact the placement coordinator.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-end">
            {getStatusBadge(interview.status, interview.confirmed)}
            {interview.status === "upcoming" && (
              <span className="text-sm mt-2">
                {getDaysUntil(interview.date)}
              </span>
            )}
            <Button
              onClick={() => onClick(interview)}
              className="mt-3 px-4 py-2"
              variant="outline"
              size="sm"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Interview Detail Modal
const InterviewDetailModal = ({
  interview,
  isOpen,
  onClose,
  formatDate,
  getStatusBadge,
}) => {
  if (!interview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Interview Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company & Position */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {interview.companyName}
                </h3>
                <p className="text-gray-600">{interview.position}</p>
              </div>
              {getStatusBadge(interview.status, interview.confirmed)}
            </div>
          </div>

          {/* Schedule & Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Date</h4>
                  <p className="text-blue-600">{formatDate(interview.date)}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Time</h4>
                  <p className="text-blue-600">{interview.time}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Mode</h4>
                  <p className="text-blue-600">
                    {interview.location?.toLowerCase().includes("virtual") ||
                    interview.location?.toLowerCase().includes("online") ||
                    interview.location?.toLowerCase().includes("zoom")
                      ? "Virtual/Online"
                      : "In-Person"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-800 flex items-center mb-3">
              <MapPin className="h-5 w-5 mr-2" />
              Venue Information
            </h4>
            <div className="ml-7">
              <p className="text-indigo-900 font-medium">
                {interview.location}
              </p>
              {interview.originalApplication?.interviewLocation && (
                <p className="text-indigo-700 mt-1">
                  {interview.originalApplication.interviewLocation}
                </p>
              )}

              {/* Additional venue details if available */}
              {interview.originalApplication?.interviewVenueDetails && (
                <p className="text-indigo-600 mt-2 text-sm">
                  {interview.originalApplication.interviewVenueDetails}
                </p>
              )}

              <div className="mt-3 flex justify-between items-center">
                <p className="text-xs text-indigo-500">
                  {interview.location?.toLowerCase().includes("virtual") ||
                  interview.location?.toLowerCase().includes("online") ||
                  interview.location?.toLowerCase().includes("zoom")
                    ? "Meeting link will be shared before the interview"
                    : "Please arrive 15 minutes before the scheduled time"}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                >
                  View Map
                </Button>
              </div>
            </div>
          </div>

          {/* Official Schedule Notice */}
          {interview.isOfficialSchedule && (
            <Alert className="bg-yellow-50 border border-yellow-200">
              <Info className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <p className="font-medium mb-1">Official Interview Schedule</p>
                <p>
                  This interview has been officially scheduled by the placement
                  office. The date, time, and location are fixed and cannot be
                  changed by students. If you have a scheduling conflict, please
                  contact the placement coordinator immediately.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Interview Notes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">
              Interview Notes & Instructions
            </h4>
            <p className="text-gray-600 whitespace-pre-line">
              {interview.notes}
            </p>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Required Documents
            </h4>
            <div className="flex flex-wrap gap-2">
              {interview.documents.map((doc, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  {doc}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {interview.status === "upcoming" && !interview.confirmed && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  /* Confirm logic */
                }}
              >
                Confirm Attendance
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewScheduler;
