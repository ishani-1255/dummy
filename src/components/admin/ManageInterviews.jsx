"use client";

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit2, Trash2, ChevronDown, ChevronRight, Bell, Calendar, Clock, MapPin, Users, Building, Briefcase, CheckCircle, XCircle, Mail, Phone, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardHeader1,
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

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    department: '',
    interviewId: null
  });

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteModal.department && deleteModal.interviewId) {
      setDepartments(prev => prev.map(dept => {
        if (dept.code === deleteModal.department) {
          return {
            ...dept,
            companies: dept.companies.filter(company => company.id !== deleteModal.interviewId)
          };
        }
        return dept;
      }));
      showNotification("Interview deleted successfully", "success");
      setDeleteModal({ isOpen: false, department: '', interviewId: null });
    }
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => (
    <Dialog open={deleteModal.isOpen} onOpenChange={(open) => setDeleteModal(prev => ({ ...prev, isOpen: open }))}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-gray-600 mb-4">Are you sure you want to delete this interview? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false, department: '', interviewId: null })}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

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
      type,
      icon: type === 'success' ? CheckCircle : type === 'error' ? XCircle : Bell
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const statusColors = {
      Scheduled: 'bg-green-100 text-green-800 border-green-300',
      Completed: 'bg-blue-100 text-blue-800 border-blue-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <Card className="transform transition-all pt-8 duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 border-blue-500 w-[500px]">
        <CardContent className="">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{company.name}</h3>
                <div className="flex items-center text-gray-600 mt-2">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <p className="text-base">{company.role}</p>
                </div>
              </div>
            </div>
            <span className={`px-6 py-2 rounded-full text-base font-medium border ${statusColors[company.status]}`}>
              {company.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                <span className="text-base">{new Date(company.dateTime).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-blue-600" />
                <span className="text-base">{new Date(company.dateTime).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                <span className="text-base">{company.location}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <span className="text-base">{company.package}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <h4 className="font-medium text-lg text-gray-800 mb-3">Requirements</h4>
            <p className="text-base text-gray-600 leading-relaxed">{company.requirements}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg text-gray-800">Interview Rounds</h4>
            <div className="grid grid-cols-2 gap-4">
              {company.rounds.map((round, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-base font-medium text-blue-800">{round.name}</p>
                  <p className="text-sm text-blue-600 mt-2">{round.duration}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-lg text-gray-800 mb-4">Contact Person</h4>
            <div className="bg-gray-50 p-6 rounded-xl text-base space-y-3">
              <p className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                {company.contactPerson.name}
              </p>
              <p className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-blue-600" />
                {company.contactPerson.email}
              </p>
              <p className="flex items-center text-gray-700">
                <Phone className="h-5 w-5 mr-3 text-blue-600" />
                {company.contactPerson.phone}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center">
                  <Edit2 className="h-5 w-5 mr-2" />
                  <span>Edit</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Edit Interview Details</DialogTitle>
                </DialogHeader>
                <InterviewForm
                  initialData={company}
                  department={department}
                  onSubmit={(formData) => {
                    handleInterviewSubmit(formData);
                    setIsEditDialogOpen(false);
                    showNotification('Interview details updated successfully', 'success');
                  }}
                />
              </DialogContent>
            </Dialog>
            
            <button
              onClick={() => setDeleteModal({
                isOpen: true,
                department: department,
                interviewId: company.id
              })}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              <span>Delete</span>
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
                <Alert
                  key={notification.id}
                  variant={notification.type}
                  className="w-96 flex items-start space-x-3"
                >
                  <notification.icon className="h-5 w-5 mt-0.5" />
                  <div>
                    <AlertTitle>
                      {notification.type === 'success' ? 'Success' :
                       notification.type === 'error' ? 'Error' :
                       'Notification'}
                    </AlertTitle>
                    <AlertDescription>{notification.message}</AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
            <DeleteConfirmationModal />
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
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <button
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                          <DialogHeader>
                                            <DialogTitle>Edit Interview Details</DialogTitle>
                                          </DialogHeader>
                                          <InterviewForm
                                            initialData={company}
                                            department={dept.code}
                                            onSubmit={(formData) => {
                                              handleInterviewSubmit(formData);
                                              showNotification('Interview details updated successfully', 'success');
                                            }}
                                          />
                                        </DialogContent>
                                      </Dialog>
                                      <button
                                        onClick={() => setDeleteModal({
                                          isOpen: true,
                                          department: dept.code,
                                          interviewId: company.id
                                        })}
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