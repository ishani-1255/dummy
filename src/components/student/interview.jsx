import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
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
  TabsContent
} from "../admin/UIComponents"

const InterviewScheduler = () => {
  // Sample data for scheduled interviews
  const [interviews, setInterviews] = useState([
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
      notes: "Prepare coding examples in React and Python. Review system design concepts."
    },
    {
      id: 2,
      companyName: "Global Finance Corp",
      position: "Data Analyst",
      date: "2025-03-20",
      time: "2:00 PM - 3:00 PM",
      location: "Room 302, Placement Block",
      round: "First Round",
      status: "upcoming",
      documents: ["Resume", "Case Study", "Transcript"],
      confirmed: false,
      notes: "Research company background. Prepare for financial metrics questions."
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
      notes: "Discuss design process and user research methodologies."
    }
  ]);

  const [expandedInterview, setExpandedInterview] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [interviewToConfirm, setInterviewToConfirm] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your interview with Tech Innovators Inc. is tomorrow!", read: false },
    { id: 2, message: "Global Finance Corp requires confirmation by today", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Interview statistics
  const stats = {
    total: interviews.length,
    upcoming: interviews.filter(i => i.status === 'upcoming').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    confirmed: interviews.filter(i => i.confirmed).length
  };

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

  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'all') return true;
    return interview.status === filter;
  });

  // Sort interviews by date (upcoming first)
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
    if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
    return new Date(a.date) - new Date(b.date);
  });

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with Notification */}
          <div className="flex items-center justify-between mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Interviews
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Upcoming Interviews
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.upcoming}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Completed
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Confirmed
                    </p>
                    <p className="text-3xl font-bold mt-1">{stats.confirmed}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filter Tabs */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
                <div className="border-b">
                  <div className="px-6 pt-6 pb-2">
                    <h2 className="text-lg font-medium text-gray-800">
                      Your Interviews
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
                  <InterviewList 
                    interviews={sortedInterviews} 
                    expandedInterview={expandedInterview}
                    toggleExpand={toggleExpand}
                    handleConfirmClick={handleConfirmClick}
                    handleInterviewClick={handleInterviewClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    getDaysUntil={getDaysUntil}
                  />
                </TabsContent>
                <TabsContent value="upcoming" className="mt-0 pt-0">
                  <InterviewList 
                    interviews={sortedInterviews} 
                    expandedInterview={expandedInterview}
                    toggleExpand={toggleExpand}
                    handleConfirmClick={handleConfirmClick}
                    handleInterviewClick={handleInterviewClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    getDaysUntil={getDaysUntil}
                  />
                </TabsContent>
                <TabsContent value="completed" className="mt-0 pt-0">
                  <InterviewList 
                    interviews={sortedInterviews} 
                    expandedInterview={expandedInterview}
                    toggleExpand={toggleExpand}
                    handleConfirmClick={handleConfirmClick}
                    handleInterviewClick={handleInterviewClick}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    getDaysUntil={getDaysUntil}
                  />
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
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium">Date & Time</h3>
                    </div>
                    <div className="space-y-2 pl-7">
                      <p className="text-gray-800">{formatDate(selectedInterview.date)}</p>
                      <p className="text-gray-800">{selectedInterview.time}</p>
                      {selectedInterview.status === 'upcoming' && (
                        <p className="text-blue-600 text-sm font-medium mt-1">
                          {getDaysUntil(selectedInterview.date)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium">Location</h3>
                    </div>
                    <div className="space-y-2 pl-7">
                      <p className="text-gray-800">{selectedInterview.location}</p>
                      {selectedInterview.location.includes("Online") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                        >
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Required Documents</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterview.documents.map((doc, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        <FileText className="h-3 w-3 mr-1.5" />
                        {doc}
                      </Badge>
                    ))}
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
              
              <div className="flex justify-end space-x-4 mt-6">
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
    </div>
  );
};

// Interview List Component
const InterviewList = ({ 
  interviews, 
  expandedInterview, 
  toggleExpand, 
  handleConfirmClick,
  handleInterviewClick,
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
    <div className="divide-y divide-gray-200">
      {interviews.map(interview => (
        <div key={interview.id} className="hover:bg-gray-50 transition duration-150">
          <div className="p-4 cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-1/3 mb-3 md:mb-0">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(interview.status, interview.confirmed)}
                  <span className="text-sm font-medium text-gray-500">
                    {interview.round}
                  </span>
                  {interview.status === 'upcoming' && (
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                      {getDaysUntil(interview.date)}
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium text-gray-900 mt-2 text-lg">
                  {interview.companyName}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  {interview.position}
                </div>
              </div>
              
              <div className="md:w-1/3 flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-6 mb-3 md:mb-0">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {formatDate(interview.date)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {interview.time}
                  </span>
                </div>
              </div>
              
              <div className="md:w-1/6 flex items-center mb-3 md:mb-0">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  {interview.location}
                </span>
              </div>
              
              <div className="md:w-1/6 flex items-center justify-end space-x-3">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmClick(interview.id);
                    }}
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
            </div>
          </div>
          
          {expandedInterview === interview.id && (
            <div className="px-4 pb-4 pt-1 bg-gray-50">
              <div className="border-t border-gray-200 pt-3">
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
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InterviewScheduler;