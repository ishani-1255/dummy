import React, { useState } from 'react';

const PracticeCorner = () => {
  // States for different views and data
  const [view, setView] = useState('form'); // 'form', 'quiz', or 'results'
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({
    score: 0,
    totalQuestions: 0,
    feedback: []
  });

  // Hardcoded quiz data for demo purposes
  const sampleQuizData = {
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

  // Generate questions based on topic and count
  const generateQuiz = () => {
    if (!topic || !questionCount) return;
    
    const availableTopics = Object.keys(sampleQuizData);
    const closestTopic = availableTopics.find(t => 
      t.toLowerCase() === topic.toLowerCase()) || availableTopics[0];
    
    const allQuestions = sampleQuizData[closestTopic] || sampleQuizData[availableTopics[0]];
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
  };

  // Reset to form view
  const startOver = () => {
    setTopic('');
    setQuestionCount('');
    setView('form');
  };

  // Form view
  const renderForm = () => (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Practice Corner</h2>
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
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        onClick={generateQuiz}
        disabled={!topic || !questionCount}
      >
        Generate Quiz
      </button>
    </div>
  );

  // Quiz view
  const renderQuiz = () => (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
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
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
          onClick={startOver}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          onClick={submitQuiz}
          disabled={Object.keys(userAnswers).length !== currentQuestions.length}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );

  // Results view
  const renderResults = () => (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
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
              item.isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p className="font-medium mb-2">{index + 1}. {item.question}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Your Answer:</p>
                <p className={item.isCorrect ? 'font-medium text-green-700' : 'font-medium text-red-700'}>
                  {item.userAnswer || 'No answer'}
                </p>
              </div>
              
              {!item.isCorrect && (
                <div>
                  <p className="text-sm text-gray-500">Correct Answer:</p>
                  <p className="font-medium text-green-700">{item.correctAnswer}</p>
                </div>
              )}
            </div>
            
            <div className="bg-white p-3 rounded border text-sm">
              <p className="font-medium text-gray-700">Explanation:</p>
              <p className="text-gray-600">{item.explanation}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          onClick={startOver}
        >
          Practice Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        {view === 'form' && renderForm()}
        {view === 'quiz' && renderQuiz()}
        {view === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default PracticeCorner;
