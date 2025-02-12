import React, { useState } from 'react';
import { Plus, Search, Download, FileText, Building2, ChevronDown, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Alert,
  AlertDescription,
  Input,
  Button
} from './UIComponents';
import Sidebar from './Sidebar';
// Mock data for the past 3 batches and current batch
const initialBatches = [
  {
    id: 1,
    year: "2020-24",
    isCompleted: true,
    departments: [
      {
        name: "Computer Science",
        totalStudents: 120,
        placed: 115,
        averagePackage: "12.5 LPA",
        highestPackage: "45 LPA",
        companies: ["Google", "Microsoft", "Amazon", "Meta"]
      },
      {
        name: "Electronics",
        totalStudents: 90,
        placed: 82,
        averagePackage: "8.2 LPA",
        highestPackage: "22 LPA",
        companies: ["Intel", "AMD", "Samsung", "Qualcomm"]
      },
      {
        name: "Mechanical",
        totalStudents: 60,
        placed: 52,
        averagePackage: "7.8 LPA",
        highestPackage: "18 LPA",
        companies: ["Tata", "L&T", "Bosch"]
      }
    ]
  },
  {
    id: 2,
    year: "2021-25",
    isCompleted: false,
    departments: [
      {
        name: "Computer Science",
        totalStudents: 130,
        placedSoFar: 90,
        ongoingPlacements: true,
        companies: ["Microsoft", "Amazon", "Goldman Sachs"]
      },
      {
        name: "Electronics",
        totalStudents: 85,
        placedSoFar: 60,
        ongoingPlacements: true,
        companies: ["Intel", "Texas Instruments"]
      },
      {
        name: "Mechanical",
        totalStudents: 55,
        placedSoFar: 30,
        ongoingPlacements: true,
        companies: ["Tata", "Mahindra"]
      }
    ]
  }
];

const departments = [
  "All Departments",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical"
];

const generateBatchYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 4;
    years.push(`${startYear}-${endYear}`);
  }
  return years;
};

const batchYears = generateBatchYears();

// New component for Download Modal
const DownloadModal = ({ isOpen, onClose, type, department }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download {type} Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Download {type} report for {department} department.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              // Handle download logic here
              onClose();
            }}>
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// New component for Add Batch Modal
const AddBatchModal = ({ isOpen, onClose, onAdd }) => {
  const [batchYear, setBatchYear] = useState("");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Select Batch Year</label>
            <Select value={batchYear} onValueChange={setBatchYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {batchYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              if (batchYear) {
                onAdd(batchYear);
                onClose();
              }
            }}>
              Add Batch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DepartmentMetrics = ({ department, isCompleted, onDownload }) => {
  return (
    <div className="p-4 space-y-4 border-t">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="font-medium text-lg">{department.totalStudents}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">
            {isCompleted ? "Placed" : "Placed So Far"}
          </p>
          <p className="font-medium text-lg">
            {isCompleted ? department.placed : department.placedSoFar}
          </p>
        </div>
        {isCompleted && (
          <>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Average Package</p>
              <p className="font-medium text-lg">{department.averagePackage}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Highest Package</p>
              <p className="font-medium text-lg">{department.highestPackage}</p>
            </div>
          </>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">
          {isCompleted ? "Placed At" : "Ongoing Placements"}
        </p>
        <div className="flex flex-wrap gap-2">
          {department.companies.map((company, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-sm ${
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {company}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 pt-2">
        <Button
          variant="outline"
          className="text-green-600 hover:bg-green-50"
          onClick={() => onDownload("excel", department.name)}
        >
          <Download className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <Button
          variant="outline"
          className="text-blue-600 hover:bg-blue-50"
          onClick={() => onDownload("report", department.name)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Report
        </Button>
      </div>
    </div>
  );
};

const BatchCard = ({ batch, onDownload }) => {
  const [expandedDept, setExpandedDept] = useState(null);

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">Batch {batch.year}</span>
          {!batch.isCompleted && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Ongoing
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y">
          {batch.departments.map((dept, index) => (
            <div key={index}>
              <button
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded transition-colors"
                onClick={() => setExpandedDept(expandedDept === index ? null : index)}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{dept.name}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform ${
                    expandedDept === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedDept === index && (
                <DepartmentMetrics
                  department={dept}
                  isCompleted={batch.isCompleted}
                  onDownload={onDownload}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Batches = () => {
  const [batches, setBatches] = useState(initialBatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [downloadModal, setDownloadModal] = useState({ open: false, type: null, department: null });
  const [addBatchModal, setAddBatchModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownload = (type, department) => {
    setDownloadModal({ open: true, type, department });
  };

  const handleAddBatch = (batchYear) => {
    // Create a new batch with default department structure
    const newBatch = {
      id: batches.length + 1,
      year: batchYear,
      isCompleted: false,
      departments: [
        {
          name: "Computer Science",
          totalStudents: 0,
          placedSoFar: 0,
          ongoingPlacements: true,
          companies: []
        },
        {
          name: "Electronics",
          totalStudents: 0,
          placedSoFar: 0,
          ongoingPlacements: true,
          companies: []
        },
        {
          name: "Mechanical",
          totalStudents: 0,
          placedSoFar: 0,
          ongoingPlacements: true,
          companies: []
        }
      ]
    };
    
    setBatches([...batches, newBatch]);
    showNotification(`Successfully added batch ${batchYear}`);
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = batch.year.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedDepartment === "All Departments") {
      return matchesSearch;
    }
    return matchesSearch && batch.departments.some(dept => dept.name === selectedDepartment);
  });

  return (
    <div className="flex">
    <Sidebar />
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <div className="max-w-5xl mx-auto">
        {notification && (
          <Alert className={`mb-4 ${
            notification.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
          }`}>
            <AlertDescription>
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Batches</h1>
          <Button
            onClick={() => setAddBatchModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white" 
          >
            <Plus className="h-5 w-5 mr-2" />
            New Batch
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search batches..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onDownload={handleDownload}
            />
          ))}
        </div>

        <DownloadModal
          isOpen={downloadModal.open}
          onClose={() => setDownloadModal({ open: false, type: null, department: null })}
          type={downloadModal.type}
          department={downloadModal.department}
        />

        <AddBatchModal
          isOpen={addBatchModal}
          onClose={() => setAddBatchModal(false)}
          onAdd={handleAddBatch}
        />
      </div>
    </div>
    </div>
  );
};

export default Batches;