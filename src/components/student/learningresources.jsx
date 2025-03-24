import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Clock,
  Check,
  Award,
  Search,
  Bell,
  X,
  Info,
  Calendar,
  ChevronDown,
  ChevronRight,
  BookmarkIcon,
  Menu,
  Plus,
  Filter,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "./Sidebar";

// Status Badge Component
const StatusBadge = ({ status, progress }) => {
  const statusColors = {
    inProgress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  };

  const statusIcons = {
    inProgress: <Clock className="h-4 w-4 mr-1" />,
    completed: <Check className="h-4 w-4 mr-1" />,
  };

  return (
    <span
      className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status]
      }`}
    >
      {statusIcons[status]}
      {status === "inProgress" ? `In Progress - ${progress}%` : "Completed"}
    </span>
  );
};

// Badge Component
const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
};

// Card Component
const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

// Card Content Component
const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Card Header Component
const CardHeader = ({ children, className = "" }) => {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
};

// Card Title Component
const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-medium ${className}`}>{children}</h3>;
};

// Button Component
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) => {
  const baseStyles = "rounded-md font-medium inline-flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100",
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-2 h-9 w-9",
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

// Dialog Component
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {children}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

// Alert Component
const Alert = ({ children, variant = "info", className = "" }) => {
  const variantStyles = {
    info: "bg-blue-50 text-blue-700",
    warning: "bg-yellow-50 text-yellow-700",
    success: "bg-green-50 text-green-700",
    error: "bg-red-50 text-red-700",
  };

  return (
    <div className={`p-4 rounded-md ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);

// Main Component
const LearningResource = () => {
  // State for quiz data and UI components
  const [view, setView] = useState("dashboard"); // 'dashboard', 'form', 'quiz', or 'results'
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({
    score: 0,
    totalQuestions: 0,
    feedback: [],
  });
  const [filter, setFilter] = useState("all"); // 'all', 'inProgress', 'completed'
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New JavaScript quiz available! Test your skills.",
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      message: "You completed 3 quizzes this week. Great job!",
      read: false,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      progress: 75,
      questionsCompleted: 15,
      totalQuestions: 20,
      lastAttempted: "2025-03-15",
      status: "inProgress",
      favorite: true,
      description:
        "Master the core concepts of JavaScript including data types, functions, and control flow.",
      tags: ["Programming", "Web Development"],
    },
    {
      id: 2,
      title: "Python Basics",
      progress: 100,
      questionsCompleted: 25,
      totalQuestions: 25,
      lastAttempted: "2025-03-10",
      status: "completed",
      favorite: false,
      description:
        "Learn Python fundamentals including syntax, data structures, and functions.",
      tags: ["Programming", "Data Science"],
    },
    {
      id: 3,
      title: "React Essentials",
      progress: 40,
      questionsCompleted: 8,
      totalQuestions: 20,
      lastAttempted: "2025-03-18",
      status: "inProgress",
      favorite: true,
      description:
        "Understand React core concepts including components, props, and state management.",
      tags: ["Programming", "Web Development", "Frontend"],
    },
  ]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showSaveQuizModal, setShowSaveQuizModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Quiz data
  const quizData = {
    JavaScript: [
      {
        id: 1,
        question: "Which of the following is not a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Object"],
        correctAnswer: "Float",
        explanation: "Float is not a separate data type in JavaScript. Number includes both integers and floating-point numbers."
      },
      {
        id: 2,
        question: "What does the '===' operator do in JavaScript?",
        options: ["Checks equality of value", "Checks equality of value and type", "Assigns a value", "None of these"],
        correctAnswer: "Checks equality of value and type",
        explanation: "The strict equality operator '===' checks both value and type, unlike '==' which only checks value."
      },
      // More questions...
    ],
    Python: [
      {
        id: 1,
        question: "What is the correct way to create a function in Python?",
        options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"],
        correctAnswer: "def myFunc():",
        explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses."
      },
      // More questions...
    ],
    React: [
      {
        id: 1,
        question: "What function allows you to update state in React?",
        options: ["this.state()", "this.setState()", "this.updateState()", "this.changeState()"],
        correctAnswer: "this.setState()",
        explanation: "setState() is the correct method for updating state in class components. In functional components, you would use the setter function from useState()."
      },
      // More questions...
    ],
  };

  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalQuizzes: quizzes.length,
      inProgress: quizzes.filter((q) => q.status === "inProgress").length,
      completed: quizzes.filter((q) => q.status === "completed").length,
      totalQuestions: quizzes.reduce((acc, quiz) => acc + quiz.totalQuestions, 0),
      totalCompleted: quizzes.reduce(
        (acc, quiz) => acc + quiz.questionsCompleted,
        0
      ),
    };
  }, [quizzes]);

  // Filtering quizzes
  const filteredQuizzes = useMemo(() => {
    let filtered = [...quizzes];
    
    if (filter !== "all") {
      filtered = filtered.filter((quiz) => quiz.status === filter);
    }
    
    // Sort: in progress first, then by date
    return filtered.sort((a, b) => {
      if (a.status === "inProgress" && b.status !== "inProgress") return -1;
      if (a.status !== "inProgress" && b.status === "inProgress") return 1;
      return new Date(b.lastAttempted) - new Date(a.lastAttempted);
    });
  }, [quizzes, filter]);

  // Generate questions based on topic and count
  const generateQuiz = () => {
    if (!topic || !questionCount) return;

    const availableTopics = Object.keys(quizData);
    const closestTopic =
      availableTopics.find(
        (t) => t.toLowerCase() === topic.toLowerCase()
      ) || availableTopics[0];

    const allQuestions = quizData[closestTopic] || quizData[availableTopics[0]];
    const count = Math.min(parseInt(questionCount), allQuestions.length);

    // Get a random subset of questions
    let selectedQuestions = [...allQuestions];
    if (allQuestions.length > count) {
      selectedQuestions = selectedQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    }

    setCurrentQuestions(selectedQuestions);
    setUserAnswers({});
    setView("quiz");

    // Add notification
    addNotification(`New quiz on ${closestTopic} with ${count} questions started!`);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    });
  };

  // Submit quiz and calculate results
  const submitQuiz = () => {
    const feedback = [];
    let score = 0;

    currentQuestions.forEach((q) => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) score++;

      feedback.push({
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    setResults({
      score,
      totalQuestions: currentQuestions.length,
      feedback,
    });

    setView("results");
    setShowSaveQuizModal(true);

    // Add notification
    addNotification(`Quiz completed! You scored ${score}/${currentQuestions.length}`);
  };

  // Reset to dashboard view
  const startOver = () => {
    setTopic("");
    setQuestionCount("");
    setView("dashboard");
  };

  // Toggle expand quiz details
  const toggleExpand = (id) => {
    if (expandedQuiz === id) {
      setExpandedQuiz(null);
    } else {
      setExpandedQuiz(id);
    }
  };

  // Handle quiz click to show details
  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizDetails(true);
  };

  // Save quiz result
  const saveQuizResult = () => {
    const newQuiz = {
      id: quizzes.length + 1,
      title: `${topic} Quiz`,
      progress: (results.score / results.totalQuestions) * 100,
      questionsCompleted: results.score,
      totalQuestions: results.totalQuestions,
      lastAttempted: new Date().toISOString().split("T")[0],
      status: results.score === results.totalQuestions ? "completed" : "inProgress",
      favorite: false,
      description: `Quiz on ${topic} concepts and fundamentals.`,
      tags: [topic, "Quiz"],
    };

    setQuizzes([...quizzes, newQuiz]);
    setShowSaveQuizModal(false);
    addNotification(`Quiz results saved to your dashboard!`);
  };

  // Add notification
  const addNotification = (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      read: false,
      timestamp: new Date().toISOString(),
    };

    setNotifications([...notifications, newNotification]);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setQuizzes(
      quizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, favorite: !quiz.favorite } : quiz
      )
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 max-w-md w-full">
            <h3 className="font-bold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error
            </h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header with Notification */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
        Explore & Learn
        </h1>
        <div className="flex items-center space-x-2">
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
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <Card className="mb-6">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Notifications</CardTitle>
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
                      <Info
                        className={`h-5 w-5 mt-0.5 ${
                          notification.read ? "text-gray-400" : "text-blue-500"
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
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Quizzes
                </p>
                <p className="text-2xl font-bold mt-1">{stats.totalQuizzes}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  In Progress
                </p>
                <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
              </div>
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed
                </p>
                <p className="text-2xl font-bold mt-1">{stats.completed}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalQuestions > 0
                    ? Math.round(
                        (stats.totalCompleted / stats.totalQuestions) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Quiz Button */}
      <div className="mb-6">
        <Button
          onClick={() => setView("form")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Quiz
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <div className="border-b border-gray-200">
          <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
            <h2 className="text-lg font-medium text-gray-800">
              Your Quizzes
            </h2>
          </div>
          <div className="px-4 md:px-6 pb-2 flex space-x-6">
            <button
              onClick={() => setFilter("all")}
              className={`pb-2 px-1 font-medium text-sm ${
                filter === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("inProgress")}
              className={`pb-2 px-1 font-medium text-sm ${
                filter === "inProgress"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`pb-2 px-1 font-medium text-sm ${
                filter === "completed"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Quiz List */}
        <div className="divide-y">
          {filteredQuizzes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No quizzes found</p>
              <p className="text-sm mt-1">
                {filter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first quiz to get started"}
              </p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="hover:bg-gray-50">
                <div
                  onClick={() => toggleExpand(quiz.id)}
                  className="px-4 md:px-6 py-4 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div>
                        {expandedQuiz === quiz.id ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          {quiz.title}
                          {quiz.favorite && (
                            <BookmarkIcon
                              className="ml-2 h-4 w-4 text-yellow-500"
                              fill="currentColor"
                            />
                          )}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-800">
                            {quiz.questionsCompleted}/{quiz.totalQuestions} Questions
                          </Badge>
                          <StatusBadge status={quiz.status} progress={quiz.progress} />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 ml-8 sm:ml-0">
                      Last attempted: {formatDate(quiz.lastAttempted)}
                    </div>
                  </div>
                </div>

                {expandedQuiz === quiz.id && (
                  <div className="px-4 md:px-6 pb-4 ml-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-3">{quiz.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quiz.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-200 text-gray-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuizClick(quiz);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(quiz.id);
                          }}
                        >
                          {quiz.favorite ? "Remove Favorite" : "Add to Favorites"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Mobile Add Quiz Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setView("form")}
            className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );

  // Form view
  const renderForm = () => (
    <div className="p-4 sm:p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => setView("dashboard")}
      >
        Back to Dashboard
      </Button>
      <div className="bg-white rounded-lg shadow-md max-w-md mx-auto p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-700">Create New Quiz</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Topic
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. JavaScript, Python, React"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a number"
            min="1"
            max="50"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          onClick={generateQuiz}
          disabled={!topic || !questionCount}
        >
          Generate Quiz
        </Button>
      </div>
    </div>
  );

  // Quiz view
  const renderQuiz = () => (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700">
            Quiz: {topic}
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {Object.keys(userAnswers).length}/{currentQuestions.length} Answered
          </span>
        </div>
        
        {currentQuestions.map((q, index) => (
          <div key={q.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <p className="font-medium text-lg mb-3">
              {index + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option) => (
                <div 
                  key={option} 
                  className={`p-3 rounded-md cursor-pointer transition duration-200 ${
                    userAnswers[q.id] === option 
                      ? 'bg-blue-200 border-blue-300 border' 
                      : 'bg-white border hover:bg-gray-100'
                  }`}
                  onClick={() => handleAnswerSelect(q.id, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button variant="outline" onClick={startOver}>
            Cancel
          </Button>
          <Button
            onClick={submitQuiz}
            disabled={Object.keys(userAnswers).length !== currentQuestions.length}
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );

  // Results view
  const renderResults = () => (
    <div className="p-4 sm:p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => setView("dashboard")}
      >
        Back to Dashboard
      </Button>
      <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">Quiz Results</h2>
          <div className="text-4xl sm:text-5xl font-bold mb-2">
            {results.score}/{results.totalQuestions}
          </div>
          <div className="text-lg text-gray-600">
            {results.score === results.totalQuestions 
              ? "Perfect score! Excellent work!" 
              : results.score > results.totalQuestions / 2 
                ? "Good job! Keep practicing to improve further." 
                : "Keep practicing! You'll improve with more study."}
          </div>
        </div>
        
        <div className="space-y-6">
          {results.feedback.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <p className="font-medium mb-2">{index + 1}. {item.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className={`p-2 rounded ${
                  item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <span className="font-medium">Your answer:</span> {item.userAnswer}
                </div>
                {!item.isCorrect && (
                  <div className="p-2 rounded bg-green-100 text-green-800">
                    <span className="font-medium">Correct answer:</span> {item.correctAnswer}
                  </div>
                )}
              </div>
              <div className="p-3 bg-blue-50 rounded text-sm">
                <span className="font-medium">Explanation:</span> {item.explanation}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <Button
            className="w-full"
            onClick={startOver}
          >
            Create New Quiz
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for larger screens */}
        <Sidebar />

      {/* Mobile header */}
      <div className="md:hidden bg-white p-4 fixed top-0 left-0 right-0 flex items-center justify-between border-b z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Learning Resources</h1>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      <main className="flex-1 overflow-y-auto pt-0 md:pt-0">
        <div className="md:mt-0 mt-16">
          {view === "dashboard" && renderDashboard()}
          {view === "form" && renderForm()}
          {view === "quiz" && renderQuiz()}
          {view === "results" && renderResults()}
        </div>
      </main>

      {/* Modals */}
      <Dialog open={showQuizDetails} onOpenChange={setShowQuizDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title}</DialogTitle>
            <DialogDescription>
              {selectedQuiz?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Last attempted: {selectedQuiz && formatDate(selectedQuiz.lastAttempted)}
                </span>
              </div>
              <div>
                {selectedQuiz && (
                  <StatusBadge 
                    status={selectedQuiz.status} 
                    progress={selectedQuiz.progress} 
                  />
                )}
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-medium mb-2">Progress</h4>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${selectedQuiz?.progress || 0}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {selectedQuiz?.questionsCompleted || 0} of {selectedQuiz?.totalQuestions || 0} questions completed ({selectedQuiz?.progress || 0}%)
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedQuiz?.tags.map((tag, index) => (
                <Badge key={index} className="bg-gray-200 text-gray-800">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowQuizDetails(false)}
            >
              Close
            </Button>
            <Button>
              Continue Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Quiz Modal */}
      <Dialog open={showSaveQuizModal} onOpenChange={setShowSaveQuizModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Quiz Results</DialogTitle>
            <DialogDescription>
              Would you like to save your quiz results to your dashboard?
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-blue-50 rounded-md mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Score:</p>
                <p className="text-2xl font-bold">{results.score}/{results.totalQuestions}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Percentage:</p>
                <p className="text-2xl font-bold">{Math.round((results.score / results.totalQuestions) * 100)}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSaveQuizModal(false)}
            >
              Don't Save
            </Button>
            <Button onClick={saveQuizResult}>
              Save Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningResource;