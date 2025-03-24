import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Trash2, 
  Edit, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Info,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Award,
  Bell,
  Menu,
  ExternalLink,
  Briefcase,
  Building2,
  Star
} from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../admin/UIComponents";
import Sidebar from "./Sidebar";

const InterviewPage = () => {
  // Sample data for scheduled interviews
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      companyName: "Tech Innovators Inc.",
      position: "Software Developer Intern",
      date: "2025-03-28",
      time: "10:00 AM - 11:30 AM",
      location: "Online (Zoom)",
      round: "Technical Interview",
      status: "upcoming",
      documents: ["Resume", "Portfolio"],
      confirmed: true,
      notes: "Prepare coding examples in React and Python. Review system design concepts.",
      interviewer: "Sarah Johnson",
      interviewerRole: "Senior Engineering Manager"
    },
    {
      id: 2,
      companyName: "Global Finance Corp",
      position: "Data Analyst",
      date: "2025-03-30",
      time: "2:00 PM - 3:00 PM",
      location: "Room 302, Placement Block",
      round: "First Round",
      status: "upcoming",
      documents: ["Resume", "Case Study", "Transcript"],
      confirmed: false,
      notes: "Research company background. Prepare for financial metrics questions.",
      interviewer: "Michael Chen",
      interviewerRole: "Data Science Lead"
    },
    {
      id: 3,
      companyName: "Creative Solutions Ltd",
      position: "UI/UX Designer",
      date: "2025-03-15",
      time: "11:00 AM - 12:30 PM",
      location: "Online (Microsoft Teams)",
      round: "Portfolio Review",
      status: "completed",
      documents: ["Portfolio", "Design Case Studies"],
      confirmed: true,
      notes: "Discussed design process and user research methodologies.",
      interviewer: "Emily Roberts",
      interviewerRole: "Design Director",
      feedback: "Strong portfolio, impressed with user-centered approach. Moving to next round."
    },
    {
      id: 4,
      companyName: "Innovative Healthcare Solutions",
      position: "Healthcare Data Analyst",
      date: "2025-03-18",
      time: "9:30 AM - 10:30 AM",
      location: "Building C, Room 405",
      round: "Second Round",
      status: "completed",
      documents: ["Resume", "Case Study Response"],
      confirmed: true,
      notes: "Prepared analysis on healthcare data trends.",
      interviewer: "Dr. Robert Lee",
      interviewerRole: "Head of Data Analytics",
      feedback: "Good analytical skills, needs improvement in healthcare domain knowledge."
    },
    {
      id: 5,
      companyName: "Future Tech Startups",
      position: "Frontend Developer",
      date: "2025-04-05",
      time: "3:00 PM - 4:30 PM",
      location: "Online (Google Meet)",
      round: "Technical Assessment",
      status: "upcoming",
      documents: ["Resume", "Code Samples"],
      confirmed: false,
      notes: "Review React hooks, state management, and responsive design patterns.",
      interviewer: "Alex Martinez",
      interviewerRole: "CTO"
    }
  ]);

  const [expandedInterview, setExpandedInterview] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [interviewToConfirm, setInterviewToConfirm] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your interview with Tech Innovators Inc. is tomorrow!", read: false },
    { id: 2, message: "Global Finance Corp requires confirmation by today", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Interview statistics
  const stats = useMemo(() => {
    return {
      total: interviews.length,
      upcoming: interviews.filter(i => i.status === 'upcoming').length,
      completed: interviews.filter(i => i.status === 'completed').length,
      confirmed: interviews.filter(i => i.confirmed).length
    };
  }, [interviews]);

  const toggleExpand = (id) => {
    if (expandedInterview === id) {
      setExpandedInterview(null);
    } else {
      setExpandedInterview(id);
    }
  };

  const confirmInterview = (id) => {
    setInterviews(interviews.map(interview => 
      interview.id === id ? {...interview, confirmed: true} : interview
    ));
    setShowConfirmationModal(false);
    
    // Add confirmation notification
    const interview = interviews.find(i => i.id === id);
    if (interview) {
      addNotification(`Interview with ${interview.companyName} confirmed successfully!`);
    }
  };

  const handleConfirmClick = (id) => {
    setInterviewToConfirm(id);
    setShowConfirmationModal(true);
  };

  const filteredInterviews = useMemo(() => {
    let filtered = [...interviews];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (interview) =>
          interview.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(interview => interview.status === filter);
    }
    
    // Sort interviews by date (upcoming first)
    return filtered.sort((a, b) => {
      if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
      if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
      return new Date(a.date) - new Date(b.date);
    });
  }, [interviews, searchTerm, filter]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status, confirmed) => {
    if (status === 'upcoming') {
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
    } else if (status === 'completed') {
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
      id: notifications.length + 1,
      message,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications([...notifications, newNotification]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleInterviewClick = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewDetails(true);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleDeleteInterview = (id) => {
    setInterviews(interviews.filter(interview => interview.id !== id));
    addNotification("Interview has been deleted successfully.");
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
            <p className="text-gray-600">Loading your interviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
     
        <Sidebar />

      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden bg-white p-4 flex items-center justify-between border-b">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">Interview Scheduler</h1>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header with Notification */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Interview Scheduler
            </h1>
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
                        <Bell className="h-5 w-5" />
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
                      <X className="h-4 w-4" />
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
                        className={`p-3 rounded-md ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                      >
                        <div className="flex items-start space-x-2">
                          <Info className={`h-5 w-5 mt-0.5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                          <div className="flex-1">
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            {notification.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 pb-4 px-3 md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Total Interviews
                    </p>
                    <p className="text-xl sm:text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-4 px-3 md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Upcoming
                    </p>
                    <p className="text-xl sm:text-3xl font-bold mt-1">{stats.upcoming}</p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-4 px-3 md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Completed
                    </p>
                    <p className="text-xl sm:text-3xl font-bold mt-1">{stats.completed}</p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-4 px-3 md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Confirmed
                    </p>
                    <p className="text-xl sm:text-3xl font-bold mt-1">{stats.confirmed}</p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company or position..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter Tabs */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
                <div className="border-b">
                  <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                    <h2 className="text-base sm:text-lg font-medium text-gray-800">
                      Your Interviews
                    </h2>
                  </div>
                  <TabsList className="w-full bg-transparent border-b border-gray-100 px-4 sm:px-6 rounded-none overflow-x-auto">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="upcoming"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                    >
                      Completed
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Tab Content */}
                <TabsContent value="all" className="mt-0 pt-0">
                  {isMobile ? (
                    <MobileInterviewList 
                      interviews={filteredInterviews} 
                      handleInterviewClick={handleInterviewClick}
                      handleConfirmClick={handleConfirmClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getDaysUntil={getDaysUntil}
                    />
                  ) : (
                    <DesktopInterviewList 
                      interviews={filteredInterviews} 
                      expandedInterview={expandedInterview}
                      toggleExpand={toggleExpand}
                      handleConfirmClick={handleConfirmClick}
                      handleInterviewClick={handleInterviewClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getDaysUntil={getDaysUntil}
                      handleDeleteInterview={handleDeleteInterview}
                    />
                  )}
                </TabsContent>
                <TabsContent value="upcoming" className="mt-0 pt-0">
                  {isMobile ? (
                    <MobileInterviewList 
                      interviews={filteredInterviews} 
                      handleInterviewClick={handleInterviewClick}
                      handleConfirmClick={handleConfirmClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getDaysUntil={getDaysUntil}
                    />
                  ) : (
                    <DesktopInterviewList 
                      interviews={filteredInterviews} 
                      expandedInterview={expandedInterview}
                      toggleExpand={toggleExpand}
                      handleConfirmClick={handleConfirmClick}
                      handleInterviewClick={handleInterviewClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getDaysUntil={getDaysUntil}
                      handleDeleteInterview={handleDeleteInterview}
                    />
                  )}
                </TabsContent>
                <TabsContent value="completed" className="mt-0 pt-0">
                  {isMobile ? (
                    <MobileInterviewList 
                      interviews={filteredInterviews} 
                      handleInterviewClick={handleInterviewClick}
                      handleConfirmClick={handleConfirmClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getDaysUntil={getDaysUntil}
                    />
                  ) : (
                    <DesktopInterviewList 
                      interviews={filteredInterviews} 
                      expandedInterview={expandedInterview}
                      toggleExpand={toggleExpand}
                      handleConfirmClick={handleConfirmClick}
                      handleInterviewClick={handleInterviewClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      getDaysUntil={getDaysUntil}
                      handleDeleteInterview={handleDeleteInterview}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Confirm Interview Attendance
            </DialogTitle>
            <DialogDescription className="pt-4">
              Please confirm that you will attend this interview. The company will be notified of your confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            {interviewToConfirm && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <p className="mb-2 font-medium">{interviews.find(i => i.id === interviewToConfirm)?.companyName}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span>{formatDate(interviews.find(i => i.id === interviewToConfirm)?.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{interviews.find(i => i.id === interviewToConfirm)?.time}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowConfirmationModal(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmInterview(interviewToConfirm)}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Attendance
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interview Details Modal */}
      <Dialog open={showInterviewDetails} onOpenChange={setShowInterviewDetails}>
        <DialogContent className="sm:max-w-2xl">
          {selectedInterview && (
            <>
              <DialogHeader className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedInterview.status, selectedInterview.confirmed)}
                  <span className="text-sm font-medium text-gray-500">
                    {selectedInterview.round}
                  </span>
                </div>
                <DialogTitle className="text-xl">
                  {selectedInterview.companyName}
                </DialogTitle>
                <p className="text-gray-600 font-medium">{selectedInterview.position}</p>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium">Required Documents</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-7">
                      {selectedInterview.documents.map((doc, index) => (
                        <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          <FileText className="h-3 w-3 mr-1.5" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedInterview.notes && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedInterview.notes}
                    </p>
                  </div>
                )}
                
                {selectedInterview.feedback && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Feedback</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedInterview.feedback}
                    </p>
                  </div>
                )}
                
                {selectedInterview.status === 'upcoming' && !selectedInterview.confirmed && (
                  <div className="pt-4">
                    <Alert className="bg-yellow-50 border-yellow-100">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        Please confirm your attendance for this interview.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowInterviewDetails(false)}
                  className="border-gray-300 text-gray-700"
                >
                  Close
                </Button>
                {selectedInterview.status === 'upcoming' && !selectedInterview.confirmed && (
                  <Button
                    onClick={() => {
                      setShowInterviewDetails(false);
                      handleConfirmClick(selectedInterview.id);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirm Attendance
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Mobile Add Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6">
          <button
            className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
            aria-label="Add Interview"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

// Mobile Interview Card Component
const MobileInterviewCard = ({ 
  interview, 
  handleInterviewClick, 
  handleConfirmClick,
  formatDate,
  getStatusBadge,
  getDaysUntil
}) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{interview.companyName}</h3>
            <p className="text-sm text-gray-600">{interview.position}</p>
          </div>
          {getStatusBadge(interview.status, interview.confirmed)}
        </div>
        
        <div className="text-sm space-y-2 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span>{formatDate(interview.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span>{interview.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            <span>{interview.location}</span>
          </div>
          {interview.status === 'upcoming' && (
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-blue-600 font-medium">{getDaysUntil(interview.date)}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleInterviewClick(interview)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Details
          </Button>
          
          {interview.status === 'upcoming' && !interview.confirmed && (
            <Button 
              size="sm"
              onClick={() => handleConfirmClick(interview.id)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Confirm
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Mobile Interview List
const MobileInterviewList = ({ 
  interviews, 
  handleInterviewClick,
  handleConfirmClick,
  formatDate,
  getStatusBadge,
  getDaysUntil
}) => {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="flex flex-col items-center justify-center">
          <Calendar className="h-10 w-10 mb-2 text-gray-400" />
          <p>No interviews found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      {interviews.map(interview => (
        <MobileInterviewCard
          key={interview.id}
          interview={interview}
          handleInterviewClick={handleInterviewClick}
          handleConfirmClick={handleConfirmClick}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
          getDaysUntil={getDaysUntil}
        />
      ))}
    </div>
  );
};

// Desktop Interview List Component
const DesktopInterviewList = ({ 
  interviews, 
  expandedInterview, 
  toggleExpand, 
  handleConfirmClick,
  handleInterviewClick,
  formatDate, 
  getStatusBadge, 
  getDaysUntil,
  handleDeleteInterview
}) => {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="flex flex-col items-center justify-center">
          <Calendar className="h-10 w-10 mb-2 text-gray-400" />
          <p>No interviews found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">Company & Position</TableHead>
          <TableHead className="w-[20%]">Date & Time</TableHead>
          <TableHead className="w-[20%]">Location</TableHead>
          <TableHead className="w-[15%]">Interview Round</TableHead>
          <TableHead className="w-[10%]">Status</TableHead>
          <TableHead className="w-[10%] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map(interview => (
          <React.Fragment key={interview.id}>
            <TableRow className="hover:bg-gray-50">
              <TableCell>
                <div className="font-medium">{interview.companyName}</div>
                <div className="text-sm text-gray-500">{interview.position}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{formatDate(interview.date)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{interview.time}</span>
                </div>
                {interview.status === 'upcoming' && (
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {getDaysUntil(interview.date)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{interview.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{interview.round}</span>
              </TableCell>
              <TableCell>
                {getStatusBadge(interview.status, interview.confirmed)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInterviewClick(interview)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Details
                  </Button>
                  
                  {interview.status === 'upcoming' && !interview.confirmed && (
                    <Button 
                      size="sm"
                      onClick={() => handleConfirmClick(interview.id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Confirm
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(interview.id)}
                  >
                    {expandedInterview === interview.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            
            {expandedInterview === interview.id && (
              <TableRow>
                <TableCell colSpan={6} className="bg-gray-50 p-0">
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Interviewer
                        </h4>
                        <p className="text-sm">
                          {interview.interviewer} <span className="text-gray-500">({interview.interviewerRole})</span>
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Required Documents
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {interview.documents.map((doc, index) => (
                            <Badge key={index} className="bg-gray-100 text-gray-800">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end items-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInterview(interview.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {interview.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Notes
                        </h4>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-100">
                          {interview.notes}
                        </p>
                      </div>
                    )}
                    
                    {interview.feedback && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Feedback
                        </h4>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-100">
                          {interview.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default InterviewPage; 