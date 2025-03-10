import React, { useState } from 'react';
import { Search, AlertCircle, Bell, MessageSquare, Clock, Filter, Check, X, ChevronDown, Tag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Button,
  Textarea
} from './UIComponents';
import Sidebar from './Sidebar';
// Sample initial data
const initialQueries = [
  {
    id: 1,
    studentId: "2021CS001",
    studentName: "John Smith",
    query: "Need help with interview preparation for upcoming Google interview",
    status: "pending",
    label: "interview",
    priority: "urgent",
    timestamp: "2024-02-24T10:30:00",
    responses: []
  },
  {
    id: 2,
    studentId: "2021CS045",
    studentName: "Sarah Johnson",
    query: "Unable to access the placement portal",
    status: "resolved",
    label: "operational",
    priority: "normal",
    timestamp: "2024-02-23T15:45:00",
    responses: [
      {
        id: 1,
        message: "Please clear your browser cache and try again. If the issue persists, please provide screenshots.",
        timestamp: "2024-02-23T16:00:00",
        adminName: "Admin"
      }
    ]
  },
  {
    id: 3,
    studentId: "2021CS078",
    studentName: "Mike Brown",
    query: "Need urgent clarification about tomorrow's Microsoft interview timing",
    status: "in-progress",
    label: "interview",
    priority: "urgent",
    timestamp: "2024-02-24T09:15:00",
    responses: [
      {
        id: 1,
        message: "Hi Mike, I'm checking with the company. Will get back to you shortly.",
        timestamp: "2024-02-24T09:20:00",
        adminName: "Admin"
      }
    ]
  }
];

const QueryManagement = () => {
  const [queries, setQueries] = useState(initialQueries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLabel, setFilterLabel] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [notifications, setNotifications] = useState([]);


  // Filtering logic
    const filteredQueries = queries.filter(query => {
        const matchesSearch = 
        query.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.query.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLabel = filterLabel === 'all' || !filterLabel || query.label === filterLabel;
        const matchesPriority = filterPriority === 'all' || !filterPriority || query.priority === filterPriority;
        const matchesStatus = filterStatus === 'all' || !filterStatus || query.status === filterStatus;
    
        return matchesSearch && matchesLabel && matchesPriority && matchesStatus;
    });

  // Priority badge color mapping
  const priorityColors = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    normal: 'bg-blue-100 text-blue-800',
    low: 'bg-gray-100 text-gray-800'
  };

  // Label badge color mapping
  const labelColors = {
    interview: 'bg-purple-100 text-purple-800',
    operational: 'bg-green-100 text-green-800',
    technical: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800'
  };

  // Status badge color mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  };

  const handleResponse = () => {
    if (!responseText.trim()) return;

    const newResponse = {
      id: Date.now(),
      message: responseText,
      timestamp: new Date().toISOString(),
      adminName: "Admin"
    };

    setQueries(queries.map(query => 
      query.id === selectedQuery.id 
        ? {
            ...query,
            responses: [...query.responses, newResponse],
            status: 'in-progress'
          }
        : query
    ));

    showNotification(`Response sent to ${selectedQuery.studentName}`);
    setResponseText('');
    setIsResponseModalOpen(false);
  };

  const handleMarkAsResolved = (queryId) => {
    setQueries(queries.map(query =>
      query.id === queryId
        ? { ...query, status: 'resolved' }
        : query
    ));
    showNotification('Query marked as resolved');
  };

  const showNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  return (
    <div className="flex">
      <Sidebar />
    <div className="min-h-screen w-full bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Alert key={notification.id} className="bg-white shadow-lg w-72">
            <Bell className="h-4 w-4" />
            <div className="ml-2">{notification.message}</div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="absolute right-2 top-2"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student Query Management</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Queries</p>
                  <p className="text-2xl font-bold">{queries.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">
                    {queries.filter(q => q.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold">
                    {queries.filter(q => q.status === 'in-progress').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold">
                    {queries.filter(q => q.status === 'resolved').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student ID, name, or query..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
          {/* Label Filter */}
        <Select value={filterLabel} onValueChange={setFilterLabel}>
        <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Label" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All Labels</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
        </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filterPriority} onValueChange={setFilterPriority}>
        <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Priority" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
        </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
        </Select>
          </div>
        </div>

        {/* Queries Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{query.studentName}</p>
                        <p className="text-sm text-gray-500">{query.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-md truncate">{query.query}</p>
                      {query.responses.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {query.responses.length} response(s)
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${labelColors[query.label]}`}>
                          {query.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[query.priority]}`}>
                          {query.priority}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[query.status]}`}>
                        {query.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">
                        {new Date(query.timestamp).toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedQuery(query);
                            setIsResponseModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        {query.status !== 'resolved' && (
                          <button
                            onClick={() => handleMarkAsResolved(query.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Response Modal */}
        <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Respond to Query</DialogTitle>
              <DialogDescription>
                <div className="mt-4">
                  <p className="font-medium">{selectedQuery?.studentName}</p>
                  <p className="text-sm text-gray-500">{selectedQuery?.studentId}</p>
                  <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedQuery?.query}
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
              
            {/* Previous Responses */}
            {selectedQuery?.responses.length > 0 && (
              <div className="mt-4 space-y-4">
                <h4 className="font-medium text-gray-900">Previous Responses</h4>
                <div className="max-h-48 overflow-y-auto space-y-3">
                  {selectedQuery.responses.map((response) => (
                    <div key={response.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{response.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(response.timestamp).toLocaleString()} by {response.adminName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsResponseModalOpen(false);
                  setResponseText('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResponse}
                disabled={!responseText.trim()}
              >
                Send Response
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* No Results Message */}
        {filteredQueries.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No queries found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default QueryManagement;