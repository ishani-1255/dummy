import React, { useState, useMemo, useEffect } from 'react';
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
  Menu,
  Bookmark as BookmarkIcon
} from 'lucide-react';

// UI Component imports
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
  TooltipTrigger
} from "../admin/UIComponents";
import Sidebar from './Sidebar';

// Query Card component for mobile view
const QueryCard = ({ 
  query, 
  formatDate, 
  getStatusBadge, 
  toggleFavorite,
  handleQueryClick
}) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-base flex items-center">
              {query.title}
              {query.favorite && (
                <BookmarkIcon 
                  className="ml-2 h-4 w-4 text-yellow-500" 
                  fill="currentColor" 
                />
              )}
            </h3>
            <div className="mt-1 text-xs text-gray-500">
              {formatDate(query.date)}
            </div>
          </div>
          {getStatusBadge(query.status)}
        </div>
        
        <div className="mt-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {query.category}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {query.description}
        </p>
        
        <div className="flex justify-between">
          <Button 
            size="sm" 
            onClick={() => handleQueryClick(query)}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(query.id);
            }}
          >
            {query.favorite ? "Remove Favorite" : "Favorite"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Query Detail Modal Component
const QueryDetailModal = ({ isOpen, onClose, query, formatDate, getStatusBadge, newReply, setNewReply, handleSubmitReply }) => {
  if (!isOpen || !query) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8">{query.title}</DialogTitle>
          <DialogDescription>
            Category: {query.category}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Submitted on: {formatDate(query.date)}
              </span>
            </div>
            <div>
              {getStatusBadge(query.status)}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-medium mb-2">Details</h4>
            <p className="text-gray-700 whitespace-pre-wrap">
              {query.description}
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Replies ({query.replies.length || 0})</h4>
            {query.replies.length > 0 ? (
              query.replies.map(reply => (
                <div 
                  key={reply.id} 
                  className={`p-4 rounded-lg ${
                    reply.isAdmin 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      reply.isAdmin 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      <User size={14} />
                    </div>
                    <div>
                      <div className="font-medium">{reply.author}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(reply.date)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No replies yet</p>
            )}
          </div>
          
          {/* Reply Form */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Type your reply..."
                className="flex-grow p-3 border-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={() => handleSubmitReply(query.id)}
                disabled={!newReply.trim()}
                variant={newReply.trim() ? "default" : "secondary"}
                className="rounded-none"
              >
                <Send size={16} className="mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Query List component with expandable sections
const QueryList = ({ 
  queries, 
  expandedQuery, 
  toggleExpand, 
  handleQueryClick, 
  formatDate, 
  getStatusBadge,
  toggleFavorite,
  newReply,
  setNewReply,
  handleSubmitReply,
  setShowNewQueryForm,
  isMobile
}) => {
  if (queries.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No queries found</h3>
        <p className="mt-2 text-gray-500 max-w-md mx-auto text-sm">
          Try adjusting your search or filters, or ask a new question
        </p>
        <Button
          onClick={() => setShowNewQueryForm(true)}
          className="mt-5"
        >
          <Plus size={18} className="mr-2" />
          Ask a Question
        </Button>
      </div>
    );
  }

  // For mobile view, render cards
  if (isMobile) {
    return (
      <div className="space-y-3">
        {queries.map((query) => (
          <QueryCard
            key={query.id}
            query={query}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            toggleFavorite={toggleFavorite}
            handleQueryClick={handleQueryClick}
          />
        ))}
      </div>
    );
  }

  // For desktop view, render expandable list
  return (
    <div className="divide-y">
      {queries.map((query) => (
        <div key={query.id} className="hover:bg-gray-50">
          <div 
            onClick={() => toggleExpand(query.id)}
            className="px-4 py-3 md:px-6 md:py-4 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div>
                  {expandedQuery === query.id ? (
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
                {formatDate(query.date)}
              </div>
            </div>
          </div>
          
          {expandedQuery === query.id && (
            <div className="px-4 pb-4 md:px-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                  {query.description}
                </p>
                <div className="flex flex-wrap gap-2">
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
                      toggleFavorite(query.id);
                    }}
                  >
                    {query.favorite ? "Remove Favorite" : "Add to Favorites"}
                  </Button>
                </div>
              </div>
              
              {/* Preview of replies if any */}
              {query.replies.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Replies ({query.replies.length}):
                  </h4>
                  <div 
                    className={`p-4 rounded-lg ${
                      query.replies[query.replies.length-1].isAdmin 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        query.replies[query.replies.length-1].isAdmin 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        <User size={14} />
                      </div>
                      <div>
                        <div className="font-medium">{query.replies[query.replies.length-1].author}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(query.replies[query.replies.length-1].date)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap line-clamp-2">
                      {query.replies[query.replies.length-1].content}
                    </p>
                    {query.replies.length > 1 && (
                      <p className="text-sm text-blue-600 mt-2">
                        + {query.replies.length - 1} more {query.replies.length - 1 === 1 ? 'reply' : 'replies'}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Reply Form */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                  <input
                    type="text"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-grow p-3 border-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleSubmitReply(query.id)}
                    disabled={!newReply.trim()}
                    variant={newReply.trim() ? "default" : "secondary"}
                    className="rounded-none"
                  >
                    <Send size={16} className="mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StudentQuerySystem = () => {
  const [queries, setQueries] = useState([
    {
      id: 1,
      title: "Interview preparation resources for Tech Innovators Inc.",
      description: "Are there any specific resources or practice materials available for the upcoming Tech Innovators Inc. technical interviews? I'm particularly looking for algorithm practice and system design materials.",
      category: "Interview Preparation",
      status: "answered",
      date: "2025-03-10",
      favorite: true,
      replies: [
        {
          id: 101,
          isAdmin: true,
          author: "Placement Officer",
          content: "Yes, we've uploaded technical interview preparation materials to the placement portal. You'll find algorithm practice sets and system design case studies specific to Tech Innovators Inc. in the 'Resources' section. Additionally, we've scheduled a mock interview session on March 15th.",
          date: "2025-03-11"
        }
      ]
    },
    {
      id: 2,
      title: "Dress code for Global Finance Corp interviews",
      description: "What is the appropriate dress code for the Global Finance Corp interviews next week? Should we wear formal business attire or is business casual acceptable?",
      category: "Interview Process",
      status: "pending",
      date: "2025-03-12",
      favorite: false,
      replies: []
    },
    {
      id: 3,
      title: "Resume verification before submission",
      description: "I've updated my resume with recent project experience. Could someone from the placement cell verify it before I submit it to Creative Solutions Ltd? I want to make sure it meets their requirements.",
      category: "Documents",
      status: "in-progress",
      date: "2025-03-13",
      favorite: true,
      replies: [
        {
          id: 201,
          isAdmin: true,
          author: "Resume Advisor",
          content: "I've received your resume and will review it. Please allow 24 hours for feedback. Generally, Creative Solutions Ltd looks for detailed project descriptions and specific design tools you've worked with.",
          date: "2025-03-13"
        }
      ]
    }
  ]);

  const [newQuery, setNewQuery] = useState({
    title: '',
    description: '',
    category: 'General'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have a new response to your interview preparation query.", read: false, timestamp: new Date().toISOString() },
    { id: 2, message: "Reminder: Resume submission deadline is tomorrow.", read: false, timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]);

  const categories = ['General', 'Interview Preparation', 'Documents', 'Interview Process', 'Job Offers', 'Technical'];

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Query statistics
  const stats = useMemo(() => {
    return {
      totalQueries: queries.length,
      pending: queries.filter(q => q.status === 'pending').length,
      inProgress: queries.filter(q => q.status === 'in-progress').length,
      answered: queries.filter(q => q.status === 'answered').length,
      totalReplies: queries.reduce((acc, query) => acc + query.replies.length, 0)
    };
  }, [queries]);

  const handleInputChange = (e) => {
    setNewQuery({
      ...newQuery,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitQuery = (e) => {
    e.preventDefault();
    const newQueryObj = {
      id: queries.length + 1,
      ...newQuery,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      favorite: false,
      replies: []
    };
    
    setQueries([newQueryObj, ...queries]);
    setNewQuery({
      title: '',
      description: '',
      category: 'General'
    });
    setShowNewQueryForm(false);
    addNotification(`Your query about "${newQuery.title}" has been submitted successfully.`);
  };

  const handleSubmitReply = (queryId) => {
    if (newReply.trim() === '') return;
    
    const updatedQueries = queries.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          replies: [
            ...query.replies,
            {
              id: Date.now(),
              isAdmin: false,
              author: "You",
              content: newReply,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return query;
    });
    
    setQueries(updatedQueries);
    setNewReply('');
    
    // Close modal if replying from modal
    if (showQueryDetails) {
      setShowQueryDetails(false);
      setSelectedQuery(null);
    }
  };

  const filteredQueries = useMemo(() => {
    return queries.filter(query => {
      const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           query.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || query.category === filterCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [queries, searchTerm, filterStatus, filterCategory]);

  // Sort queries (pending first, then in-progress, then by date)
  const sortedQueries = useMemo(() => {
    return [...filteredQueries].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      if (a.status === 'in-progress' && b.status === 'answered') return -1;
      if (a.status === 'answered' && b.status === 'in-progress') return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [filteredQueries]);

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>Awaiting Response</span>
        </Badge>
      );
    } else if (status === 'in-progress') {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1 text-xs">
          <Clock className="w-3 h-3" />
          <span>In Progress</span>
        </Badge>
      );
    } else if (status === 'answered') {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center space-x-1 text-xs">
          <CheckCircle className="w-3 h-3" />
          <span>Answered</span>
        </Badge>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Toggle expanded query details
  const toggleExpand = (id) => {
    setExpandedQuery(expandedQuery === id ? null : id);
  };

  // Handle query click to show details modal
  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setShowQueryDetails(true);
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setQueries(queries.map(query => 
      query.id === id ? {...query, favorite: !query.favorite} : query
    ));
  };

  // Add notification
  const addNotification = (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />

      {/* Mobile sidebar */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white p-4 flex items-center justify-between border-b shadow-sm z-10">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold">Ask Queries</h1>
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
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Desktop Header */}
            {!isMobile && (
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Ask Queries
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
                  >
                    <Plus size={18} className="mr-2" />
                    Ask a Question
                  </Button>
                </div>
              </div>
            )}
            
            {/* Notification Panel */}
            {showNotifications && (
              <Card className="mb-4 md:mb-6 border border-gray-200 shadow-sm">
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
                          className={`p-3 rounded-md ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                        >
                          <div className="flex items-start space-x-2">
                            <MessageSquare className={`h-5 w-5 mt-0.5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
              <Card>
                <CardContent className="p-3 md:pt-6 md:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Total Queries
                      </p>
                      <p className="text-xl md:text-3xl font-bold mt-1">{stats.totalQueries}</p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:pt-6 md:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Awaiting Response
                      </p>
                      <p className="text-xl md:text-3xl font-bold mt-1">{stats.pending}</p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:pt-6 md:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        In Progress
                      </p>
                      <p className="text-xl md:text-3xl font-bold mt-1">{stats.inProgress}</p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:pt-6 md:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Answered
                      </p>
                      <p className="text-xl md:text-3xl font-bold mt-1">{stats.answered}</p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Search and Filters */}
            <Card className="mb-4 md:mb-6 shadow-sm">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col space-y-3">
                  {/* Search bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search queries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                  
                  {/* Filter button */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center px-3 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                      <Filter size={16} className="mr-2" />
                      Filters
                      <ChevronDown size={14} className={`ml-2 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
                    </Button>
                    
                    {isMobile && (
                      <Button
                        onClick={() => setShowNewQueryForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
                      >
                        <Plus size={16} className="mr-2" />
                        Ask
                      </Button>
                    )}
                  </div>
                  
                  {/* Expanded filter options */}
                  {showFilters && (
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                        >
                          <option value="all">Choose Status</option>
                          <option value="pending">Awaiting Response</option>
                          <option value="in-progress">In Progress</option>
                          <option value="answered">Answered</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                        >
                          <option value="all">Choose Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* New Query Form Modal */}
            <Dialog open={showNewQueryForm} onOpenChange={setShowNewQueryForm}>
              <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>New Query</DialogTitle>
                  <DialogDescription>
                    Submit your question or concern to the placement office.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmitQuery}>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Query Title</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={newQuery.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
                  
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewQueryForm(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                    >
                      Submit Query
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Queries List with Tabs */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-0">
                <Tabs defaultValue="all" onValueChange={setFilterStatus} className="w-full">
                  <div className="border-b">
                    <div className="px-4 pt-4 pb-2 md:px-6 md:pt-6">
                      <h2 className="text-base md:text-lg font-medium text-gray-800">
                        Your Queries
                      </h2>
                    </div>
                    <TabsList className="w-full bg-transparent border-b border-gray-100 pl-4 md:pl-6 rounded-none overflow-x-auto flex-nowrap">
                      <TabsTrigger 
                        value="all" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none whitespace-nowrap"
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pending"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none whitespace-nowrap"
                      >
                        Awaiting Response
                      </TabsTrigger>
                      <TabsTrigger 
                        value="in-progress"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none whitespace-nowrap"
                      >
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger 
                        value="answered"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none whitespace-nowrap"
                      >
                        Answered
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
                      newReply={newReply}
                      setNewReply={setNewReply}
                      handleSubmitReply={handleSubmitReply}
                      setShowNewQueryForm={setShowNewQueryForm}
                      isMobile={isMobile}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-0 pt-0">
                    <QueryList 
                      queries={sortedQueries.filter(q => q.status === 'pending')} 
                      expandedQuery={expandedQuery}
                      toggleExpand={toggleExpand}
                      handleQueryClick={handleQueryClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      toggleFavorite={toggleFavorite}
                      newReply={newReply}
                      setNewReply={setNewReply}
                      handleSubmitReply={handleSubmitReply}
                      setShowNewQueryForm={setShowNewQueryForm}
                      isMobile={isMobile}
                    />
                  </TabsContent>
                  
                  <TabsContent value="in-progress" className="mt-0 pt-0">
                    <QueryList 
                      queries={sortedQueries.filter(q => q.status === 'in-progress')} 
                      expandedQuery={expandedQuery}
                      toggleExpand={toggleExpand}
                      handleQueryClick={handleQueryClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      toggleFavorite={toggleFavorite}
                      newReply={newReply}
                      setNewReply={setNewReply}
                      handleSubmitReply={handleSubmitReply}
                      setShowNewQueryForm={setShowNewQueryForm}
                      isMobile={isMobile}
                    />
                  </TabsContent>
                  
                  <TabsContent value="answered" className="mt-0 pt-0">
                    <QueryList 
                      queries={sortedQueries.filter(q => q.status === 'answered')} 
                      expandedQuery={expandedQuery}
                      toggleExpand={toggleExpand}
                      handleQueryClick={handleQueryClick}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      toggleFavorite={toggleFavorite}
                      newReply={newReply}
                      setNewReply={setNewReply}
                      handleSubmitReply={handleSubmitReply}
                      setShowNewQueryForm={setShowNewQueryForm}
                      isMobile={isMobile}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating button for mobile */}
      {isMobile && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setShowNewQueryForm(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Plus size={24} />
          </Button>
        </div>
      )}
      
      {/* Query Details Modal */}
      <QueryDetailModal 
        isOpen={showQueryDetails} 
        onClose={() => setShowQueryDetails(false)} 
        query={selectedQuery}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        newReply={newReply}
        setNewReply={setNewReply}
        handleSubmitReply={handleSubmitReply}
      />
    </div>
  );
};

export default StudentQuerySystem;