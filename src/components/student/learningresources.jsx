import React, { useState, useEffect } from 'react';
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
} from "../admin/UIComponents";
import { Check, X, Bell, Calendar, Clock, Info, FileText, BookOpen, Award, AlertCircle, ChevronDown, ChevronRight, BookmarkIcon } from 'lucide-react';

const LearningResource = () => {
  // State for quiz data and UI components
  const [view, setView] = useState('dashboard'); // 'dashboard', 'form', 'quiz', or 'results'
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({
    score: 0,
    totalQuestions: 0,
    feedback: []
  });
  const [filter, setFilter] = useState('all'); // 'all', 'inProgress', 'completed'
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New JavaScript quiz available! Test your skills.", read: false, timestamp: new Date().toISOString() },
    { id: 2, message: "You completed 3 quizzes this week. Great job!", read: false, timestamp: new Date(Date.now() - 86400000).toISOString() }
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
      description: "Master the core concepts of JavaScript including data types, functions, and control flow.",
      tags: ["Programming", "Web Development"]
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
      description: "Learn Python fundamentals including syntax, data structures, and functions.",
      tags: ["Programming", "Data Science"]
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
      description: "Understand React core concepts including components, props, and state management.",
      tags: ["Programming", "Web Development", "Frontend"]
    }
  ]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showSaveQuizModal, setShowSaveQuizModal] = useState(false);

  // Hardcoded quiz data for demo purposes
  const quizData = {
    "JavaScript": [
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
      {
        id: 3,
        question: "Which function is used to parse a string to an integer in JavaScript?",
        options: ["Integer.parse()", "parseInteger()", "parseInt()", "Number.parseInt()"],
        correctAnswer: "parseInt()",
        explanation: "parseInt() is the standard function to convert a string to an integer in JavaScript."
      },
      {
        id: 4,
        question: "What is the output of console.log(typeof [])?",
        options: ["array", "object", "undefined", "null"],
        correctAnswer: "object",
        explanation: "In JavaScript, arrays are a type of object, so typeof [] returns 'object'."
      },
      {
        id: 5,
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: "push()",
        explanation: "push() adds elements to the end of an array, while pop() removes from the end, shift() removes from the beginning, and unshift() adds to the beginning."
      }
    ],
    "Python": [
      {
        id: 1,
        question: "What is the correct way to create a function in Python?",
        options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"],
        correctAnswer: "def myFunc():",
        explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses."
      },
      {
        id: 2,
        question: "Which of the following is a mutable data type in Python?",
        options: ["String", "Tuple", "List", "Integer"],
        correctAnswer: "List",
        explanation: "Lists in Python are mutable, meaning they can be changed after creation. Strings, tuples, and integers are immutable."
      },
      {
        id: 3,
        question: "What is the output of print(3 // 2) in Python 3?",
        options: ["1.5", "1", "1.0", "Error"],
        correctAnswer: "1",
        explanation: "The // operator in Python 3 is floor division, which returns the largest integer less than or equal to the result."
      },
      {
        id: 4,
        question: "How do you access the value of a dictionary with key 'name'?",
        options: ["dictionary.name", "dictionary[name]", "dictionary.get('name')", "dictionary['name']"],
        correctAnswer: "dictionary['name']",
        explanation: "Dictionary values are accessed using square brackets with the key name in quotes."
      },
      {
        id: 5,
        question: "What does the 'len()' function do in Python?",
        options: ["Returns the length of a string", "Returns the length of a list", "Returns the length of a tuple", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "The len() function returns the number of items in various types of objects like strings, lists, tuples, and dictionaries."
      }
    ],
    "React": [
      {
        id: 1,
        question: "What function allows you to update state in React?",
        options: ["this.state()", "this.setState()", "this.updateState()", "this.changeState()"],
        correctAnswer: "this.setState()",
        explanation: "setState() is the correct method for updating state in class components. In functional components, you would use the setter function from useState()."
      },
      {
        id: 2,
        question: "What hook is used to perform side effects in function components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: "useEffect",
        explanation: "useEffect is the hook designed for performing side effects like data fetching, subscriptions, or DOM manipulation."
      },
      {
        id: 3,
        question: "In React, how do you pass data from parent to child?",
        options: ["Using context", "Using state", "Using props", "Using refs"],
        correctAnswer: "Using props",
        explanation: "Props (properties) are used to pass data from parent components to child components in React."
      },
      {
        id: 4,
        question: "What method is called when a component is first rendered?",
        options: ["componentDidMount", "componentWillMount", "render", "constructor"],
        correctAnswer: "constructor",
        explanation: "The constructor is the first method called during initialization of a class component, followed by render and then componentDidMount."
      },
      {
        id: 5,
        question: "What is the virtual DOM in React?",
        options: [
          "A direct copy of the browser's DOM", 
          "A lightweight copy of the real DOM", 
          "A virtual reality version of the DOM", 
          "A DOM that only exists in memory"
        ],
        correctAnswer: "A lightweight copy of the real DOM",
        explanation: "The virtual DOM is a lightweight JavaScript representation of the DOM used by React for performance optimization."
      }
    ]
  };

  // Quiz statistics
  const stats = {
    totalQuizzes: quizzes.length,
    inProgress: quizzes.filter(q => q.status === 'inProgress').length,
    completed: quizzes.filter(q => q.status === 'completed').length,
    totalQuestions: quizzes.reduce((acc, quiz) => acc + quiz.totalQuestions, 0),
    totalCompleted: quizzes.reduce((acc, quiz) => acc + quiz.questionsCompleted, 0)
  };

  // Generate questions based on topic and count
  const generateQuiz = () => {
    if (!topic || !questionCount) return;
    
    const availableTopics = Object.keys(quizData);
    const closestTopic = availableTopics.find(t => 
      t.toLowerCase() === topic.toLowerCase()) || availableTopics[0];
    
    const allQuestions = quizData[closestTopic] || quizData[availableTopics[0]];
    const count = Math.min(parseInt(questionCount), allQuestions.length);
    
    // Get a random subset of questions if there are more available than requested
    let selectedQuestions = [...allQuestions];
    if (allQuestions.length > count) {
      selectedQuestions = selectedQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    }
    
    setCurrentQuestions(selectedQuestions);
    setUserAnswers({});
    setView('quiz');

    // Add notification
    addNotification(`New quiz on ${closestTopic} with ${count} questions started!`);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };

  // Submit quiz and calculate results
  const submitQuiz = () => {
    const feedback = [];
    let score = 0;
    
    currentQuestions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      
      if (isCorrect) score++;
      
      feedback.push({
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    });
    
    setResults({
      score,
      totalQuestions: currentQuestions.length,
      feedback
    });
    
    setView('results');
    setShowSaveQuizModal(true);

    // Add notification
    addNotification(`Quiz completed! You scored ${score}/${currentQuestions.length}`);
  };

  // Reset to dashboard view
  const startOver = () => {
    setTopic('');
    setQuestionCount('');
    setView('dashboard');
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
      lastAttempted: new Date().toISOString().split('T')[0],
      status: results.score === results.totalQuestions ? 'completed' : 'inProgress',
      favorite: false,
      description: `Quiz on ${topic} concepts and fundamentals.`,
      tags: [topic, "Quiz"]
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
      timestamp: new Date().toISOString()
    };
    
    setNotifications([...notifications, newNotification]);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === id ? {...quiz, favorite: !quiz.favorite} : quiz
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    return quiz.status === filter;
  });

  // Sort quizzes (inProgress first, then by last attempted date)
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (a.status === 'inProgress' && b.status !== 'inProgress') return -1;
    if (a.status !== 'inProgress' && b.status === 'inProgress') return 1;
    return new Date(b.lastAttempted) - new Date(a.lastAttempted);
  });

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Get status badge
  const getStatusBadge = (status, progress) => {
    if (status === 'inProgress') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>In Progress - {progress}%</span>
        </Badge>
      );
    } else if (status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
          <Check className="w-3 h-3" />
          <span>Completed</span>
        </Badge>
      );
    }
    return null;
  };

  // Dashboard view
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Notification */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Learning Resources
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
                  Total Quizzes
                </p>
                <p className="text-3xl font-bold mt-1">{stats.totalQuizzes}</p>
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
                  In Progress
                </p>
                <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
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
                  Completion Rate
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.totalQuestions > 0 ? Math.round((stats.totalCompleted / stats.totalQuestions) * 100) : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Quiz Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setView('form')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create New Quiz
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
            <div className="border-b">
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-lg font-medium text-gray-800">
                  Your Quizzes
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
                  value="inProgress"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
                >
                  In Progress
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
              <QuizList 
                quizzes={sortedQuizzes} 
                expandedQuiz={expandedQuiz}
                toggleExpand={toggleExpand}
                handleQuizClick={handleQuizClick}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                toggleFavorite={toggleFavorite}
              />
            </TabsContent>
            <TabsContent value="inProgress" className="mt-0 pt-0">
              <QuizList 
                quizzes={sortedQuizzes} 
                expandedQuiz={expandedQuiz}
                toggleExpand={toggleExpand}
                handleQuizClick={handleQuizClick}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                toggleFavorite={toggleFavorite}
              />
            </TabsContent>
            <TabsContent value="completed" className="mt-0 pt-0">
              <QuizList 
                quizzes={sortedQuizzes} 
                expandedQuiz={expandedQuiz}
                toggleExpand={toggleExpand}
                handleQuizClick={handleQuizClick}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                toggleFavorite={toggleFavorite}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  // Form view
  const renderForm = () => (
    <div className="p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => setView('dashboard')}
      >
        Back to Dashboard
      </Button>
      <div className="bg-white rounded-lg shadow-md max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Create New Quiz</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Topic
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="....."
            min="1"
            max="50"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
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
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">
            Quiz: {topic}
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {Object.keys(userAnswers).length}/{currentQuestions.length} Answered
          </span>
        </div>
        
        {currentQuestions.map((q, index) => (
          <div key={q.id} className="mb-8 p-4 border rounded-lg bg-gray-50">
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
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={startOver}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
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
    <div className="p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => setView('dashboard')}
      >
        Back to Dashboard
      </Button>
      <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Quiz Results</h2>
          <div className="text-5xl font-bold mb-2">
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={startOver}
          >
            Create New Quiz
          </Button>
        </div>
      </div>
    </div>
  );

  // Quiz list component
  const QuizList = ({ 
    quizzes, 
    expandedQuiz, 
    toggleExpand, 
    handleQuizClick, 
    formatDate, 
    getStatusBadge,
    toggleFavorite
  }) => {
    return (
      <div className="divide-y">
        {quizzes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No quizzes found.
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="hover:bg-gray-50">
              <div 
                onClick={() => toggleExpand(quiz.id)}
                className="px-6 py-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
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
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {quiz.questionsCompleted}/{quiz.totalQuestions} Questions
                        </Badge>
                        {getStatusBadge(quiz.status, quiz.progress)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last attempted: {formatDate(quiz.lastAttempted)}
                  </div>
                </div>
              </div>
              
              {expandedQuiz === quiz.id && (
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      {quiz.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quiz.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
        <div className="flex-1">
        {view === 'dashboard' && renderDashboard()}
        {view === 'form' && renderForm()}
        {view === 'quiz' && renderQuiz()}
        {view === 'results' && renderResults()}
      </div>

      {/* Quiz Details Modal */}
      <Dialog open={showQuizDetails} onOpenChange={setShowQuizDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title}</DialogTitle>
            <DialogDescription>
              {selectedQuiz?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Last attempted: {selectedQuiz && formatDate(selectedQuiz.lastAttempted)}
                </span>
              </div>
              <div>
                {selectedQuiz && getStatusBadge(selectedQuiz.status, selectedQuiz.progress)}
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
                <Badge key={index} variant="secondary" className="bg-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Quiz Results</DialogTitle>
            <DialogDescription>
              Would you like to save your quiz results to your dashboard?
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-blue-50 rounded-md">
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
          <div className="flex justify-end space-x-2">
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