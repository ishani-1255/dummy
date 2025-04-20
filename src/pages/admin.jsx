import React, { useState } from "react";
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

// Enhanced sample data
const initialStats = {
  totalStudents: 856,
  placedStudents: 623,
  averagePackage: "8.5 LPA",
  totalCompanies: 45,
  upcomingInterviews: 12,
  placementRate: 72.8,
  notifications: [
    {
      id: 1,
      type: "interview",
      title: "New Interview Scheduled",
      message:
        "TechCorp has scheduled interviews for Software Engineer position",
      timestamp: "2 hours ago",
      status: "unread",
    },
    {
      id: 2,
      type: "placement",
      title: "Placement Update",
      message: "John Doe has been placed at InnovateSoft with 12 LPA package",
      timestamp: "4 hours ago",
      status: "read",
    },
    {
      id: 3,
      type: "company",
      title: "New Company Registration",
      message: "DataSys has registered for campus placements",
      timestamp: "1 day ago",
      status: "read",
    },
  ],
  departmentStats: [
    { name: "Computer Science", placed: 185, total: 200, fill: "#0088FE" },
    {
      name: "Information Technology",
      placed: 156,
      total: 180,
      fill: "#00C49F",
    },
    { name: "Electronics", placed: 142, total: 175, fill: "#FFBB28" },
    { name: "Mechanical", placed: 98, total: 150, fill: "#FF8042" },
    { name: "Civil", placed: 75, total: 120, fill: "#8884d8" },
    { name: "Electrical", placed: 88, total: 130, fill: "#82ca9d" },
    { name: "Chemical", placed: 45, total: 80, fill: "#ffc658" },
  ],
  recentActivities: {
    placements: [
      {
        student: "John Doe",
        company: "InnovateSoft",
        package: "12 LPA",
        date: "2024-02-15",
      },
      {
        student: "Jane Smith",
        company: "TechCorp",
        package: "14 LPA",
        date: "2024-02-14",
      },
      {
        student: "Mike Johnson",
        company: "DataSys",
        package: "10 LPA",
        date: "2024-02-13",
      },
    ],
    newCompanies: [
      {
        name: "DataSys",
        industry: "Software",
        requirements: "B.Tech CSE/IT",
        date: "2024-02-15",
      },
      {
        name: "GlobalTech",
        industry: "IT Services",
        requirements: "All Branches",
        date: "2024-02-14",
      },
    ],
    interviews: [
      {
        company: "TechCorp",
        role: "Software Engineer",
        date: "2024-02-20",
        type: "Technical",
      },
      {
        company: "InfoSys",
        role: "Systems Engineer",
        date: "2024-02-22",
        type: "HR",
      },
    ],
  },
  upcomingSchedule: [
    {
      company: "MegaTech",
      date: "2024-02-20",
      type: "Technical Interview",
      details: "For Software Development roles",
    },
    {
      company: "InfoSys",
      date: "2024-02-22",
      type: "Pre-Placement Talk",
      details: "Mandatory for all registered students",
    },
    {
      company: "GlobalCorp",
      date: "2024-02-25",
      type: "HR Round",
      details: "Final round for shortlisted candidates",
    },
  ],
};

const Admin = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(
    initialStats.notifications
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [stats] = useState(initialStats);

  // Notification icon with badge
  const NotificationIcon = () => (
    <div className="relative">
      <Bell className="h-5 w-5 text-gray-600" />
      {stats.notifications.filter((n) => n.status === "unread").length > 0 && (
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
            <TabsTrigger value="company">
              Companies
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "company").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            {filteredNotifications.length === 0 ? (
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
                            : "bg-blue-100"
                        }`}
                      >
                        {notification.type === "interview" ? (
                          <Briefcase className="h-5 w-5 text-purple-600" />
                        ) : notification.type === "placement" ? (
                          <Award className="h-5 w-5 text-green-600" />
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
              {/* Sample inbox items */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-4 mb-2 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Company Interview Update</h4>
                      <p className="text-sm text-gray-600">
                        Updates regarding the upcoming technical interviews...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <Badge variant="outline">Important</Badge>
                  </div>
                </div>
              ))}
            </ScrollArea>
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
              {stats.departmentStats.reduce((acc, curr) => acc + curr.total, 0)}
            </Badge>
            <Badge variant="outline" className="bg-green-100">
              Total Placed:{" "}
              {stats.departmentStats.reduce(
                (acc, curr) => acc + curr.placed,
                0
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats.departmentStats}
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
              {stats.departmentStats.map((entry, index) => (
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
                        {((data.placed / data.total) * 100).toFixed(1)}% placed
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.recentActivities.placements.map((placement, index) => (
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
                      <p className="text-xs text-gray-400">{placement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recentActivities.newCompanies.map((company, index) => (
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
          </TabsContent>

          <TabsContent value="interviews">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recentActivities.interviews.map((interview, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {interview.company}
                      </h4>
                      <p className="text-sm text-gray-500">{interview.role}</p>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... (Keep existing quick stats cards) ... */}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DepartmentChart />

          {/* Upcoming Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.upcomingSchedule.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {event.company}
                      </h4>
                      <p className="text-sm text-gray-500">{event.type}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.details}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <RecentActivities />
        </div>

        <NotificationModal />
        <MailboxModal />
      </div>
    </AdminLayout>
  );
};

export default Admin;
