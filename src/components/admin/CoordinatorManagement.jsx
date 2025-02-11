import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, X, AlertTriangle, Building2, Bell, ChevronDown, ChevronRight, Users, Briefcase, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./UIComponents";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./UIComponents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./UIComponents";
import Sidebar from "./Sidebar";
// Alert Component
const Alert = ({ children, variant = 'success', onClose }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }[variant];

  return (
    <div className={`fixed bottom-4 right-4 w-96 p-4 rounded-lg border ${bgColor} shadow-lg animate-slide-up`}>
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 mt-0.5" />
        <div className="flex-1">{children}</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
const initialCoordinators = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    department: "Computer Science",
    batch: "2021-25",
    semester: 6,
    duties: [
      {
        company: "Tech Solutions Inc",
        date: "2024-02-15",
        time: "10:00",
        location: "Main Campus",
        description: "Campus recruitment drive"
      }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1234567891",
    department: "Electronics",
    batch: "2021-25",
    semester: 6,
    duties: []
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    phone: "+1234567892",
    department: "Mechanical",
    batch: "2021-25",
    semester: 6,
    duties: [
      {
        company: "Global Engineering Corp",
        date: "2024-02-20",
        time: "14:00",
        location: "Engineering Block",
        description: "Technical presentation"
      }
    ]
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    phone: "+1234567893",
    department: "Civil",
    batch: "2022-26",
    semester: 4,
    duties: []
  },
  {
    id: 5,
    name: "Alex Kumar",
    email: "alex.k@example.com",
    phone: "+1234567894",
    department: "Chemical",
    batch: "2022-26",
    semester: 4,
    duties: []
  },
  {
    id: 6,
    name: "Emily Chen",
    email: "emily.c@example.com",
    phone: "+1234567895",
    department: "Electrical",
    batch: "2021-25",
    semester: 6,
    duties: [
      {
        company: "Power Systems Co",
        date: "2024-02-18",
        time: "11:30",
        location: "Seminar Hall",
        description: "Pre-placement talk"
      }
    ]
  },
  {
    id: 7,
    name: "David Patel",
    email: "david.p@example.com",
    phone: "+1234567896",
    department: "Information Technology",
    batch: "2022-26",
    semester: 4,
    duties: []
  },
  {
    id: 8,
    name: "Sophia Lee",
    email: "sophia.l@example.com",
    phone: "+1234567897",
    department: "Computer Science",
    batch: "2022-26",
    semester: 4,
    duties: [
      {
        company: "Software Solutions Ltd",
        date: "2024-02-25",
        time: "09:00",
        location: "CS Department",
        description: "Technical rounds"
      }
    ]
  }
];



const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
  "Electrical",
  "Information Technology"
];

// Stats Component
const StatsOverview = ({ coordinators }) => {
  const stats = {
    totalCoordinators: coordinators.length,
    totalDuties: coordinators.reduce((acc, curr) => acc + curr.duties.length, 0),
    activeDepartments: new Set(coordinators.map(c => c.department)).size,
    upcomingDuties: coordinators.reduce((acc, curr) => 
      acc + curr.duties.filter(d => new Date(d.date) > new Date()).length, 0
    )
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Coordinators</p>
              <p className="text-2xl font-bold">{stats.totalCoordinators}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Departments</p>
              <p className="text-2xl font-bold">{stats.activeDepartments}</p>
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Duties</p>
              <p className="text-2xl font-bold">{stats.totalDuties}</p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Duties</p>
              <p className="text-2xl font-bold">{stats.upcomingDuties}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// DutyList Component
const DutyList = ({ duties, onEdit, onDelete }) => {
  return (
    <div className="space-y-2">
      {duties.map((duty) => (
        <Card key={duty.id} className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{duty.company}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(duty.date).toLocaleDateString()} at {duty.time}
                </p>
                <p className="text-sm text-gray-600">{duty.location}</p>
                {duty.description && (
                  <p className="text-sm text-gray-600 mt-1">{duty.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(duty)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(duty)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Department Section Component
const DepartmentSection = ({ department, coordinators, onEdit, onDelete, onDutyAction }) => {
  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value={department}>
        <AccordionTrigger className="hover:bg-gray-50 px-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            <span>{department}</span>
            <span className="text-sm text-gray-500">({coordinators.length} coordinators)</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Duties</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinators.map((coordinator) => (
                  <TableRow key={coordinator.id}>
                    <TableCell className="font-medium">{coordinator.name}</TableCell>
                    <TableCell>
                      <div>
                        <p>{coordinator.email}</p>
                        <p className="text-sm text-gray-500">{coordinator.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{coordinator.batch}</p>
                        <p className="text-sm text-gray-500">Semester {coordinator.semester}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{coordinator.duties.length} duties</span>
                        <button
                          onClick={() => onDutyAction('add', coordinator)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(coordinator)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(coordinator)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// Modal Components (reused from original code)
const DutyModal = ({ isOpen, onClose, onSave, duty = null, coordinatorId = null }) => {
  const [formData, setFormData] = useState(duty || {
    company: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{duty ? 'Edit Duty' : 'Add New Duty'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(coordinatorId, { ...formData, id: duty?.id || Date.now() });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                required
                className="w-full p-2 border rounded"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {duty ? 'Update Duty' : 'Add Duty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CoordinatorModal = ({ isOpen, onClose, onSave, coordinator = null }) => {
  const [formData, setFormData] = useState(
    coordinator || {
      name: '',
      email: '',
      phone: '',
      department: '',
      batch: '',
      semester: '',
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {coordinator ? 'Edit Coordinator' : 'Add New Coordinator'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...formData, id: coordinator?.id || Date.now() });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter coordinator name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              required
              className="w-full p-2 border rounded"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="">Select department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Batch</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded"
                value={formData.batch}
                onChange={(e) => setFormData({...formData, batch: e.target.value})}
                placeholder="e.g. 2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                required
                className="w-full p-2 border rounded"
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
              >
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {coordinator ? 'Update Coordinator' : 'Add Coordinator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const CoordinatorManagement = () => {
  const [coordinators, setCoordinators] = useState(initialCoordinators);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [selectedView, setSelectedView] = useState('departments'); // 'departments' or 'duties'
  const [dutiesSearchTerm, setDutiesSearchTerm] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDutyModalOpen, setIsDutyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteDutyModalOpen, setIsDeleteDutyModalOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [selectedDuty, setSelectedDuty] = useState(null);

  const filteredCoordinators = coordinators.filter(coordinator => {
    const matchesSearch = coordinator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coordinator.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || coordinator.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const groupedCoordinators = departments.reduce((acc, department) => {
    acc[department] = filteredCoordinators.filter(coord => coord.department === department);
    return acc;
  }, {});

  // All duties across all coordinators
  const allDuties = coordinators.reduce((acc, coordinator) => {
    return [...acc, ...coordinator.duties.map(duty => ({
      ...duty,
      coordinatorName: coordinator.name,
      coordinatorDepartment: coordinator.department
    }))];
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleAddCoordinator = (newCoordinator) => {
    setCoordinators([...coordinators, { ...newCoordinator, duties: [] }]);
    setIsAddModalOpen(false);
    showNotification('New coordinator added successfully');
  };

  const handleEditCoordinator = (updatedCoordinator) => {
    setCoordinators(coordinators.map(coord => 
      coord.id === updatedCoordinator.id ? { ...updatedCoordinator, duties: coord.duties } : coord
    ));
    setIsEditModalOpen(false);
    setSelectedCoordinator(null);
    showNotification('Coordinator updated successfully');
  };

  const handleDutyAction = (action, coordinator, duty = null) => {
    setSelectedCoordinator(coordinator);
    setSelectedDuty(duty);
    
    switch(action) {
      case 'add':
        setIsDutyModalOpen(true);
        break;
      case 'edit':
        setIsDutyModalOpen(true);
        break;
      case 'delete':
        setIsDeleteDutyModalOpen(true);
        break;
    }
  };

  const handleDutySave = (coordinatorId, dutyData) => {
    setCoordinators(coordinators.map(coord => {
      if (coord.id === coordinatorId) {
        const updatedDuties = selectedDuty
          ? coord.duties.map(d => d.id === selectedDuty.id ? dutyData : d)
          : [...coord.duties, dutyData];
        return { ...coord, duties: updatedDuties };
      }
      return coord;
    }));

    const message = selectedDuty 
      ? `Duty updated for ${selectedCoordinator.name}`
      : `New duty assigned to ${selectedCoordinator.name}`;
    
    showNotification(message);
    setIsDutyModalOpen(false);
    setSelectedDuty(null);
  };

  const handleDeleteCoordinator = () => {
    setCoordinators(coordinators.filter(coord => coord.id !== selectedCoordinator.id));
    setIsDeleteModalOpen(false);
    setSelectedCoordinator(null);
    showNotification('Coordinator deleted successfully');
  };

  const handleDeleteDuty = () => {
    setCoordinators(coordinators.map(coord => {
      if (coord.id === selectedCoordinator.id) {
        return {
          ...coord,
          duties: coord.duties.filter(d => d.id !== selectedDuty.id)
        };
      }
      return coord;
    }));

    showNotification(`Duty removed from ${selectedCoordinator.name}`);
    setIsDeleteDutyModalOpen(false);
    setSelectedDuty(null);
  };

  const handleExportData = () => {
    const data = {
      coordinators,
      exportDate: new Date().toISOString(),
      totalCoordinators: coordinators.length,
      totalDuties: coordinators.reduce((acc, curr) => acc + curr.duties.length, 0)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordinator-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully');
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
  const filteredDuties = allDuties.filter(duty => 
    duty.coordinatorName.toLowerCase().includes(dutiesSearchTerm.toLowerCase()) ||
    duty.company.toLowerCase().includes(dutiesSearchTerm.toLowerCase())
  );


  return (
    <div className="flex">
      <Sidebar />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student Placement Coordinators</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Coordinator</span>
            </button>
          </div>
        </div>

        <StatsOverview coordinators={coordinators} />

        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search coordinators..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setSelectedView('departments')}
                className={`px-4 py-2 ${selectedView === 'departments' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                Departments
              </button>
              <button
                onClick={() => setSelectedView('duties')}
                className={`px-4 py-2 ${selectedView === 'duties' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                All Duties
              </button>
            </div>
          </div>
        </div>

        {selectedView === 'departments' ? (
          // Departments View
          Object.entries(groupedCoordinators).map(([department, departmentCoordinators]) => (
            departmentCoordinators.length > 0 && (
              <DepartmentSection
                key={department}
                department={department}
                coordinators={departmentCoordinators}
                onEdit={(coord) => {
                  setSelectedCoordinator(coord);
                  setIsEditModalOpen(true);
                }}
                onDelete={(coord) => {
                  setSelectedCoordinator(coord);
                  setIsDeleteModalOpen(true);
                }}
                onDutyAction={handleDutyAction}
              />
            )
          ))
        ) : (
          // Duties View
          <Card>
            <CardHeader>
              <CardTitle>All Assigned Duties</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by coordinator name or company..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={dutiesSearchTerm}
                  onChange={(e) => setDutiesSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Coordinator</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {filteredDuties.map((duty) => (
                    <TableRow key={duty.id}>
                      <TableCell>
                        <div>
                          <p>{new Date(duty.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{duty.time}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{duty.company}</TableCell>
                      <TableCell>{duty.location}</TableCell>
                      <TableCell>{duty.coordinatorName}</TableCell>
                      <TableCell>{duty.coordinatorDepartment}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDutyAction('edit', 
                              coordinators.find(c => c.name === duty.coordinatorName),
                              duty
                            )}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDutyAction('delete',
                              coordinators.find(c => c.name === duty.coordinatorName),
                              duty
                            )}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <CoordinatorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCoordinator}
        />

        <CoordinatorModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCoordinator(null);
          }}
          onSave={handleEditCoordinator}
          coordinator={selectedCoordinator}
        />

        <DutyModal
          isOpen={isDutyModalOpen}
          onClose={() => {
            setIsDutyModalOpen(false);
            setSelectedDuty(null);
          }}
          onSave={handleDutySave}
          duty={selectedDuty}
          coordinatorId={selectedCoordinator?.id}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCoordinator(null);
          }}
          onConfirm={handleDeleteCoordinator}
          title="Delete Coordinator"
          message={`Are you sure you want to delete ${selectedCoordinator?.name}? This action cannot be undone.`}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteDutyModalOpen}
          onClose={() => {
            setIsDeleteDutyModalOpen(false);
            setSelectedDuty(null);
          }}
          onConfirm={handleDeleteDuty}
          title="Delete Duty"
          message={`Are you sure you want to delete this duty from ${selectedCoordinator?.name}?`}
        />

        {/* Notifications */}
        {notifications.map(notification => (
          <Alert
            key={notification.id}
            onClose={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
          >
            {notification.message}
          </Alert>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CoordinatorManagement;

