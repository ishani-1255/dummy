import React, { useState } from 'react';
import { MessageSquare, Search, AlertCircle, CheckCircle, Clock, ChevronDown, X, Send, User, Filter, Plus } from 'lucide-react';

const StudentQuerySystem = () => {
  const [queries, setQueries] = useState([
    {
      id: 1,
      title: "Interview preparation resources for Tech Innovators Inc.",
      description: "Are there any specific resources or practice materials available for the upcoming Tech Innovators Inc. technical interviews? I'm particularly looking for algorithm practice and system design materials.",
      category: "Interview Preparation",
      status: "answered",
      date: "2025-03-10",
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
      replies: []
    },
    {
      id: 3,
      title: "Resume verification before submission",
      description: "I've updated my resume with recent project experience. Could someone from the placement cell verify it before I submit it to Creative Solutions Ltd? I want to make sure it meets their requirements.",
      category: "Documents",
      status: "in-progress",
      date: "2025-03-13",
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
  const [activeQueryId, setActiveQueryId] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['General', 'Interview Preparation', 'Documents', 'Interview Process', 'Job Offers', 'Technical'];
  const statusFilters = ['all', 'pending', 'in-progress', 'answered'];

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
      replies: []
    };
    
    setQueries([newQueryObj, ...queries]);
    setNewQuery({
      title: '',
      description: '',
      category: 'General'
    });
    setShowNewQueryForm(false);
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
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         query.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || query.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'answered':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return 'Awaiting Response';
      case 'in-progress':
        return 'In Progress';
      case 'answered':
        return 'Answered';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare size={24} className="mr-3" />
            <h1 className="text-2xl font-bold">Ask Queries</h1>
          </div>
          <button
            onClick={() => setShowNewQueryForm(true)}
            className="flex items-center justify-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Ask a Question
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 mb-4 md:mb-0 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 md:ml-2"
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  <option value="all">Choose Status</option>
                  <option value="pending">Awaiting Response</option>
                  <option value="in-progress">In Progress</option>
                  <option value="answered">Answered</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  <option value="all">Choose Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
        
        {/* New Query Form */}
        {showNewQueryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-800">New Query</h2>
                <button 
                  onClick={() => setShowNewQueryForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
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
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewQueryForm(false)}
                    className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 shadow-md"
                  >
                    Submit Query
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Queries List */}
        <div className="space-y-5">
          {filteredQueries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={36} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">No queries found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">Try adjusting your search or filters, or ask a new question</p>
              <button
                onClick={() => setShowNewQueryForm(true)}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Ask a Question
              </button>
            </div>
          ) : (
            filteredQueries.map(query => (
              <div key={query.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-200">
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setActiveQueryId(activeQueryId === query.id ? null : query.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 text-xs rounded-full flex items-center ${
                          query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          query.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getStatusIcon(query.status)}
                          <span className="ml-1 font-medium">{getStatusText(query.status)}</span>
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 text-xs rounded-full font-medium">
                          {query.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-700 transition">{query.title}</h3>
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      {new Date(query.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <p className="mt-3 text-gray-600 line-clamp-2">{query.description}</p>
                  
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-blue-600 font-medium">{query.replies.length} {query.replies.length === 1 ? 'reply' : 'replies'}</span>
                    <ChevronDown size={16} className={`ml-1 transition-transform ${activeQueryId === query.id ? 'transform rotate-180' : ''} text-blue-600`} />
                    <span className="ml-auto text-sm text-gray-500 hover:text-blue-600 transition">
                      {activeQueryId === query.id ? 'Collapse' : 'View details'}
                    </span>
                  </div>
                </div>
                
                {activeQueryId === query.id && (
                  <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Original Query:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{query.description}</p>
                    </div>
                    
                    {query.replies.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Responses:</h4>
                        {query.replies.map(reply => (
                          <div 
                            key={reply.id} 
                            className={`p-5 rounded-lg ${
                              reply.isAdmin 
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 shadow-sm' 
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center mb-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                                reply.isAdmin 
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                                  : 'bg-gray-200 text-gray-700'
                              }`}>
                                <User size={16} />
                              </div>
                              <div>
                                <div className="font-medium">{reply.author}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(reply.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply Form */}
                    <div className="mt-4">
                      <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <input
                          type="text"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="Type your reply..."
                          className="flex-grow p-3 border-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleSubmitReply(query.id)}
                          disabled={!newReply.trim()}
                          className={`flex items-center px-5 py-3 ${
                            newReply.trim() 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Send size={16} className="mr-2" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQuerySystem;
