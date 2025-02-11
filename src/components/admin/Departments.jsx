import React, { useState, useMemo } from 'react';
import { Building2, Users, BarChart, ChevronRight, Search } from 'lucide-react';
import Sidebar from "./Sidebar";

// Dummy data structure mimicking backend response
const departments = [
  { id: 1, name: "Computer Science", icon: "💻", totalStudents: 120 },
  { id: 2, name: "Electronics", icon: "⚡", totalStudents: 100 },
  { id: 3, name: "Mechanical", icon: "⚙️", totalStudents: 90 },
  { id: 4, name: "Civil", icon: "🏗️", totalStudents: 80 },
  { id: 5, name: "Chemical", icon: "🧪", totalStudents: 70 },
  { id: 6, name: "Electrical", icon: "💡", totalStudents: 85 },
  { id: 7, name: "Information Technology", icon: "🖥️", totalStudents: 110 }
];

const dummyCompanies = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    departments: [1, 7],
    placements: [
      { id: 1, studentId: "CS001", name: "John Doe", department: 1, package: 1200000, year: 2024 },
      { id: 2, studentId: "IT001", name: "Jane Smith", department: 7, package: 1400000, year: 2024 },
      { id: 3, studentId: "CS002", name: "Alice Johnson", department: 1, package: 1600000, year: 2024 }
    ]
  },
  {
    id: 2,
    name: "Global Engineering Corp",
    departments: [2, 3, 4],
    placements: [
      { id: 4, studentId: "ME001", name: "Bob Wilson", department: 3, package: 900000, year: 2024 },
      { id: 5, studentId: "EC001", name: "Carol Brown", department: 2, package: 1100000, year: 2024 },
      { id: 6, studentId: "CV001", name: "David Miller", department: 4, package: 850000, year: 2024 }
    ]
  },
  {
    id: 3,
    name: "Chemical Industries Ltd",
    departments: [5],
    placements: [
      { id: 7, studentId: "CH001", name: "Eva Davis", department: 5, package: 1000000, year: 2024 },
      { id: 8, studentId: "CH002", name: "Frank Thomas", department: 5, package: 950000, year: 2024 }
    ]
  },
  {
    id: 4,
    name: "Power Systems Co",
    departments: [6, 2],
    placements: [
      { id: 9, studentId: "EE001", name: "Grace Lee", department: 6, package: 1300000, year: 2024 },
      { id: 10, studentId: "EC002", name: "Henry Wang", department: 2, package: 1250000, year: 2024 }
    ]
  }
];

const formatCurrency = (amount) => {
  const inLakhs = amount / 100000;
  return `${inLakhs.toFixed(2)} LPA`;
};


const DepartmentMetrics = ({ departmentId }) => {
  const metrics = useMemo(() => {
    const departmentPlacements = dummyCompanies.flatMap(c => 
      c.placements.filter(p => p.department === departmentId)
    );

    const totalPlacements = departmentPlacements.length;
    const totalStudents = departments.find(d => d.id === departmentId)?.totalStudents || 0;
    const packages = departmentPlacements.map(p => p.package);
    
    return {
      totalPlacements,
      averagePackage: packages.length ? formatCurrency(packages.reduce((a, b) => a + b, 0) / packages.length) : "0 LPA",
      highestPackage: packages.length ? formatCurrency(Math.max(...packages)) : "0 LPA",
      placementPercentage: totalStudents ? ((totalPlacements / totalStudents) * 100).toFixed(1) + "%" : "0%"
    };
  }, [departmentId]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Placements</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.totalPlacements}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Average Package</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.averagePackage}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Highest Package</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.highestPackage}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Placement %</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.placementPercentage}</p>
      </div>
    </div>
  );
};

const CompanyCard = ({ company, departmentId, onSelect }) => {
  const metrics = useMemo(() => {
    const departmentPlacements = company.placements.filter(p => p.department === departmentId);
    const packages = departmentPlacements.map(p => p.package);
    
    return {
      totalPlacements: departmentPlacements.length,
      averagePackage: packages.length ? formatCurrency(packages.reduce((a, b) => a + b, 0) / packages.length) : "0 LPA"
    };
  }, [company, departmentId]);

  return (
    <div 
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(company)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{company.name}</h3>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>{metrics.totalPlacements} students placed</span>
              <span>Avg: {metrics.averagePackage}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

const PlacedStudentsList = ({ company, departmentId }) => {
  const [studentSearch, setStudentSearch] = useState('');
  const students = company.placements.filter(p => p.department === departmentId);
  
  const filteredStudents = useMemo(() => 
    students.filter(student => 
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.studentId.toLowerCase().includes(studentSearch.toLowerCase())
    ),
    [students, studentSearch]
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Placed Students - {company.name}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.id} className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-500">ID: {student.studentId}</p>
              </div>
              <span className="text-green-600 font-medium">{formatCurrency(student.package)}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-center text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

const Departments = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = useMemo(() => 
    dummyCompanies.filter(company => 
      company.departments.includes(selectedDepartment?.id) &&
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [selectedDepartment, searchTerm]
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-6">
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setSelectedCompany(null);
                }}
                className={`p-4 rounded-lg text-center transition-colors ${
                  selectedDepartment?.id === dept.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-2 block">{dept.icon}</span>
                <span className="text-sm font-medium">{dept.name}</span>
              </button>
            ))}
          </div>

          {selectedDepartment && (
            <>
              <DepartmentMetrics departmentId={selectedDepartment.id} />

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filteredCompanies.map(company => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    departmentId={selectedDepartment.id}
                    onSelect={setSelectedCompany}
                  />
                ))}
              </div>

              {selectedCompany && (
                <PlacedStudentsList 
                  company={selectedCompany} 
                  departmentId={selectedDepartment.id}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;