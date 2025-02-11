import React, { useState, useMemo } from 'react';
import Sidebar from "./Sidebar";
import { ChevronDown, ChevronRight, Bell, Search, Filter, X } from 'lucide-react';

const SearchStudent = () => {
  // Sample data generator for 7 departments
  // Previous imports remain the same...

const departments = [
  {
    name: "Computer Science",
    code: "CS",
    students: [
      { id: "CS001", name: "Aditya Sharma", roll: "2021CSBA001", cgpa: 3.8, feePaid: true, placed: true, backlog: 1 },
      { id: "CS002", name: "Priya Patel", roll: "2021CSBA002", cgpa: 3.9, feePaid: false, placed: false, backlog: 0 },
      { id: "CS003", name: "Rahul Singh", roll: "2021CSBA003", cgpa: 3.2, feePaid: true, placed: false, backlog: 0 },
      { id: "CS004", name: "Sarah Khan", roll: "2022CSBA001", cgpa: 3.7, feePaid: false, placed: true, backlog: 0 }
    ]
  },
  {
    name: "Electrical Engineering",
    code: "EE",
    students: [
      { id: "EE001", name: "Amit Kumar", roll: "2021EEBA001", cgpa: 3.6, feePaid: true, placed: true, backlog: 6 },
      { id: "EE002", name: "Neha Gupta", roll: "2021EEBA002", cgpa: 3.4, feePaid: false, placed: false, backlog: 6 },
      { id: "EE003", name: "Ravi Verma", roll: "2022EEBA001", cgpa: 3.8, feePaid: true, placed: true, backlog: 4 }
    ]
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
    students: [
      { id: "ME001", name: "Vikram Thapar", roll: "2021MEBA001", cgpa: 3.5, feePaid: true, placed: false, backlog: 6 },
      { id: "ME002", name: "Ananya Roy", roll: "2021MEBA002", cgpa: 3.3, feePaid: false, placed: true, backlog: 6 },
      { id: "ME003", name: "Raj Malhotra", roll: "2022MEBA001", cgpa: 3.9, feePaid: true, placed: false, backlog: 4 }
    ]
  },
  {
    name: "Civil Engineering",
    code: "CE",
    students: [
      { id: "CE001", name: "Deepak Verma", roll: "2021CEBA001", cgpa: 3.7, feePaid: false, placed: true, backlog: 6 },
      { id: "CE002", name: "Kavita Reddy", roll: "2021CEBA002", cgpa: 3.5, feePaid: true, placed: false, backlog: 6 },
      { id: "CE003", name: "Sanjay Kumar", roll: "2022CEBA001", cgpa: 3.4, feePaid: false, placed: true, backlog: 4 }
    ]
  },
  {
    name: "Chemical Engineering",
    code: "CH",
    students: [
      { id: "CH001", name: "Preeti Singh", roll: "2021CHBA001", cgpa: 3.8, feePaid: true, placed: true, backlog: 6 },
      { id: "CH002", name: "Mohit Sharma", roll: "2021CHBA002", cgpa: 3.2, feePaid: false, placed: false, backlog: 6 },
      { id: "CH003", name: "Anjali Desai", roll: "2022CHBA001", cgpa: 3.6, feePaid: true, placed: true, backlog: 4 }
    ]
  },
  {
    name: "Electronics Engineering",
    code: "EC",
    students: [
      { id: "EC001", name: "Rohit Kapoor", roll: "2021ECBA001", cgpa: 3.9, feePaid: true, placed: true, backlog: 6 },
      { id: "EC002", name: "Shreya Joshi", roll: "2021ECBA002", cgpa: 3.4, feePaid: false, placed: false, backlog: 6 },
      { id: "EC003", name: "Arjun Nair", roll: "2022ECBA001", cgpa: 3.7, feePaid: true, placed: false, backlog: 4 }
    ]
  },
  {
    name: "Information Technology",
    code: "IT",
    students: [
      { id: "IT001", name: "Akash Mehta", roll: "2021ITBA001", cgpa: 3.6, feePaid: false, placed: true, backlog: 6 },
      { id: "IT002", name: "Pooja Gandhi", roll: "2021ITBA002", cgpa: 3.8, feePaid: true, placed: false, backlog: 6 },
      { id: "IT003", name: "Karan Shah", roll: "2022ITBA001", cgpa: 3.5, feePaid: false, placed: true, backlog: 4 }
    ]
  }
];

// Rest of the component code remains the same...
  const [expandedDepts, setExpandedDepts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    department: '',
    feeStatus: '',
    placementStatus: '',
    cgpaRange: '',
    backlog: ''
  });

  const toggleDepartment = (deptName) => {
    setExpandedDepts(prev => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  const sendNotification = (student) => {
    const newNotification = {
      id: Date.now(),
      message: `Fee reminder sent to ${student.name} (${student.roll})`
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  };

  const filteredDepartments = useMemo(() => {
    return departments.map(dept => {
      const filteredStudents = dept.students.filter(student => {
        const matchesSearch = (
          student.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          student.roll.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
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
      });

      return {
        ...dept,
        students: filteredStudents
      };
    });
  }, [departments, filters]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Student Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
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
                  value={filters.feeStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, feeStatus: e.target.value }))}
                >
                  <option value="">All Fee Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  value={filters.cgpaRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, cgpaRange: e.target.value }))}
                >
                  <option value="">All CGPA Ranges</option>
                  <option value="above3.5">Above 3.5</option>
                  <option value="3.0-3.5">3.0 - 3.5</option>
                  <option value="below3.0">Below 3.0</option>
                </select>

                <select
                  className="border rounded-lg p-2"
                  value={filters.backlog}
                  onChange={(e) => setFilters(prev => ({ ...prev, backlog: e.target.value }))}
                >
                  <option value="">Backlog</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

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

          <div className="space-y-4">
            {filteredDepartments.map((dept) => (
              <div key={dept.name} className="bg-white rounded-lg shadow">
                <button
                  onClick={() => toggleDepartment(dept.name)}
                  className="w-full p-4 flex items-center justify-between text-left font-semibold hover:bg-gray-50"
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

                {expandedDepts[dept.name] && (
                  <div className="p-4 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2 pr-6">Roll No.</th>
                          <th className="pb-2 pr-6">Name</th>
                          <th className="pb-2 pr-6">Backlog</th>
                          <th className="pb-2 pr-6">CGPA</th>
                          <th className="pb-2 pr-6">Placement</th>
                          <th className="pb-2 pr-6">Fee Status</th>
                          <th className="pb-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dept.students.map((student) => (
                          <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 pr-6">{student.roll}</td>
                            <td className="py-3 pr-6">{student.name}</td>
                            <td className="py-3 pr-6">{student.backlog}</td>
                            <td className="py-3 pr-6">{student.cgpa}</td>
                            <td className="py-3 pr-6">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                student.placed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.placed ? 'Placed' : 'Not Placed'}
                              </span>
                            </td>
                            <td className="py-3 pr-6">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                student.feePaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {student.feePaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </td>
                            <td className="py-3">
                              {!student.feePaid && (
                                <button
                                  onClick={() => sendNotification(student)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                  <Bell className="h-4 w-4" />
                                  <span>Remind</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchStudent;