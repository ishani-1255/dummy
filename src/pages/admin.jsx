import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building,
  GraduationCap,
  ChartBar,
  Briefcase,
  Award,
  TrendingUp,
  Calendar,
  Mail,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  BookOpen,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Search,
  Loader,
  MessageSquare,
  FileText,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/admin/UIComponents";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Alert,
  AlertDescription,
} from "../components/admin/UIComponents";
import { ScrollArea } from "../components/admin/UIComponents";
import { Badge } from "../components/admin/UIComponents";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Button,
} from "../components/admin/UIComponents";
import Sidebar from "../components/admin/Sidebar";
import AdminLayout from "../components/admin/AdminLayout";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  // State variables for dynamic data
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Stats and data states
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    averagePackage: "0 LPA",
    totalCompanies: 0,
    upcomingInterviews: 0,
    placementRate: 0,
  });

  const [departmentStats, setDepartmentStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState({
    placements: [],
    newCompanies: [],
    interviews: [],
  });
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);

  // Loading states
  const [loading, setLoading] = useState({
    stats: true,
    departments: true,
    placements: true,
    companies: true,
    interviews: true,
    schedule: true,
    notifications: true,
  });

  // Error states
  const [error, setError] = useState({
    stats: null,
    departments: null,
    placements: null,
    companies: null,
    interviews: null,
    schedule: null,
    notifications: null,
  });

  // Add new state for queries
  const [queries, setQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [queryError, setQueryError] = useState(null);

  // Add new state for batch filtering
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [availableBatches, setAvailableBatches] = useState([]);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading((prev) => ({ ...prev, stats: true }));

        // Fetch various statistics in parallel
        const [studentsRes, companiesRes, applicationsRes] = await Promise.all([
          axios.get("/api/admin/students-count", { withCredentials: true }),
          axios.get("/api/admin/companies", { withCredentials: true }),
          axios.get("/api/admin/placements", { withCredentials: true }),
        ]);

        // Calculate total students across all departments
        const totalStudents = Object.values(
          studentsRes.data.counts || {}
        ).reduce((sum, count) => sum + count, 0);

        // Calculate placed students
        const placedStudents = applicationsRes.data.length;

        // Calculate placement rate
        const placementRate =
          totalStudents > 0
            ? ((placedStudents / totalStudents) * 100).toFixed(1)
            : 0;

        // Calculate average package
        const packages = applicationsRes.data
          .map((p) =>
            typeof p.package === "number" ? p.package : parseFloat(p.package)
          )
          .filter((p) => !isNaN(p));

        const avgPackage =
          packages.length > 0
            ? (
                packages.reduce((sum, p) => sum + p, 0) / packages.length
              ).toFixed(1) + " LPA"
            : "0 LPA";

        // Count upcoming interviews
        const today = new Date();
        const upcomingInterviews = applicationsRes.data.filter(
          (app) =>
            app.status === "Interview Scheduled" &&
            new Date(app.interviewDateTime || app.joiningDate) >= today
        ).length;

        setStats({
          totalStudents,
          placedStudents,
          averagePackage: avgPackage,
          totalCompanies: companiesRes.data.length,
          upcomingInterviews,
          placementRate: parseFloat(placementRate),
        });

        setError((prev) => ({ ...prev, stats: null }));
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError((prev) => ({ ...prev, stats: "Failed to load statistics" }));
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, []);

  // Fetch department-wise placement data
  useEffect(() => {
    const fetchDepartmentStats = async () => {
      try {
        setLoading((prev) => ({ ...prev, departments: true }));

        // Fetch department counts
        const deptCountsRes = await axios.get("/api/admin/students-count", {
          withCredentials: true,
        });

        // Fetch placements
        const placementsRes = await axios.get("/api/admin/placements", {
          withCredentials: true,
        });

        const deptCounts = deptCountsRes.data.counts || {};

        // Group placements by department
        const placementsByDept = {};
        placementsRes.data.forEach((placement) => {
          const dept = placement.department;
          if (!placementsByDept[dept]) {
            placementsByDept[dept] = 0;
          }
          placementsByDept[dept]++;
        });

        // Generate color palette for departments
        const colors = [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#8884d8",
          "#82ca9d",
          "#ffc658",
        ];

        // Create department stats array
        const deptStats = Object.entries(deptCounts).map(
          ([dept, total], index) => ({
            name: dept,
            placed: placementsByDept[dept] || 0,
            total,
            fill: colors[index % colors.length],
          })
        );

        setDepartmentStats(deptStats);
        setError((prev) => ({ ...prev, departments: null }));
      } catch (err) {
        console.error("Error fetching department stats:", err);
        setError((prev) => ({
          ...prev,
          departments: "Failed to load department statistics",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, departments: false }));
      }
    };

    fetchDepartmentStats();
  }, []);

  // Fetch recent placements and activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading((prev) => ({ ...prev, placements: true, companies: true }));

        // Fetch placements
        const placementsRes = await axios.get("/api/admin/placements", {
          withCredentials: true,
        });

        // Fetch companies
        const companiesRes = await axios.get("/api/companies", {
          withCredentials: true,
        });

        // Get recent placements (latest 3)
        const recentPlacements = placementsRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((p) => ({
            student: p.studentName,
            company: p.company?.name || "Unknown Company",
            package: p.package || "Not specified",
            date: new Date(p.createdAt).toISOString().split("T")[0],
          }));

        // Get recent companies (latest 2)
        const recentCompanies = companiesRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
          .map((c) => ({
            name: c.name,
            industry: c.industry,
            requirements: c.requirements || `CGPA > ${c.minimumCgpa || 0}`,
            date: new Date(c.createdAt).toISOString().split("T")[0],
          }));

        // Get upcoming interviews
        const today = new Date();
        const upcomingInterviews = placementsRes.data
          .filter(
            (p) =>
              p.status === "Interview Scheduled" &&
              new Date(p.interviewDateTime) >= today
          )
          .sort(
            (a, b) =>
              new Date(a.interviewDateTime) - new Date(b.interviewDateTime)
          )
          .slice(0, 3)
          .map((p) => ({
            company: p.company?.name || "Unknown",
            role: p.role || "Job Role",
            date: new Date(p.interviewDateTime).toISOString().split("T")[0],
            type: p.interviewType || "Technical",
          }));

        setRecentActivities({
          placements: recentPlacements,
          newCompanies: recentCompanies,
          interviews: upcomingInterviews,
        });

        setError((prev) => ({
          ...prev,
          placements: null,
          companies: null,
        }));
      } catch (err) {
        console.error("Error fetching recent activities:", err);
        setError((prev) => ({
          ...prev,
          placements: "Failed to load placement data",
          companies: "Failed to load company data",
        }));
      } finally {
        setLoading((prev) => ({
          ...prev,
          placements: false,
          companies: false,
        }));
      }
    };

    fetchRecentActivities();
  }, []);

  // Fetch upcoming schedule
  useEffect(() => {
    const fetchUpcomingSchedule = async () => {
      try {
        setLoading((prev) => ({ ...prev, schedule: true }));

        // Fetch applications with scheduled interviews
        const applicationsRes = await axios.get("/api/admin/applications", {
          withCredentials: true,
        });

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 14);

        // Filter applications for upcoming interviews
        const upcomingEvents = applicationsRes.data
          .filter(
            (app) =>
              app.interviewDateTime &&
              new Date(app.interviewDateTime) >= today &&
              new Date(app.interviewDateTime) <= nextWeek
          )
          .map((app) => ({
            company: app.company?.name || "Unknown Company",
            date: new Date(app.interviewDateTime).toISOString().split("T")[0],
            type: app.interviewType || "Interview",
            details: app.interviewLocation || "Campus",
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        setUpcomingSchedule(upcomingEvents);
        setError((prev) => ({ ...prev, schedule: null }));
      } catch (err) {
        console.error("Error fetching upcoming schedule:", err);
        setError((prev) => ({ ...prev, schedule: "Failed to load schedule" }));
      } finally {
        setLoading((prev) => ({ ...prev, schedule: false }));
      }
    };

    fetchUpcomingSchedule();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading((prev) => ({ ...prev, notifications: true }));

        // For admin notifications - could be queries or custom admin notifications
        const queriesRes = await axios.get("/api/queries", {
          withCredentials: true,
        });

        // Convert recent queries to notifications
        const queryNotifications = queriesRes.data
          .filter((query) => query.status === "pending")
          .slice(0, 5)
          .map((query) => ({
            id: query._id,
            type: "query",
            title: "New Query",
            message: `${query.studentName} has a new query: ${query.title}`,
            timestamp: new Date(query.createdAt).toLocaleString(),
            status: "unread",
          }));

        setNotifications(queryNotifications);
        setError((prev) => ({ ...prev, notifications: null }));
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError((prev) => ({
          ...prev,
          notifications: "Failed to load notifications",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, notifications: false }));
      }
    };

    fetchNotifications();
  }, []);

  // Fetch queries for the admin dashboard
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoadingQueries(true);
        const response = await axios.get("/api/queries", {
          withCredentials: true,
        });

        // Sort queries by date (newest first)
        const sortedQueries = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // Get only recent 3 queries

        setQueries(sortedQueries);
        setQueryError(null);
      } catch (err) {
        console.error("Error fetching queries:", err);
        setQueryError("Failed to load query data");
      } finally {
        setLoadingQueries(false);
      }
    };

    fetchQueries();
  }, []);

  // Fetch available batches data
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get("/api/admin/batches", {
          withCredentials: true,
        });

        // Generate batch year ranges from current year
        const currentYear = new Date().getFullYear();
        const generatedBatches = [];

        // Add 3 years before and 3 years after current year
        for (let i = -3; i <= 3; i++) {
          const admissionYear = currentYear + i;
          const batchLabel = `${admissionYear}-${admissionYear + 4}`;
          generatedBatches.push(batchLabel);
        }

        // Add actual batches from API if available
        if (response.data && response.data.length > 0) {
          const apiBatches = response.data.map((batch) => batch.year);

          // Combine and remove duplicates
          const allBatches = [...new Set([...generatedBatches, ...apiBatches])];

          // Sort batches in descending order (newest first)
          allBatches.sort().reverse();

          setAvailableBatches(allBatches);

          // Default to current batch (e.g. 2023-2027)
          const currentBatch = `${currentYear}-${currentYear + 4}`;
          setSelectedBatch(
            allBatches.includes(currentBatch) ? currentBatch : allBatches[0]
          );
        } else {
          setAvailableBatches(generatedBatches);
          setSelectedBatch(`${currentYear}-${currentYear + 4}`);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);

        // Fallback to generated batches
        const currentYear = new Date().getFullYear();
        const fallbackBatches = [];

        for (let i = -3; i <= 3; i++) {
          const admissionYear = currentYear + i;
          fallbackBatches.push(`${admissionYear}-${admissionYear + 4}`);
        }

        setAvailableBatches(fallbackBatches);
        setSelectedBatch(`${currentYear}-${currentYear + 4}`);
      }
    };

    fetchBatches();
  }, []);

  // Fetch department-wise placement data with batch filter
  useEffect(() => {
    const fetchDepartmentStats = async () => {
      try {
        setLoading((prev) => ({ ...prev, departments: true }));

        // Fetch department counts with batch filter
        const deptCountsRes = await axios.get("/api/admin/students-count", {
          params: {
            batch: selectedBatch !== "all" ? selectedBatch : undefined,
          },
          withCredentials: true,
        });

        // Fetch placements with batch filter
        const placementsRes = await axios.get("/api/admin/placements", {
          params: {
            batch: selectedBatch !== "all" ? selectedBatch : undefined,
          },
          withCredentials: true,
        });

        const deptCounts = deptCountsRes.data.counts || {};

        // Group placements by department
        const placementsByDept = {};
        placementsRes.data.forEach((placement) => {
          const dept = placement.department;
          if (!placementsByDept[dept]) {
            placementsByDept[dept] = 0;
          }
          placementsByDept[dept]++;
        });

        // Generate color palette for departments
        const colors = [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#8884d8",
          "#82ca9d",
          "#ffc658",
        ];

        // Create department stats array
        const deptStats = Object.entries(deptCounts).map(
          ([dept, total], index) => ({
            name: dept,
            placed: placementsByDept[dept] || 0,
            total,
            fill: colors[index % colors.length],
          })
        );

        setDepartmentStats(deptStats);
        setError((prev) => ({ ...prev, departments: null }));
      } catch (err) {
        console.error("Error fetching department stats:", err);
        setError((prev) => ({
          ...prev,
          departments: "Failed to load department statistics",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, departments: false }));
      }
    };

    fetchDepartmentStats();
  }, [selectedBatch]); // Re-fetch when batch changes

  // Update other data fetching effects to use the batch filter
  // Example for fetchRecentActivities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading((prev) => ({ ...prev, placements: true, companies: true }));

        // Fetch placements with batch filter
        const placementsRes = await axios.get("/api/admin/placements", {
          params: {
            batch: selectedBatch !== "all" ? selectedBatch : undefined,
          },
          withCredentials: true,
        });

        // Fetch companies
        const companiesRes = await axios.get("/api/companies", {
          withCredentials: true,
        });

        // Get recent placements (latest 3)
        const recentPlacements = placementsRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((p) => ({
            student: p.studentName,
            company: p.company?.name || "Unknown Company",
            package: p.package || "Not specified",
            date: new Date(p.createdAt).toISOString().split("T")[0],
          }));

        // Get recent companies (latest 2)
        const recentCompanies = companiesRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
          .map((c) => ({
            name: c.name,
            industry: c.industry,
            requirements: c.requirements || `CGPA > ${c.minimumCgpa || 0}`,
            date: new Date(c.createdAt).toISOString().split("T")[0],
          }));

        // Get upcoming interviews
        const today = new Date();
        const upcomingInterviews = placementsRes.data
          .filter(
            (p) =>
              p.status === "Interview Scheduled" &&
              new Date(p.interviewDateTime) >= today
          )
          .sort(
            (a, b) =>
              new Date(a.interviewDateTime) - new Date(b.interviewDateTime)
          )
          .slice(0, 3)
          .map((p) => ({
            company: p.company?.name || "Unknown",
            role: p.role || "Job Role",
            date: new Date(p.interviewDateTime).toISOString().split("T")[0],
            type: p.interviewType || "Technical",
          }));

        setRecentActivities({
          placements: recentPlacements,
          newCompanies: recentCompanies,
          interviews: upcomingInterviews,
        });

        setError((prev) => ({
          ...prev,
          placements: null,
          companies: null,
        }));
      } catch (err) {
        console.error("Error fetching recent activities:", err);
        setError((prev) => ({
          ...prev,
          placements: "Failed to load placement data",
          companies: "Failed to load company data",
        }));
      } finally {
        setLoading((prev) => ({
          ...prev,
          placements: false,
          companies: false,
        }));
      }
    };

    fetchRecentActivities();
  }, [selectedBatch]); // Re-fetch when batch changes

  // Notification icon with badge
  const NotificationIcon = () => (
    <div className="relative">
      <Bell className="h-5 w-5 text-gray-600" />
      {notifications.filter((n) => n.status === "unread").length > 0 && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
      )}
    </div>
  );

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === "all" || notification.type === activeTab;
    return matchesSearch && matchesType;
  });

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, status: "read" })));
  };

  // Enhanced Notification Modal
  const NotificationModal = () => (
    <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-2xl">Notifications</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNotifications([])}
              >
                Clear all
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="interview">
              Interviews
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "interview").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="placement">
              Placements
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "placement").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="query">
              Queries
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "query").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            {loading.notifications ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No notifications found</AlertDescription>
              </Alert>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 mb-2 rounded-lg transition-all hover:shadow-md ${
                    notification.status === "unread"
                      ? "bg-blue-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          notification.type === "interview"
                            ? "bg-purple-100"
                            : notification.type === "placement"
                            ? "bg-green-100"
                            : notification.type === "query"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {notification.type === "interview" ? (
                          <Briefcase className="h-5 w-5 text-purple-600" />
                        ) : notification.type === "placement" ? (
                          <Award className="h-5 w-5 text-green-600" />
                        ) : notification.type === "query" ? (
                          <MessageSquare className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <Building className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.status === "unread" && (
                        <Badge variant="secondary">New</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNotification(notification.id)}
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  // Enhanced Mailbox Modal
  const MailboxModal = () => (
    <Dialog open={mailboxOpen} onOpenChange={setMailboxOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mailbox</DialogTitle>
          <DialogDescription>
            Manage your communications with companies and students
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="inbox">
            <ScrollArea className="h-[400px]">
              {loading.notifications ? (
                <div className="flex justify-center items-center h-40">
                  <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : (
                /* Sample inbox items */
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-4 mb-2 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          Company Interview Update
                        </h4>
                        <p className="text-sm text-gray-600">
                          Updates regarding the upcoming technical interviews...
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          2 hours ago
                        </p>
                      </div>
                      <Badge variant="outline">Important</Badge>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="sent">
            <div className="text-center py-8">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-500">No sent emails yet</p>
            </div>
          </TabsContent>
          <TabsContent value="drafts">
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-500">No drafts saved</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  // Enhanced Department Chart
  const DepartmentChart = () => (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Department-wise Placements
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-gray-100">
              Total Students:{" "}
              {departmentStats.reduce((acc, curr) => acc + curr.total, 0)}
            </Badge>
            <Badge variant="outline" className="bg-green-100">
              Total Placed:{" "}
              {departmentStats.reduce((acc, curr) => acc + curr.placed, 0)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {loading.departments ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        ) : error.departments ? (
          <div className="flex flex-col justify-center items-center h-full">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500">{error.departments}</p>
          </div>
        ) : departmentStats.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full">
            <Info className="h-12 w-12 text-blue-500 mb-4" />
            <p className="text-gray-500">No placement data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentStats}
                dataKey="placed"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={80}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {departmentStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 shadow rounded border">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">
                          Placed: {data.placed}/{data.total}
                        </p>
                        <p className="text-sm text-green-600">
                          {((data.placed / data.total) * 100).toFixed(1)}%
                          placed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  // Recent Activities Section
  const RecentActivities = () => (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="placements">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="placements">Placements</TabsTrigger>
            <TabsTrigger value="companies">New Companies</TabsTrigger>
            <TabsTrigger value="interviews">Upcoming Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="placements">
            {loading.placements ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : error.placements ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500">{error.placements}</p>
              </div>
            ) : recentActivities.placements.length === 0 ? (
              <div className="text-center py-8">
                <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500">No recent placements</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentActivities.placements.map((placement, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {placement.student}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {placement.company}
                        </p>
                        <p className="text-xs text-green-500 mt-1">
                          {placement.package}
                        </p>
                        <p className="text-xs text-gray-400">
                          {placement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="companies">
            {loading.companies ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : error.companies ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500">{error.companies}</p>
              </div>
            ) : recentActivities.newCompanies.length === 0 ? (
              <div className="text-center py-8">
                <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500">No new companies</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentActivities.newCompanies.map((company, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {company.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {company.industry}
                        </p>
                        <p className="text-sm text-blue-500">
                          {company.requirements}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {company.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="interviews">
            {loading.interviews ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : error.interviews ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500">{error.interviews}</p>
              </div>
            ) : recentActivities.interviews.length === 0 ? (
              <div className="text-center py-8">
                <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming interviews</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentActivities.interviews.map((interview, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {interview.company}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {interview.role}
                        </p>
                        <p className="text-sm text-purple-500">
                          {interview.type}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {interview.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  // New component to display recent queries
  const RecentQueries = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Queries</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingQueries ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : queryError ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">{queryError}</p>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-500">No recent queries</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queries.map((query) => (
              <div
                key={query._id}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className={`p-2 rounded-lg ${
                    query.status === "pending"
                      ? "bg-yellow-100"
                      : query.status === "in-progress"
                      ? "bg-blue-100"
                      : "bg-green-100"
                  }`}
                >
                  <MessageSquare
                    className={`h-5 w-5 ${
                      query.status === "pending"
                        ? "text-yellow-600"
                        : query.status === "in-progress"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800">{query.title}</h4>
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        query.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : query.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {query.status === "pending"
                        ? "Pending"
                        : query.status === "in-progress"
                        ? "In Progress"
                        : "Resolved"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {query.studentName} ({query.branch || "Unknown"})
                  </p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-400">
                      Submitted on:{" "}
                      {new Date(query.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {query.replies?.length || 0}{" "}
                      {query.replies?.length === 1 ? "reply" : "replies"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/queries")}
                className="text-blue-600"
              >
                View All Queries
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Quick Stats Items
  const StatsItem = ({
    title,
    value,
    change,
    icon: Icon,
    isLoading,
    error,
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : error ? (
              <p className="text-sm text-red-500">Error loading data</p>
            ) : (
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{value}</p>
                {change && (
                  <span
                    className={`text-xs font-medium flex items-center ${
                      change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {change > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(change)}%
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Add a batch selector component
  const BatchSelector = () => (
    <div className="flex items-center space-x-2 mb-4">
      <Filter className="h-5 w-5 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">Batch:</span>
      <select
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
        className="bg-white border border-gray-300 rounded-md text-sm p-2"
      >
        <option value="all">All Batches</option>
        {availableBatches.map((batch) => (
          <option key={batch} value={batch}>
            {batch}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-gray-50 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-500">Welcome back, Admin</p>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMailboxOpen(true)}
              className="bg-white"
            >
              <Mail className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNotificationsOpen(true)}
              className="bg-white"
            >
              <NotificationIcon />
            </Button>
          </div>
        </div>

        {/* Add Batch Selector */}
        <BatchSelector />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsItem
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            isLoading={loading.stats}
            error={error.stats}
          />
          <StatsItem
            title="Placed Students"
            value={stats.placedStudents}
            change={5.2}
            icon={Award}
            isLoading={loading.stats}
            error={error.stats}
          />
          <StatsItem
            title="Total Companies"
            value={stats.totalCompanies}
            icon={Building}
            isLoading={loading.stats}
            error={error.stats}
          />
          <StatsItem
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            change={2.1}
            icon={TrendingUp}
            isLoading={loading.stats}
            error={error.stats}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DepartmentChart />

          {/* Replace Upcoming Schedule with Recent Queries */}
          <RecentQueries />

          <RecentActivities />
        </div>

        <NotificationModal />
        <MailboxModal />
      </div>
    </AdminLayout>
  );
};

export default Admin;
