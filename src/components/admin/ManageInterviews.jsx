"use client";

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit2, Trash2, ChevronDown, ChevronRight, Bell, Calendar, Clock, MapPin, Users } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  
} from "./UIComponents";
import Sidebar from "./Sidebar";

// Utility function for merging classnames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Alert Components
const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-gray-100 border-gray-200 text-gray-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
const ManageInterview = () => {
  // State for departments and their interviews
  const [departments, setDepartments] = useState([
    {
      name: "Computer Science",
      code: "CS",
      companies: [
        {
          id: "1",
          name: "Tech Corp",
          role: "Software Engineer",
          package: "12 LPA",
          dateTime: "2024-02-15T10:00",
          location: "Virtual",
          requirements: "CGPA > 7.5, No active backlogs",
          status: "Scheduled",
          eligibleBranches: ["CS", "IT"],
          rounds: [
            { name: "Technical", duration: "1 hour" },
            { name: "HR", duration: "30 mins" }
          ],
          contactPerson: {
            name: "John Doe",
            email: "john@techcorp.com",
            phone: "+1234567890"
          }
        }
      ]
    },
    {
      name: "Information Technology",
      code: "IT",
      companies: []
    },
    {
      name: "Electronics",
      code: "ECE",
      companies: []
    }
  ]);

  // State for expanded departments
  const [expandedDepts, setExpandedDepts] = useState({});
  
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // State for interview modal
  const [interviewModal, setInterviewModal] = useState({
    isOpen: false,
    type: '',
    department: '',
    data: null
  });

  // State for filters
  const [filters, setFilters] = useState({
    searchQuery: '',
    department: '',
    status: '',
    dateRange: '',
    location: ''
  });

  // State for view mode
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Toggle department expansion
  const toggleDepartment = (deptName) => {
    setExpandedDepts(prev => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    const newNotification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  };

  // Handle interview scheduling/editing
  const handleInterviewSubmit = (formData) => {
    const { department, ...interviewData } = formData;
    
    if (interviewModal.type === 'add') {
      setDepartments(prev => prev.map(dept => {
        if (dept.code === department) {
          return {
            ...dept,
            companies: [...dept.companies, { 
              id: Date.now().toString(), 
              ...interviewData,
              status: 'Scheduled'
            }]
          };
        }
        return dept;
      }));
      showNotification(`Interview scheduled for ${interviewData.name}`);
      // Simulate sending notification email
      console.log(`Sending email notification to students of ${department} department`);
    } else {
      setDepartments(prev => prev.map(dept => {
        if (dept.code === department) {
          return {
            ...dept,
            companies: dept.companies.map(company => 
              company.id === interviewData.id ? { ...interviewData } : company
            )
          };
        }
        return dept;
      }));
      showNotification(`Interview updated for ${interviewData.name}`);
    }
    
    setInterviewModal({ isOpen: false, type: '', department: '', data: null });
  };

  // Delete interview
  const deleteInterview = (deptCode, interviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this interview?");
    if (confirmDelete) {
      setDepartments(prev => prev.map(dept => {
        if (dept.code === deptCode) {
          return {
            ...dept,
            companies: dept.companies.filter(company => company.id !== interviewId)
          };
        }
        return dept;
      }));
      showNotification("Interview deleted successfully");
    }
  };

  // Update interview status
  const updateInterviewStatus = (deptCode, interviewId, newStatus) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.code === deptCode) {
        return {
          ...dept,
          companies: dept.companies.map(company => 
            company.id === interviewId 
              ? { ...company, status: newStatus }
              : company
          )
        };
      }
      return dept;
    }));
    showNotification(`Interview status updated to ${newStatus}`);
  };

  // Interview Form Component
  const InterviewForm = ({ initialData, department, onSubmit }) => {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      role: '',
      package: '',
      dateTime: '',
      location: '',
      requirements: '',
      eligibleBranches: [],
      rounds: [{ name: '', duration: '' }],
      contactPerson: {
        name: '',
        email: '',
        phone: ''
      }
    });

    const addRound = () => {
      setFormData(prev => ({
        ...prev,
        rounds: [...prev.rounds, { name: '', duration: '' }]
      }));
    };

    const removeRound = (index) => {
      setFormData(prev => ({
        ...prev,
        rounds: prev.rounds.filter((_, i) => i !== index)
      }));
    };

    const updateRound = (index, field, value) => {
      setFormData(prev => ({
        ...prev,
        rounds: prev.rounds.map((round, i) => 
          i === index ? { ...round, [field]: value } : round
        )
      }));
    };

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...formData, department });
      }} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Package</label>
            <input
              type="text"
              value={formData.package}
              onChange={(e) => setFormData(prev => ({ ...prev, package: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Interview Rounds</h3>
            <button
              type="button"
              onClick={addRound}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Round
            </button>
          </div>
          {formData.rounds.map((round, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Round Name"
                  value={round.name}
                  onChange={(e) => updateRound(index, 'name', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Duration"
                  value={round.duration}
                  onChange={(e) => updateRound(index, 'duration', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              {formData.rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRound(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Person Name</label>
            <input
              type="text"
              value={formData.contactPerson.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactPerson: { ...prev.contactPerson, name: e.target.value }
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.contactPerson.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactPerson: { ...prev.contactPerson, email: e.target.value }
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <input
              type="tel"
              value={formData.contactPerson.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactPerson: { ...prev.contactPerson, phone: e.target.value }
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setInterviewModal({ isOpen: false, type: '', department: '', data: null })}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {interviewModal.type === 'add' ? 'Schedule Interview' : 'Update Interview'}
          </button>
        </div>
      </form>
    );
  };

  // Filter interviews
  const getFilteredInterviews = (companies) => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                          company.role.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesStatus = !filters.status || company.status === filters.status;
      const matchesLocation = !filters.location || company.location.toLowerCase().includes(filters.location.toLowerCase());
      return matchesSearch && matchesStatus && matchesLocation;
    });
  };

  // Interview Card Component
  const InterviewCard = ({ company, department }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{company.name}</h3>
              <p className="text-gray-600">{company.role}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              company.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
              company.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {company.status}
            </span>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(company.dateTime).toLocaleDateString()}
              <Clock className="h-4 w-4 ml-4 mr-2" />
              {new Date(company.dateTime).toLocaleTimeString()}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {company.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {company.package}
            </div>
          </div>

          <div className="mt-4">
          <h4 className="font-medium mb-2">Requirements</h4>
            <p className="text-gray-600 text-sm">{company.requirements}</p>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Interview Rounds</h4>
            <div className="space-y-2">
              {company.rounds.map((round, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-600">
                  <span>{round.name}</span>
                  <span>{round.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Contact Person</h4>
            <div className="text-sm text-gray-600">
              <p>{company.contactPerson.name}</p>
              <p>{company.contactPerson.email}</p>
              <p>{company.contactPerson.phone}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setInterviewModal({
                isOpen: true,
                type: 'edit',
                department: department,
                data: company
              })}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteInterview(department, company.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {notifications.map(notification => (
                <Alert key={notification.id} className={`w-80 ${
                  notification.type === 'success' ? 'bg-green-50 border-green-200' :
                  notification.type === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <AlertTitle className={
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }>
                    {notification.type === 'success' ? 'Success' :
                     notification.type === 'error' ? 'Error' :
                     'Notification'}
                  </AlertTitle>
                  <AlertDescription className="text-gray-600">
                    {notification.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>

            {/* Header Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Manage Interviews</CardTitle>
                  <Dialog>
                    <DialogTrigger>
                      <button
                        onClick={() => setInterviewModal({ isOpen: true, type: 'add', department: '', data: null })}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>Schedule Interview</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {interviewModal.type === 'add' ? 'Schedule New Interview' : 'Edit Interview'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Department</label>
                          <select
                            value={interviewModal.department}
                            onChange={(e) => setInterviewModal(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept.code} value={dept.code}>{dept.name}</option>
                            ))}
                          </select>
                        </div>
                        {interviewModal.department && (
                          <InterviewForm
                            initialData={interviewModal.data}
                            department={interviewModal.department}
                            onSubmit={handleInterviewSubmit}
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by company or role..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    />
                  </div>
                  <select
                    className="border rounded-lg p-2"
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.code} value={dept.code}>{dept.name}</option>
                    ))}
                  </select>
                  <select
                    className="border rounded-lg p-2"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <select
                    className="border rounded-lg p-2"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  >
                    <option value="">All Locations</option>
                    <option value="Virtual">Virtual</option>
                    <option value="On-Campus">On-Campus</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    Card View
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Department Cards */}
            <div className="space-y-4">
              {departments.map((dept) => (
                <Card key={dept.name}>
                  <CardHeader>
                    <button
                      onClick={() => toggleDepartment(dept.name)}
                      className="w-full flex items-center justify-between text-left font-semibold"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{dept.name}</span>
                        <span className="text-sm text-gray-500">({dept.companies.length} companies)</span>
                      </div>
                      {expandedDepts[dept.name] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </CardHeader>
                  {expandedDepts[dept.name] && (
                    <CardContent>
                      {viewMode === 'table' ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Package</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Requirements</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getFilteredInterviews(dept.companies).map((company) => (
                                <TableRow key={company.id}>
                                  <TableCell>{company.name}</TableCell>
                                  <TableCell>{company.role}</TableCell>
                                  <TableCell>{company.package}</TableCell>
                                  <TableCell>
                                    {new Date(company.dateTime).toLocaleDateString()} {new Date(company.dateTime).toLocaleTimeString()}
                                  </TableCell>
                                  <TableCell>{company.location}</TableCell>
                                  <TableCell>{company.requirements}</TableCell>
                                  <TableCell>
                                    <select
                                      value={company.status}
                                      onChange={(e) => updateInterviewStatus(dept.code, company.id, e.target.value)}
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        company.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                                        company.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      <option value="Scheduled">Scheduled</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => setInterviewModal({
                                          isOpen: true,
                                          type: 'edit',
                                          department: dept.code,
                                          data: company
                                        })}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteInterview(dept.code, company.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getFilteredInterviews(dept.companies).map((company) => (
                            <InterviewCard
                              key={company.id}
                              company={company}
                              department={dept.code}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInterview;