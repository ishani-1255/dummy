import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Briefcase, ChevronDown, ChevronRight, Check, AlertCircle, FileText } from 'lucide-react';

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
      confirmed: true
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
      confirmed: false
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
      confirmed: true
    }
  ]);

  const [expandedInterview, setExpandedInterview] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [interviewToConfirm, setInterviewToConfirm] = useState(null);

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
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Check size={14} className="mr-1" />
          Confirmed
        </span>
      ) : (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <AlertCircle size={14} className="mr-1" />
          Confirmation Needed
        </span>
      );
    } else if (status === 'completed') {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Check size={14} className="mr-1" />
          Completed
        </span>
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar size={24} className="mr-2" />
            Interview Scheduler
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Your Interviews</h2>
          </div>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'upcoming' 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'completed' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {/* Interviews List */}
        <div className="space-y-4">
          {sortedInterviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Calendar size={32} className="text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900">No interviews found</h3>
            </div>
          ) : (
            sortedInterviews.map(interview => (
              <div 
                key={interview.id} 
                className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4 ${
                  interview.status === 'upcoming' && !interview.confirmed
                    ? 'border-l-yellow-400' 
                    : interview.status === 'upcoming'
                    ? 'border-l-green-500'
                    : 'border-l-blue-500'
                } hover:shadow-md transition-all duration-200`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(interview.id)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(interview.status, interview.confirmed)}
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                          {interview.round}
                        </span>
                        {interview.status === 'upcoming' && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                            {getDaysUntil(interview.date)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900">{interview.companyName}</h3>
                      <p className="text-indigo-600 font-medium text-sm">{interview.position}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-gray-700 text-sm">
                          <Calendar size={16} className="mr-2 text-indigo-500" />
                          <span>{formatDate(interview.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <Clock size={16} className="mr-2 text-indigo-500" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                      
                      <div className="mt-1 flex items-center text-gray-700 text-sm">
                        <MapPin size={16} className="mr-2 text-indigo-500" />
                        <span>{interview.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {interview.status === 'upcoming' && !interview.confirmed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmClick(interview.id);
                          }}
                          className="mr-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Confirm
                        </button>
                      )}
                      
                      <div className="bg-gray-100 p-2 rounded-full">
                        {expandedInterview === interview.id ? (
                          <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedInterview === interview.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Required Documents</h4>
                      <ul className="space-y-2">
                        {interview.documents.map((doc, index) => (
                          <li key={index} className="flex items-center text-gray-700 text-sm">
                            <FileText size={14} className="text-indigo-500 mr-2" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Confirm Interview Attendance</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to confirm your attendance for this interview?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmInterview(interviewToConfirm)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
