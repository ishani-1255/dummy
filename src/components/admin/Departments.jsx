import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Users,
  BarChart,
  ChevronRight,
  Search,
  Loader,
} from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "axios";

// Configure axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6400";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Department mapping for consistency
const departmentMapping = {
  CSE: "Computer Science",
  CE: "Civil Engineering",
  IT: "Information Technology",
  SFE: "Safety and Fire Engineering",
  ME: "Mechanical Engineering",
  EEE: "Electrical and Electronics Engineering",
  EC: "Electronics and Communication",
};

const departmentCodeFromName = {
  "Computer Science": "CSE",
  "Civil Engineering": "CE",
  "Information Technology": "IT",
  "Safety and Fire Engineering": "SFE",
  "Mechanical Engineering": "ME",
  "Electrical and Electronics Engineering": "EEE",
  "Electronics and Communication": "EC",
};

// Dummy company data for fallback
const dummyCompanies = [
  {
    id: "c1",
    name: "Tech Solutions Inc",
    departments: ["CSE", "IT"],
    placements: [
      {
        id: "p1",
        studentId: "CS001",
        name: "John Doe",
        department: "CSE",
        package: 1200000,
        role: "Software Engineer",
        joiningDate: "2024-07-01",
        year: 2024,
      },
      {
        id: "p2",
        studentId: "IT001",
        name: "Jane Smith",
        department: "IT",
        package: 1100000,
        role: "Frontend Developer",
        joiningDate: "2024-07-15",
        year: 2024,
      },
    ],
  },
  {
    id: "c2",
    name: "Innovate Systems",
    departments: ["CSE", "EC", "EEE"],
    placements: [
      {
        id: "p3",
        studentId: "EC001",
        name: "Alice Jones",
        department: "EC",
        package: 950000,
        role: "Hardware Engineer",
        joiningDate: "2024-08-01",
        year: 2024,
      },
    ],
  },
];

const formatCurrency = (amount) => {
  const inLakhs = amount / 100000;
  return `${inLakhs.toFixed(2)} LPA`;
};

const DepartmentMetrics = ({ departmentId, companies, departmentsList }) => {
  const metrics = useMemo(() => {
    const departmentPlacements = companies.flatMap((c) =>
      c.placements.filter((p) => p.department === departmentId)
    );

    const totalPlacements = departmentPlacements.length;
    const totalStudents =
      departmentsList.find((d) => d.id === departmentId)?.totalStudents || 0;
    const packages = departmentPlacements.map((p) => p.package);

    return {
      totalPlacements,
      averagePackage: packages.length
        ? formatCurrency(packages.reduce((a, b) => a + b, 0) / packages.length)
        : "0 LPA",
      highestPackage: packages.length
        ? formatCurrency(Math.max(...packages))
        : "0 LPA",
      placementPercentage: totalStudents
        ? ((totalPlacements / totalStudents) * 100).toFixed(1) + "%"
        : "0%",
    };
  }, [departmentId, companies, departmentsList]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Placements</h3>
        <p className="text-2xl font-bold text-gray-900">
          {metrics.totalPlacements}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Average Package</h3>
        <p className="text-2xl font-bold text-gray-900">
          {metrics.averagePackage}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Highest Package</h3>
        <p className="text-2xl font-bold text-gray-900">
          {metrics.highestPackage}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Placement %</h3>
        <p className="text-2xl font-bold text-gray-900">
          {metrics.placementPercentage}
        </p>
      </div>
    </div>
  );
};

const CompanyCard = ({ company, departmentId, onSelect }) => {
  const metrics = useMemo(() => {
    const departmentPlacements = company.placements.filter(
      (p) => p.department === departmentId
    );
    const packages = departmentPlacements.map((p) => p.package);

    return {
      totalPlacements: departmentPlacements.length,
      averagePackage: packages.length
        ? formatCurrency(packages.reduce((a, b) => a + b, 0) / packages.length)
        : "0 LPA",
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
  const [studentSearch, setStudentSearch] = useState("");
  const students = company.placements.filter(
    (p) => p.department === departmentId
  );

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          student.studentId.toLowerCase().includes(studentSearch.toLowerCase())
      ),
    [students, studentSearch]
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          Placed Students - {company.name}
        </h3>
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
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="px-4 py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-500">ID: {student.studentId}</p>
              </div>
              <span className="text-green-600 font-medium">
                {formatCurrency(student.package)}
              </span>
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
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch department and placement data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching department data...");

        // Fetch all students to get department statistics
        const studentsResponse = await axios
          .get("/api/admin/students", {
            withCredentials: true,
          })
          .catch((error) => {
            console.error("Failed to fetch students:", error);
            return { data: [] };
          });

        // Fetch companies
        const companiesResponse = await axios
          .get("/api/admin/companies", {
            withCredentials: true,
          })
          .catch((error) => {
            console.error("Failed to fetch companies:", error);
            return { data: [] };
          });

        // Fetch placements
        const placementsResponse = await axios
          .get("/api/admin/placements", {
            withCredentials: true,
          })
          .catch((error) => {
            console.error("Failed to fetch placements:", error);
            return { data: [] };
          });

        const studentsData = studentsResponse.data || [];
        const companiesData = companiesResponse.data || [];
        const placementsData = placementsResponse.data || [];

        console.log(
          `Fetched ${studentsData.length} students, ${companiesData.length} companies, ${placementsData.length} placements`
        );

        // Process students to get department statistics
        const departmentStats = new Map();

        // Initialize departments
        Object.keys(departmentMapping).forEach((deptCode) => {
          departmentStats.set(deptCode, {
            id: deptCode,
            name: departmentMapping[deptCode],
            totalStudents: 0,
            icon:
              deptCode === "CSE"
                ? "💻"
                : deptCode === "IT"
                ? "🖥️"
                : deptCode === "EC"
                ? "⚡"
                : deptCode === "ME"
                ? "⚙️"
                : deptCode === "CE"
                ? "🏗️"
                : deptCode === "SFE"
                ? "🧪"
                : "💡",
          });
        });

        // Count students per department
        studentsData.forEach((student) => {
          if (student.department && departmentStats.has(student.department)) {
            const dept = departmentStats.get(student.department);
            dept.totalStudents++;
          }
        });

        // Create a map of student IDs to departments
        const studentDeptMap = new Map();
        studentsData.forEach((student) => {
          if (student._id && student.department) {
            studentDeptMap.set(student._id, student.department);
          }
        });

        // Process placements to include department info
        const processedPlacements = placementsData
          .map((placement) => {
            const deptCode = studentDeptMap.get(placement.studentId);
            const student = studentsData.find(
              (s) => s._id === placement.studentId
            );

            return {
              id: placement._id,
              studentId: student
                ? student.universityId || "Unknown"
                : "Unknown",
              name: student
                ? `${student.firstName} ${student.lastName}`.trim()
                : "Unknown Student",
              department: deptCode,
              package: parseFloat(placement.package) || 0,
              role: placement.role || "Not specified",
              joiningDate:
                placement.joiningDate || new Date().toISOString().split("T")[0],
              year: new Date(placement.createdAt || Date.now()).getFullYear(),
              company: placement.company,
            };
          })
          .filter((p) => p.department); // Only include placements where we know the department

        // Process companies
        const processedCompanies = companiesData
          .map((company) => {
            // Find placements for this company
            const companyPlacements = processedPlacements.filter(
              (p) =>
                p.company &&
                ((typeof p.company === "object" &&
                  p.company._id === company._id) ||
                  (typeof p.company === "string" && p.company === company._id))
            );

            // Map department codes to department IDs for display
            const departments = [
              ...new Set(companyPlacements.map((p) => p.department)),
            ];

            return {
              id: company._id,
              name: company.name,
              departments,
              placements: companyPlacements,
            };
          })
          .filter((company) => company.placements.length > 0); // Only include companies with placements

        // Convert department stats map to array
        const departmentsArray = Array.from(departmentStats.values());

        // Set state with fetched data
        setDepartments(departmentsArray);
        setCompanies(processedCompanies);

        // If we have departments, select the first one by default
        if (departmentsArray.length > 0 && !selectedDepartment) {
          setSelectedDepartment(departmentsArray[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching department data:", err);
        setError("Failed to fetch department data");
        setLoading(false);

        // Fall back to dummy data
        const dummyDepts = [
          {
            id: "CSE",
            name: "Computer Science",
            icon: "💻",
            totalStudents: 120,
          },
          { id: "EC", name: "Electronics", icon: "⚡", totalStudents: 100 },
          { id: "ME", name: "Mechanical", icon: "⚙️", totalStudents: 90 },
          { id: "CE", name: "Civil", icon: "🏗️", totalStudents: 80 },
          { id: "SFE", name: "Safety Fire", icon: "🧪", totalStudents: 70 },
          { id: "EEE", name: "Electrical", icon: "💡", totalStudents: 85 },
          {
            id: "IT",
            name: "Information Technology",
            icon: "🖥️",
            totalStudents: 110,
          },
        ];

        setDepartments(dummyDepts);
        setCompanies(dummyCompanies);
        setSelectedDepartment(dummyDepts[0]);
      }
    };

    fetchData();
  }, []);

  const filteredCompanies = useMemo(
    () =>
      companies.filter(
        (company) =>
          company.departments.includes(selectedDepartment?.id) &&
          company.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [companies, selectedDepartment, searchTerm]
  );

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading department data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <p className="text-red-600">{error}</p>
            <p className="text-gray-600 mt-2">
              Using fallback data for demonstration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-6">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setSelectedCompany(null);
                }}
                className={`p-4 rounded-lg text-center transition-colors ${
                  selectedDepartment?.id === dept.id
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl mb-2 block">{dept.icon}</span>
                <span className="text-sm font-medium">{dept.name}</span>
              </button>
            ))}
          </div>

          {selectedDepartment && (
            <>
              <DepartmentMetrics
                departmentId={selectedDepartment.id}
                companies={companies}
                departmentsList={departments}
              />

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
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      departmentId={selectedDepartment.id}
                      onSelect={setSelectedCompany}
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500">
                      No companies found for this department
                    </p>
                  </div>
                )}
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
