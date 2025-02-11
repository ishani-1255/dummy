import React, { useState, useMemo } from 'react';
import { Search, Bell, AlertCircle, Filter, ChevronDown, ChevronRight, X } from 'lucide-react';
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
import Sidebar from './Sidebar';

const EnhancedStudentSearch = () => {
  
  const [departments, setDepartmentsData] = useState([
    {
      name: "Computer Science",
      code: "CS",
      students: [
        { 
          id: "CS001", 
          name: "Aditya Sharma", 
          roll: "2021CSBA001", 
          cgpa: 3.8, 
          feePaid: true, 
          placed: true, 
          backlog: 1,
          attendance: 85,
          semester: 6,
          contactNumber: "+91-9876543210",
          parentContact: "+91-9876543211",
          activeQueries: []
        },
        { 
          id: "CS002", 
          name: "Sneha Verma", 
          roll: "2021CSBA002", 
          cgpa: 3.9, 
          feePaid: true, 
          placed: false, 
          backlog: 0,
          attendance: 90,
          semester: 6,
          contactNumber: "+91-9876543220",
          parentContact: "+91-9876543221",
          activeQueries: []
        },
      ]
    },
    {
      name: "Electronics and Communication",
      code: "EC",
      students: [
        { 
          id: "EC001", 
          name: "Rahul Das", 
          roll: "2021ECBA001", 
          cgpa: 3.6, 
          feePaid: false, 
          placed: false, 
          backlog: 2,
          attendance: 75,
          semester: 6,
          contactNumber: "+91-9876543230",
          parentContact: "+91-9876543231",
          activeQueries: []
        },
        { 
          id: "EC002", 
          name: "Pooja Nair", 
          roll: "2021ECBA002", 
          cgpa: 4.0, 
          feePaid: true, 
          placed: true, 
          backlog: 0,
          attendance: 95,
          semester: 6,
          contactNumber: "+91-9876543240",
          parentContact: "+91-9876543241",
          activeQueries: []
        },
      ]
    },
    {
      name: "Mechanical Engineering",
      code: "ME",
      students: [
        { 
          id: "ME001", 
          name: "Vikram Singh", 
          roll: "2021MEBA001", 
          cgpa: 3.2, 
          feePaid: true, 
          placed: false, 
          backlog: 3,
          attendance: 70,
          semester: 6,
          contactNumber: "+91-9876543250",
          parentContact: "+91-9876543251",
          activeQueries: []
        },
        { 
          id: "ME002", 
          name: "Anjali Menon", 
          roll: "2021MEBA002", 
          cgpa: 3.7, 
          feePaid: true, 
          placed: true, 
          backlog: 0,
          attendance: 88,
          semester: 6,
          contactNumber: "+91-9876543260",
          parentContact: "+91-9876543261",
          activeQueries: []
        },
      ]
    }
  ]);
  
    

  const [expandedDepts, setExpandedDepts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [selectedView, setSelectedView] = useState('departments');
  const [filters, setFilters] = useState({
    searchQuery: '',
    department: '',
    feeStatus: '',
    placementStatus: '',
    cgpaRange: '',
    backlog: '',
    attendanceRange: ''
  });

  const [queryModal, setQueryModal] = useState({
    isOpen: false,
    student: null,
    selectedColumn: ''
  });

  const columnOptions = [
    { value: 'cgpa', label: 'CGPA' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'feePaid', label: 'Fee Status' }
  ];

  const toggleDepartment = (deptName) => {
    setExpandedDepts(prev => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };
  
    // Update raiseQuery function to properly handle state
    const raiseQuery = (student, column) => {
      const newQuery = {
        id: Date.now(),
        field: column,
        status: 'pending',
        date: new Date().toISOString(),
        value: student[column]
      };
  
      // Update departments data with new query
      setDepartmentsData(prevDepartments => 
        prevDepartments.map(dept => ({
          ...dept,
          students: dept.students.map(s => {
            if (s.id === student.id) {
              return {
                ...s,
                activeQueries: [...s.activeQueries, newQuery]
              };
            }
            return s;
          })
        }))
      );
  
      showNotification(`Query raised for ${student.name}'s ${column}`);
      setQueryModal({ isOpen: false, student: null, selectedColumn: '' });
      setSelectedView('queries');
    };
    const resolveQuery = (studentId, queryId) => {
      setDepartmentsData(prevDepartments => 
        prevDepartments.map(dept => ({
          ...dept,
          students: dept.students.map(student => {
            if (student.id === studentId) {
              const updatedQueries = student.activeQueries.filter(q => q.id !== queryId);
              showNotification(`Query resolved for ${student.name}`);
              return {
                ...student,
                activeQueries: updatedQueries
              };
            }
            return student;
          })
        }))
      );
    };

  const showNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  };

  const filteredDepartments = useMemo(() => {
    return departments.map(dept => ({
      ...dept,
      students: dept.students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                            student.roll.toLowerCase().includes(filters.searchQuery.toLowerCase());
        const matchesDepartment = !filters.department || dept.code === filters.department;
        const matchesFeeStatus = !filters.feeStatus || 
          (filters.feeStatus === 'paid' ? student.feePaid : !student.feePaid);
        const matchesPlacement = !filters.placementStatus || 
          (filters.placementStatus === 'placed' ? student.placed : !student.placed);
        const matchesCGPA = !filters.cgpaRange || (
          filters.cgpaRange === 'above3.5' ? student.cgpa >= 3.5 :
          filters.cgpaRange === '3.0-3.5' ? (student.cgpa >= 3.0 && student.cgpa < 3.5) :
          student.cgpa < 3.0
        );
        const matchesBacklog = !filters.backlog || student.backlog === parseInt(filters.backlog);
        
        return matchesSearch && matchesDepartment && matchesFeeStatus && 
               matchesPlacement && matchesCGPA && matchesBacklog;
      })
    }));
  }, [departments, filters]);
  // Update the queries view to use departmentsData
  const renderQueriesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Roll No.</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Field</TableHead>
          <TableHead>Current Value</TableHead>
          <TableHead>Date Raised</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.flatMap(dept =>
          dept.students.flatMap(student =>
            student.activeQueries.map(query => (
              <TableRow key={query.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.roll}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{query.field}</TableCell>
                <TableCell>
                  {query.field === 'feePaid' 
                    ? (student[query.field] ? 'Paid' : 'Unpaid')
                    : student[query.field]}
                </TableCell>
                <TableCell>{new Date(query.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    {query.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => resolveQuery(student.id, query.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                  >
                    Resolve
                  </button>
                </TableCell>
              </TableRow>
            ))
          )
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedView('departments')}
                      className={`px-4 py-2 rounded-lg ${
                        selectedView === 'departments' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Departments
                    </button>
                    <button
                      onClick={() => setSelectedView('queries')}
                      className={`px-4 py-2 rounded-lg ${
                        selectedView === 'queries' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Active Queries
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by name or roll number..."
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
                    value={filters.cgpaRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, cgpaRange: e.target.value }))}
                  >
                    <option value="">All CGPA Ranges</option>
                    <option value="above3.5">Above 3.5</option>
                    <option value="3.0-3.5">3.0 - 3.5</option>
                    <option value="below3.0">Below 3.0</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="border rounded-lg p-2"
                    value={filters.feeStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, feeStatus: e.target.value }))}
                  >
                    <option value="">All Fee Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>

                  <select
                    className="border rounded-lg p-2"
                    value={filters.placementStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, placementStatus: e.target.value }))}
                  >
                    <option value="">All Placement Status</option>
                    <option value="placed">Placed</option>
                    <option value="not_placed">Not Placed</option>
                  </select>

                  <select
                    className="border rounded-lg p-2"
                    value={filters.backlog}
                    onChange={(e) => setFilters(prev => ({ ...prev, backlog: e.target.value }))}
                  >
                    <option value="">All Backlog</option>
                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {selectedView === 'departments' && (
              <div className="space-y-4">
                {filteredDepartments.map((dept) => (
                  <Card key={dept.name}>
                    <CardHeader>
                      <button
                        onClick={() => toggleDepartment(dept.name)}
                        className="w-full flex items-center justify-between text-left font-semibold"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{dept.name}</span>
                          <span className="text-sm text-gray-500">({dept.students.length} students)</span>
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
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Roll No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>CGPA</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Backlog</TableHead>
                                <TableHead>Fee Status</TableHead>
                                <TableHead>Placement</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dept.students.map((student) => (
                                <TableRow key={student.id}>
                                  <TableCell>{student.roll}</TableCell>
                                  <TableCell>{student.name}</TableCell>
                                  <TableCell>{student.semester}</TableCell>
                                  <TableCell>{student.cgpa}</TableCell>
                                  <TableCell>{student.attendance}%</TableCell>
                                  <TableCell>{student.backlog}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      student.feePaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {student.feePaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      student.placed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {student.placed ? 'Placed' : 'Not Placed'}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Dialog>
                                      <DialogTrigger>
                                        <button
                                          onClick={() => setQueryModal({
                                            isOpen: true,
                                            student: student,
                                            selectedColumn: ''
                                          })}
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                        >
                                          <AlertCircle className="h-4 w-4" />
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Raise Query for {student.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4">
                                          <label className="block text-sm font-medium text-gray-700">
                                            Select Field for Query
                                          </label>
                                          <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                            value={queryModal.selectedColumn}
                                            onChange={(e) => setQueryModal(prev => ({
                                              ...prev,
                                              selectedColumn: e.target.value
                                            }))}
                                          >
                                            <option value="">Select a field...</option>
                                            {columnOptions.map(option => (
                                              <option key={option.value} value={option.value}>
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                              onClick={() => setQueryModal({
                                                isOpen: false,
                                                student: null,
                                                selectedColumn: ''
                                              })}
                                              className="px-4 py-2 bg-gray-200 rounded-md"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={() => raiseQuery(queryModal.student, queryModal.selectedColumn)}
                                              className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                              disabled={!queryModal.selectedColumn}
                                            >
                                              Raise Query
                                            </button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {selectedView === 'queries' && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Queries</CardTitle>
                </CardHeader>
                <CardContent>
                 {renderQueriesTable()}
                </CardContent>
              </Card>
            )}

            <div className="fixed top-4 right-4 z-50 space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
                >
                  <span>{notification.message}</span>
                  <button 
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudentSearch;