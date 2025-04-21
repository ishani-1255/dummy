import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Building,
  Users,
  Briefcase,
  AlertCircle,
  Check,
  X,
  Loader,
  Mail,
  PlusCircle,
  CalendarClock,
} from "lucide-react";
import axios from "axios";
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
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "./UIComponents";
import AdminLayout from "./AdminLayout";

// Department mapping for display purposes
const departmentMapping = {
  CSE: "Computer Science",
  CE: "Civil Engineering",
  IT: "Information Technology",
  SFE: "Safety and Fire Engineering",
  ME: "Mechanical Engineering",
  EEE: "Electrical and Electronics Engineering",
  EC: "Electronics and Communication",
};

const departments = Object.keys(departmentMapping);

const InterviewManagement = () => {
  // States for filters
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [companies, setCompanies] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [batches, setBatches] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Modal states
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);

  // Schedule interview modal states
  const [scheduleData, setScheduleData] = useState({
    companyId: "",
    branches: [],
    interviewDateTime: "",
    interviewLocation: "",
    interviewVenueDetails: "",
    interviewNotes: "",
    notifyStudents: true,
  });

  // Fetch interviews data
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);

        // Fetch applications with interview status
        const response = await axios.get("/api/admin/applications", {
          params: {
            status: "Interview Scheduled",
            company: selectedCompany !== "all" ? selectedCompany : undefined,
            department:
              selectedDepartment !== "all" ? selectedDepartment : undefined,
            batch: selectedBatch !== "all" ? selectedBatch : undefined,
          },
          withCredentials: true,
        });

        // Format the data for display
        const formattedInterviews = response.data.map((app) => ({
          _id: app._id,
          studentName: app.student ? app.student.name : "Unknown Student",
          studentId: app.student ? app.student._id : null,
          department: app.studentModel || "Unknown",
          batch: app.student ? app.student.yearOfAdmission : "Unknown",
          company: app.company,
          status: app.status,
          interviewDateTime: app.interviewDateTime,
          location: app.interviewLocation || "On Campus",
          venueDetails: app.interviewVenueDetails || "",
          notes: app.interviewNotes || "",
        }));

        setInterviews(formattedInterviews);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interview data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [selectedCompany, selectedDepartment, selectedStatus, selectedBatch]);

  // Fetch companies for filter
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/companies", {
          withCredentials: true,
        });
        setCompanies(response.data);

        // Set initial company for schedule modal
        if (response.data.length > 0) {
          setScheduleData((prev) => ({
            ...prev,
            companyId: response.data[0]._id,
          }));
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch available batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        // Get current year
        const currentYear = new Date().getFullYear();

        // Generate batch years (current year and 3 previous years)
        const generatedBatches = [];
        for (let i = 0; i < 4; i++) {
          const year = currentYear - i;
          generatedBatches.push(`${year - 4}-${year}`);
        }

        setBatches(generatedBatches);
      } catch (err) {
        console.error("Error generating batches:", err);
      }
    };

    fetchBatches();
  }, []);

  // Filter interviews based on search query and tab
  const filteredInterviews = interviews.filter((interview) => {
    // Search filter
    const matchesSearch =
      (interview.company?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      interview.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (interview.location || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Tab filter
    const today = new Date();
    const interviewDate = new Date(interview.interviewDateTime);

    const isUpcoming =
      interviewDate >= today && interview.status !== "Completed";
    const isPast = interviewDate < today || interview.status === "Completed";

    const matchesTab =
      (activeTab === "upcoming" && isUpcoming) ||
      (activeTab === "past" && isPast) ||
      activeTab === "all";

    return matchesSearch && matchesTab;
  });

  // Group interviews by company
  const interviewsByCompany = filteredInterviews.reduce((acc, interview) => {
    const companyName = interview.company?.name || "Unknown Company";
    if (!acc[companyName]) {
      acc[companyName] = [];
    }
    acc[companyName].push(interview);
    return acc;
  }, {});

  // Handle sending notification
  const handleSendNotification = async () => {
    if (!notificationMessage.trim() || !selectedInterview) return;

    try {
      setSendingNotification(true);

      await axios.post(
        `/api/admin/applications/${selectedInterview._id}/notify`,
        {
          message: notificationMessage,
          studentId: selectedInterview.studentId,
          studentModel: selectedInterview.department,
        },
        {
          withCredentials: true,
        }
      );

      // Reset and close modal
      setNotificationMessage("");
      setSelectedInterview(null);
      setNotifyModalOpen(false);

      // Show success message
      alert("Notification sent successfully");

      // Refresh interviews data
      const response = await axios.get("/api/admin/applications", {
        params: {
          status: "Interview Scheduled",
          company: selectedCompany !== "all" ? selectedCompany : undefined,
          department:
            selectedDepartment !== "all" ? selectedDepartment : undefined,
          batch: selectedBatch !== "all" ? selectedBatch : undefined,
        },
        withCredentials: true,
      });

      // Format the data for display
      const formattedInterviews = response.data.map((app) => ({
        _id: app._id,
        studentName: app.student ? app.student.name : "Unknown Student",
        studentId: app.student ? app.student._id : null,
        department: app.studentModel || "Unknown",
        batch: app.student ? app.student.yearOfAdmission : "Unknown",
        company: app.company,
        status: app.status,
        interviewDateTime: app.interviewDateTime,
        location: app.interviewLocation || "On Campus",
        venueDetails: app.interviewVenueDetails || "",
        notes: app.interviewNotes || "",
      }));

      setInterviews(formattedInterviews);
    } catch (err) {
      console.error("Error sending notification:", err);
      alert(
        "Failed to send notification: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSendingNotification(false);
    }
  };

  // Handle scheduling batch interviews
  const handleScheduleInterviews = async () => {
    try {
      setLoading(true);

      const {
        companyId,
        branches,
        interviewDateTime,
        interviewLocation,
        interviewVenueDetails,
        interviewNotes,
        notifyStudents,
      } = scheduleData;

      if (!companyId || !interviewDateTime || branches.length === 0) {
        alert(
          "Please fill in all required fields (company, date/time, and at least one branch)"
        );
        setLoading(false);
        return;
      }

      // Send request to schedule interviews
      const response = await axios.post(
        "/api/admin/schedule-interviews",
        {
          companyId,
          branches,
          interviewDateTime,
          interviewLocation,
          interviewVenueDetails,
          interviewNotes,
          notifyStudents,
        },
        {
          withCredentials: true,
        }
      );

      // Close modal and show success message
      setScheduleModalOpen(false);
      alert(`Successfully scheduled ${response.data.updatedCount} interviews`);

      // Reset form
      setScheduleData({
        companyId: companies.length > 0 ? companies[0]._id : "",
        branches: [],
        interviewDateTime: "",
        interviewLocation: "",
        interviewVenueDetails: "",
        interviewNotes: "",
        notifyStudents: true,
      });

      // Refresh interviews data
      const interviewsResponse = await axios.get("/api/admin/applications", {
        params: {
          status: "Interview Scheduled",
          company: selectedCompany !== "all" ? selectedCompany : undefined,
          department:
            selectedDepartment !== "all" ? selectedDepartment : undefined,
          batch: selectedBatch !== "all" ? selectedBatch : undefined,
        },
        withCredentials: true,
      });

      // Format the data for display
      const formattedInterviews = interviewsResponse.data.map((app) => ({
        _id: app._id,
        studentName: app.student ? app.student.name : "Unknown Student",
        studentId: app.student ? app.student._id : null,
        department: app.studentModel || "Unknown",
        batch: app.student ? app.student.yearOfAdmission : "Unknown",
        company: app.company,
        status: app.status,
        interviewDateTime: app.interviewDateTime,
        location: app.interviewLocation || "On Campus",
        venueDetails: app.interviewVenueDetails || "",
        notes: app.interviewNotes || "",
      }));

      setInterviews(formattedInterviews);
    } catch (err) {
      console.error("Error scheduling interviews:", err);
      alert(
        "Failed to schedule interviews: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Toggle branch selection
  const toggleBranchSelection = (branch) => {
    setScheduleData((prev) => {
      if (prev.branches.includes(branch)) {
        return {
          ...prev,
          branches: prev.branches.filter((b) => b !== branch),
        };
      } else {
        return {
          ...prev,
          branches: [...prev.branches, branch],
        };
      }
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Interview Management
          </h1>
          <Button onClick={() => setScheduleModalOpen(true)}>
            <CalendarClock className="h-4 w-4 mr-2" />
            Schedule Batch Interviews
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search company, student, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Company Filter */}
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Department Filter */}
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {departmentMapping[dept]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Batch Filter */}
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
            <TabsTrigger value="past">Past Interviews</TabsTrigger>
            <TabsTrigger value="all">All Interviews</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Interview Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-100">
            <CardContent className="flex flex-col items-center py-12">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : Object.keys(interviewsByCompany).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Interviews Found
              </h3>
              <p className="text-gray-500">
                {activeTab === "upcoming"
                  ? "There are no upcoming interviews scheduled."
                  : activeTab === "past"
                  ? "There are no past interviews."
                  : "No interviews match your filter criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(interviewsByCompany).map(
              ([companyName, companyInterviews]) => (
                <Card key={companyName}>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                        {companyName}
                      </CardTitle>
                      <Badge variant="outline" className="text-sm">
                        {companyInterviews.length}{" "}
                        {companyInterviews.length === 1
                          ? "Interview"
                          : "Interviews"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {companyInterviews.map((interview) => (
                          <TableRow key={interview._id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {interview.studentName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {interview.batch || "N/A"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {departmentMapping[interview.department] ||
                                interview.department ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {formatDate(interview.interviewDateTime)}
                            </TableCell>
                            <TableCell>
                              <span className="block">
                                {interview.location || "Not specified"}
                              </span>
                              {interview.venueDetails && (
                                <span className="text-xs text-gray-500 block">
                                  {interview.venueDetails}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  interview.status === "Completed"
                                    ? "success"
                                    : interview.status === "Cancelled"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {interview.status || "Scheduled"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInterview(interview);
                                    setNotifyModalOpen(true);
                                  }}
                                  title="Send notification"
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  Notify
                                </Button>

                                {interview.status !== "Completed" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await axios.put(
                                          `/api/admin/applications/${interview._id}`,
                                          {
                                            status: "Completed",
                                          },
                                          {
                                            withCredentials: true,
                                          }
                                        );

                                        // Update local state
                                        setInterviews(
                                          interviews.map((i) =>
                                            i._id === interview._id
                                              ? { ...i, status: "Completed" }
                                              : i
                                          )
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Error marking interview as completed:",
                                          err
                                        );
                                        alert(
                                          "Failed to update interview status"
                                        );
                                      }
                                    }}
                                    className="text-green-600 border-green-600"
                                    title="Mark as completed"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}

                                {interview.status !== "Cancelled" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await axios.put(
                                          `/api/admin/applications/${interview._id}`,
                                          {
                                            status: "Cancelled",
                                          },
                                          {
                                            withCredentials: true,
                                          }
                                        );

                                        // Update local state
                                        setInterviews(
                                          interviews.map((i) =>
                                            i._id === interview._id
                                              ? { ...i, status: "Cancelled" }
                                              : i
                                          )
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Error cancelling interview:",
                                          err
                                        );
                                        alert(
                                          "Failed to update interview status"
                                        );
                                      }
                                    }}
                                    className="text-red-600 border-red-600"
                                    title="Cancel interview"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}

        {/* Notification Modal */}
        <Dialog open={notifyModalOpen} onOpenChange={setNotifyModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
            </DialogHeader>

            {selectedInterview && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    Student: {selectedInterview.studentName}
                  </p>
                  <p className="text-sm font-medium">
                    Company: {selectedInterview.company?.name}
                  </p>
                  <p className="text-sm">
                    Interview: {formatDate(selectedInterview.interviewDateTime)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notification Message
                  </label>
                  <Textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter notification message for the student..."
                    className="w-full h-32"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNotifyModalOpen(false);
                      setNotificationMessage("");
                    }}
                    disabled={sendingNotification}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendNotification}
                    disabled={
                      !notificationMessage.trim() || sendingNotification
                    }
                  >
                    {sendingNotification ? "Sending..." : "Send Notification"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Schedule Batch Interviews Modal */}
        <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Schedule Batch Interviews</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Company Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company
                </label>
                <Select
                  value={scheduleData.companyId}
                  onValueChange={(value) =>
                    setScheduleData({ ...scheduleData, companyId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Branches
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      onClick={() => toggleBranchSelection(dept)}
                      className={`
                        px-3 py-1 rounded-full text-sm cursor-pointer
                        ${
                          scheduleData.branches.includes(dept)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      `}
                    >
                      {departmentMapping[dept]}
                    </div>
                  ))}
                </div>
                {scheduleData.branches.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select at least one branch
                  </p>
                )}
              </div>

              {/* Interview Date & Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interview Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={scheduleData.interviewDateTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      interviewDateTime: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  value={scheduleData.interviewLocation}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      interviewLocation: e.target.value,
                    })
                  }
                  placeholder="e.g. Main Campus, Online, etc."
                  className="w-full"
                />
              </div>

              {/* Venue Details */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Venue Details (Optional)
                </label>
                <Input
                  value={scheduleData.interviewVenueDetails}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      interviewVenueDetails: e.target.value,
                    })
                  }
                  placeholder="e.g. Room 302, Building A"
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  value={scheduleData.interviewNotes}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      interviewNotes: e.target.value,
                    })
                  }
                  placeholder="Any additional information for students"
                  className="w-full h-20"
                />
              </div>

              {/* Notify Students */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notify-students"
                  checked={scheduleData.notifyStudents}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      notifyStudents: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label
                  htmlFor="notify-students"
                  className="ml-2 text-sm text-gray-700"
                >
                  Send notifications to students
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setScheduleModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleScheduleInterviews}
                  disabled={
                    loading ||
                    !scheduleData.companyId ||
                    !scheduleData.interviewDateTime ||
                    scheduleData.branches.length === 0
                  }
                >
                  {loading ? "Scheduling..." : "Schedule Interviews"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default InterviewManagement;
