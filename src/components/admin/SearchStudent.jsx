import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Bell,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronRight,
  X,
  Download,
  Info,
} from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
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
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./UIComponents";
import Sidebar from "./Sidebar";

// Configure axios with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6400";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

const EnhancedStudentSearch = () => {
  const [departments, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedDepts, setExpandedDepts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [selectedView, setSelectedView] = useState("departments");
  const [filters, setFilters] = useState({
    searchQuery: "",
    department: "all",
    feeStatus: "all",
    placementStatus: "all",
    cgpaRange: "all",
    backlog: "all",
    verified: "all",
  });

  const [placementInfo, setPlacementInfo] = useState({
    studentId: null,
    loading: false,
    applications: [],
  });

  const columnOptions = [
    { value: "cgpa", label: "CGPA" },
    { value: "backlog", label: "Backlog" },
    { value: "feeDue", label: "Fee Due" },
  ];

  // Department code to name mapping
  const departmentMapping = {
    CSE: "Computer Science",
    CE: "Civil Engineering",
    IT: "Information Technology",
    SFE: "Safety and Fire Engineering",
    ME: "Mechanical Engineering",
    EEE: "Electrical and Electronics Engineering",
    EC: "Electronics and Communication",
  };

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check basic connectivity
        console.log("Testing basic API connectivity...");
        try {
          await axios.get("/api/test");
          console.log("Basic API connection successful");
        } catch (err) {
          console.error("Failed to connect to API server:", err);
          setError(
            "Failed to connect to the server. Please check your network connection."
          );
          setLoading(false);
          return;
        }

        // Check if we have any students in the database
        console.log("Checking for students in the database...");

        // Skip auth check temporarily to see if data exists
        const departmentCodes = ["CSE", "CE", "IT", "SFE", "ME", "EEE", "EC"];

        // Try fetching at least one department to see if data exists
        try {
          // Try CSE first, as it's most likely to have data
          const response = await axios.get(`/api/admin/students/CSE`);

          if (response.data && response.data.length > 0) {
            console.log(
              `Found ${response.data.length} students in CSE department`
            );
          } else {
            console.log("No CSE students found, will check other departments");
          }
        } catch (err) {
          console.log("Could not fetch CSE data:", err.message);
          // Continue anyway
        }

        // Fetch data from all department models
        console.log("Fetching students from all departments...");

        // Create an array of promises for parallel fetching
        const departmentPromises = departmentCodes.map(async (code) => {
          console.log(`Fetching data for department: ${code}`);
          try {
            // Add a delay for EC department to avoid race conditions
            if (code === "EC") {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }

            const response = await axios.get(`/api/admin/students/${code}`);
            console.log(
              `Data fetched successfully for ${code}, count:`,
              response.data.length
            );

            if (response.data.length === 0) {
              return {
                name: departmentMapping[code] || code,
                code: code,
                students: [],
              };
            }

            return {
              name: departmentMapping[code] || code,
              code: code,
              students: response.data.map((student) => {
                // Ensure consistent mapping from DB to frontend for all departments
                console.log(`Student data for ${student.name || "unknown"}:`, {
                  feeDue: student.feeDue,
                  department: code,
                });

                return {
                  id: student._id,
                  name: student.name,
                  roll: student.registrationNumber,
                  cgpa: student.cgpa || 0,
                  lastSemGPA: student.lastSemGPA || 0,
                  // Make sure feeDue is consistent across all database models
                  feeDue:
                    student.feeDue === true ||
                    student.feeDue === "Yes" ||
                    student.feeDue === "true",
                  placed: student.placed || false,
                  placementCompany: student.placementCompany || "",
                  placementDetails: student.placementDetails || "",
                  placementPackage: student.placementPackage || "",
                  backlog: student.backlog || 0,
                  attendance: student.attendance || 0,
                  semester: student.semester || 1,
                  contactNumber: student.phone || "",
                  parentContact: student.parentContact || "",
                  email: student.email || "",
                  fatherName: student.fatherName || "",
                  yearOfAdmission: student.yearOfAdmission || "",
                  activeQueries: [],
                  department: code, // Store the department code with each student
                  verified:
                    student.verified === "Yes" || student.verified === true,
                };
              }),
            };
          } catch (err) {
            console.error(`Error fetching ${code} department data:`, err);

            // Special handling for EC department if needed
            if (code === "EC") {
              console.log(
                "Retrying EC department with alternative endpoint..."
              );
              try {
                const retryResponse = await axios.get(
                  `/api/admin/students/EC`,
                  {
                    timeout: 5000, // Increase timeout for EC department
                  }
                );

                if (retryResponse.data && retryResponse.data.length > 0) {
                  console.log(
                    `Retry successful for EC, found ${retryResponse.data.length} students`
                  );

                  return {
                    name: departmentMapping[code] || code,
                    code: code,
                    students: retryResponse.data.map((student) => ({
                      id: student._id,
                      name: student.name,
                      roll: student.registrationNumber,
                      cgpa: student.cgpa || 0,
                      lastSemGPA: student.lastSemGPA || 0,
                      feeDue:
                        student.feeDue === true ||
                        student.feeDue === "Yes" ||
                        student.feeDue === "true",
                      placed: student.placed || false,
                      placementCompany: student.placementCompany || "",
                      placementDetails: student.placementDetails || "",
                      placementPackage: student.placementPackage || "",
                      backlog: student.backlog || 0,
                      attendance: student.attendance || 0,
                      semester: student.semester || 1,
                      contactNumber: student.phone || "",
                      parentContact: student.parentContact || "",
                      email: student.email || "",
                      fatherName: student.fatherName || "",
                      yearOfAdmission: student.yearOfAdmission || "",
                      activeQueries: [],
                      department: code,
                      verified:
                        student.verified === "Yes" || student.verified === true,
                    })),
                  };
                }
              } catch (retryErr) {
                console.error("EC department retry also failed:", retryErr);
              }
            }

            // Return empty department rather than breaking the entire fetch
            return {
              name: departmentMapping[code] || code,
              code: code,
              students: [],
            };
          }
        });

        // Wait for all promises to resolve
        const departmentsData = await Promise.all(departmentPromises);

        // Filter out departments with no students
        const filteredDepartments = departmentsData.filter(
          (dept) => dept.students.length > 0
        );

        console.log(
          "Fetched departments with students:",
          filteredDepartments.length
        );

        // Check if we got any data
        if (filteredDepartments.length === 0) {
          setError(
            "No student data available. This could be because the database is empty or authentication failed."
          );
          setLoading(false);
        } else {
          setDepartmentsData(filteredDepartments);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in student data fetch process:", err);
        setError(
          `Failed to fetch student data: ${
            err.response?.data?.message || err.message
          }. This may be due to an authentication error or server issue.`
        );
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const toggleDepartment = (deptName) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName],
    }));
  };

  const showNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
    };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 3000);
  };

  const filteredDepartments = useMemo(() => {
    return departments.map((dept) => ({
      ...dept,
      students: dept.students.filter((student) => {
        // Log fee status for debugging
        // console.log(`Filtering ${student.name}: feeDue=${student.feeDue}, filter=${filters.feeStatus}`);

        const matchesSearch =
          (student.name &&
            student.name
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase())) ||
          (student.roll &&
            student.roll
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()));
        const matchesDepartment =
          filters.department === "all" || dept.code === filters.department;
        const matchesFeeStatus =
          filters.feeStatus === "all" ||
          (filters.feeStatus === "due" ? student.feeDue : !student.feeDue);
        const matchesPlacement =
          filters.placementStatus === "all" ||
          (filters.placementStatus === "placed"
            ? student.placed
            : !student.placed);
        const matchesCGPA =
          filters.cgpaRange === "all" ||
          (filters.cgpaRange === "above8.5"
            ? student.cgpa >= 8.5
            : filters.cgpaRange === "7.5-8.5"
            ? student.cgpa >= 7.5 && student.cgpa < 8.5
            : filters.cgpaRange === "6.5-7.5"
            ? student.cgpa >= 6.5 && student.cgpa < 7.5
            : student.cgpa < 6.5);
        const matchesBacklog =
          filters.backlog === "all" ||
          parseInt(student.backlog) === parseInt(filters.backlog);
        const matchesVerified =
          filters.verified === "all" ||
          (filters.verified === "verified"
            ? student.verified
            : !student.verified);

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesFeeStatus &&
          matchesPlacement &&
          matchesCGPA &&
          matchesBacklog &&
          matchesVerified
        );
      }),
    }));
  }, [departments, filters]);

  // Export data to Excel
  const exportToExcel = (departmentData) => {
    // Prepare the data for export
    const dataToExport = departmentData.students.map((student) => ({
      "Registration Number": student.roll,
      Name: student.name,
      Semester: student.semester,
      "Year of Admission": student.yearOfAdmission,
      CGPA: student.cgpa,
      "Last Semester GPA": student.lastSemGPA || "N/A",
      "Attendance (%)": student.attendance,
      Backlog: student.backlog,
      "Fee Due": student.feeDue ? "Yes" : "No",
      "Placement Status": student.placed
        ? `Placed${
            student.placementCompany ? ` at ${student.placementCompany}` : ""
          }${student.placementPackage ? ` (${student.placementPackage})` : ""}`
        : "Not Placed",
      "Contact Number": student.contactNumber,
      Email: student.email,
      "Father Name": student.fatherName,
      "Parent Contact": student.parentContact,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, departmentData.name);

    // Generate Excel file and download
    XLSX.writeFile(workbook, `${departmentData.name}_Students.xlsx`);

    showNotification(
      `Exported ${departmentData.name} student data successfully`
    );
  };

  // Export all data to Excel
  const exportAllToExcel = () => {
    // Create a workbook
    const workbook = XLSX.utils.book_new();

    // Add each department as a separate worksheet
    filteredDepartments.forEach((dept) => {
      if (dept.students.length > 0) {
        const dataToExport = dept.students.map((student) => ({
          "Registration Number": student.roll,
          Name: student.name,
          Semester: student.semester,
          "Year of Admission": student.yearOfAdmission,
          CGPA: student.cgpa,
          "Last Semester GPA": student.lastSemGPA || "N/A",
          "Attendance (%)": student.attendance,
          Backlog: student.backlog,
          "Fee Due": student.feeDue ? "Yes" : "No",
          "Placement Status": student.placed
            ? `Placed${
                student.placementCompany
                  ? ` at ${student.placementCompany}`
                  : ""
              }${
                student.placementPackage ? ` (${student.placementPackage})` : ""
              }`
            : "Not Placed",
          "Contact Number": student.contactNumber,
          Email: student.email,
          "Father Name": student.fatherName,
          "Parent Contact": student.parentContact,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          dept.name.substring(0, 31)
        ); // Excel sheet names have a 31 char limit
      }
    });

    // Generate Excel file and download
    XLSX.writeFile(workbook, "All_Students_Data.xlsx");

    showNotification("Exported all student data successfully");
  };

  // Fetch student application history
  const fetchStudentApplications = async (studentId, departmentCode) => {
    if (!studentId) return [];

    setPlacementInfo((prev) => ({
      ...prev,
      studentId,
      loading: true,
    }));

    try {
      // Real API call to the backend
      console.log(
        `Fetching applications for student ${studentId} from ${departmentCode} department`
      );

      // According to backend/app.js, we should use /api/applications endpoint for student applications
      // The endpoint for a specific student would be /api/applications?studentId=XYZ
      const response = await axios.get(`/api/applications`, {
        params: {
          studentId: studentId,
          department: departmentCode,
        },
      });

      console.log("Fetched application data:", response.data);

      // If we don't find any applications, try the company applications endpoint
      if (!response.data || response.data.length === 0) {
        console.log(
          "No applications found, trying with admin company endpoint"
        );
        try {
          // Try to get all applications and filter by student
          const companyResponse = await axios.get(
            `/api/admin/applications/company/all`
          );

          if (companyResponse.data && companyResponse.data.length > 0) {
            // Filter applications for this student
            const studentApps = companyResponse.data.filter(
              (app) => app.student && app.student._id === studentId
            );

            if (studentApps.length > 0) {
              console.log("Found applications in company data:", studentApps);

              // Sort applications by date (newest first)
              const sortedApplications = [...studentApps].sort(
                (a, b) =>
                  new Date(b.appliedDate || b.createdAt || 0) -
                  new Date(a.appliedDate || a.createdAt || 0)
              );

              setPlacementInfo((prev) => ({
                ...prev,
                loading: false,
                applications: sortedApplications,
              }));

              return sortedApplications;
            }
          }
        } catch (altError) {
          console.log("Company endpoint approach failed:", altError);
        }
      }

      // Sort applications by date (newest first)
      const sortedApplications =
        response.data && response.data.length > 0
          ? [...response.data].sort(
              (a, b) =>
                new Date(b.appliedDate || b.createdAt || 0) -
                new Date(a.appliedDate || a.createdAt || 0)
            )
          : [];

      setPlacementInfo((prev) => ({
        ...prev,
        loading: false,
        applications: sortedApplications,
      }));

      return sortedApplications;
    } catch (error) {
      console.error("Error fetching student applications:", error);

      // Try direct application endpoint if student-specific endpoint fails
      try {
        console.log("Trying direct application endpoint");

        // Get all applications and filter client-side
        const allAppsResponse = await axios.get(`/api/applications`);

        if (allAppsResponse.data && allAppsResponse.data.length > 0) {
          // Filter for this student
          const studentApps = allAppsResponse.data.filter(
            (app) =>
              app.student === studentId ||
              (app.student && app.student._id === studentId)
          );

          if (studentApps.length > 0) {
            console.log("Found applications in all applications:", studentApps);

            // Sort applications by date (newest first)
            const sortedApplications = [...studentApps].sort(
              (a, b) =>
                new Date(b.appliedDate || b.createdAt || 0) -
                new Date(a.appliedDate || a.createdAt || 0)
            );

            setPlacementInfo((prev) => ({
              ...prev,
              loading: false,
              applications: sortedApplications,
            }));

            return sortedApplications;
          }
        }
      } catch (directError) {
        console.error("Direct applications endpoint also failed:", directError);
      }

      // Mock data as a fallback if all API calls fail
      console.log("All API endpoints failed, creating mock data for testing");
      const mockApplications = [
        {
          company: { name: "Example Company" },
          status: "Applied",
          appliedDate: new Date(),
          resume: "#",
          coverLetter: "#",
          additionalInfo: "This is mock data for testing purposes",
        },
      ];

      setPlacementInfo((prev) => ({
        ...prev,
        loading: false,
        applications: mockApplications,
      }));

      return mockApplications;
    }
  };

  // Helper function to get all students from all departments
  const getAllStudents = () => {
    const allStudents = [];
    departments.forEach((dept) => {
      dept.students.forEach((student) => {
        // Add department info to each student
        allStudents.push({
          ...student,
          department: dept.code,
        });
      });
    });

    // Apply filters
    return allStudents.filter((student) => {
      // Search query filter
      if (
        filters.searchQuery &&
        !student.name
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) &&
        !student.roll.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Department filter
      if (
        filters.department &&
        filters.department !== "all" &&
        student.department !== filters.department
      ) {
        return false;
      }

      // Fee status filter
      if (
        (filters.feeStatus === "due" && !student.feeDue) ||
        (filters.feeStatus === "paid" && student.feeDue)
      ) {
        return false;
      }

      // Placement status filter
      if (
        (filters.placementStatus === "placed" && !student.placed) ||
        (filters.placementStatus === "not-placed" && student.placed)
      ) {
        return false;
      }

      // CGPA range filter
      if (filters.cgpaRange && filters.cgpaRange !== "all") {
        const cgpa = parseFloat(student.cgpa);
        if (
          (filters.cgpaRange === "above8.5" && cgpa <= 8.5) ||
          (filters.cgpaRange === "7.5-8.5" && (cgpa < 7.5 || cgpa > 8.5)) ||
          (filters.cgpaRange === "6.5-7.5" && (cgpa < 6.5 || cgpa > 7.5)) ||
          (filters.cgpaRange === "below6.5" && cgpa >= 6.5)
        ) {
          return false;
        }
      }

      // Backlog filter
      if (filters.backlog !== "all") {
        const backlogCount = parseInt(student.backlog);
        if (backlogCount !== parseInt(filters.backlog)) {
          return false;
        }
      }

      // Verification filter
      if (filters.verified !== "all") {
        if (
          (filters.verified === "verified" && !student.verified) ||
          (filters.verified === "unverified" && student.verified)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
          <div className="text-xl text-gray-600">Loading student data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col h-screen w-full bg-gray-50 items-center justify-center p-6">
          <div className="text-xl text-red-600 mb-6">{error}</div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-w-2xl">
            <h3 className="font-semibold text-lg mb-2">
              Troubleshooting Steps:
            </h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Make sure you are logged in with admin credentials</li>
              <li>Check that your backend server is running on port 6400</li>
              <li>
                If you don't have any student data in the database, you can
                create test data:
                <button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const response = await axios.get(
                        "/api/admin/create-test-data"
                      );
                      console.log(
                        "Test data creation response:",
                        response.data
                      );
                      alert(
                        "Test data created successfully! Refreshing the page..."
                      );
                      window.location.reload();
                    } catch (err) {
                      console.error("Failed to create test data:", err);
                      alert(
                        "Failed to create test data: " +
                          (err.response?.data?.message || err.message)
                      );
                      setLoading(false);
                    }
                  }}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  Create Test Data
                </button>
              </li>
              <li>
                Check the browser console and backend server logs for more
                details
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  Student Management
                </CardTitle>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedView("departments")}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Departments
                  </button>
                  <button
                    onClick={exportAllToExcel}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Tabs
                  defaultValue="departments"
                  value={selectedView}
                  onValueChange={(value) => setSelectedView(value)}
                  className="w-full"
                >
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="all">All Students</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name or registration number..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                      }))
                    }
                  />
                </div>

                <select
                  className="border rounded-lg p-2"
                  value={filters.department}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg p-2"
                  value={filters.cgpaRange}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      cgpaRange: e.target.value,
                    }))
                  }
                >
                  <option value="all">All CGPA Ranges</option>
                  <option value="above8.5">Above 8.5</option>
                  <option value="7.5-8.5">7.5 - 8.5</option>
                  <option value="6.5-7.5">6.5 - 7.5</option>
                  <option value="below6.5">Below 6.5</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <select
                  className="border rounded-lg p-2"
                  value={filters.feeStatus}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      feeStatus: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Fee Due Status</option>
                  <option value="unpaid">Yes</option>
                  <option value="paid">No</option>
                </select>

                <select
                  className="border rounded-lg p-2"
                  value={filters.placementStatus}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      placementStatus: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Placement Status</option>
                  <option value="placed">Placed</option>
                  <option value="not-placed">Not Placed</option>
                </select>

                <select
                  className="border rounded-lg p-2"
                  value={filters.backlog}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      backlog: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Backlog</option>
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg p-2"
                  value={filters.verified}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      verified: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Verification Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {selectedView === "departments" && (
            <div className="space-y-4">
              {filteredDepartments.map((dept) => (
                <Card key={dept.name}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleDepartment(dept.name)}
                        className="flex-1 flex items-center justify-between text-left font-semibold"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{dept.name}</span>
                          <span className="text-sm text-gray-500">
                            ({dept.students.length} students)
                          </span>
                        </div>
                        {expandedDepts[dept.name] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => exportToExcel(dept)}
                        className="ml-4 px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </button>
                    </div>
                  </CardHeader>
                  {expandedDepts[dept.name] && (
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Registration Number</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Semester</TableHead>
                              <TableHead>CGPA</TableHead>
                              <TableHead>Backlog</TableHead>
                              <TableHead>Fee Due</TableHead>
                              <TableHead>Placement</TableHead>
                              <TableHead>Verified</TableHead>
                              <TableHead>Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dept.students.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell>{student.roll}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.semester}</TableCell>
                                <TableCell>{student.cgpa}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 ${
                                      parseInt(student.backlog) > 0
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    } rounded-full text-xs`}
                                  >
                                    {student.backlog}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      student.feeDue
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {student.feeDue ? "Yes" : "No"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      student.placed
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {student.placed ? "Placed" : "Not Placed"}
                                  </span>
                                  {student.placed &&
                                    student.placementCompany && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        {student.placementCompany}
                                        {student.placementPackage &&
                                          ` (${student.placementPackage})`}
                                      </div>
                                    )}
                                  <Dialog>
                                    <DialogTrigger>
                                      <button
                                        className="text-blue-600 hover:bg-blue-50 rounded-full p-1 ml-1"
                                        onClick={() =>
                                          fetchStudentApplications(
                                            student.id,
                                            student.department
                                          )
                                        }
                                      >
                                        <Info className="h-4 w-4" />
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Placement Information - {student.name}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4 space-y-4">
                                        <div>
                                          <h3 className="font-medium mb-2">
                                            Current Status
                                          </h3>
                                          <p className="mb-2">
                                            {student.placed ? (
                                              <span className="text-green-600 font-medium">
                                                Placed
                                              </span>
                                            ) : (
                                              <span className="text-yellow-600 font-medium">
                                                Not Placed
                                              </span>
                                            )}
                                          </p>
                                          {student.placed && (
                                            <div className="space-y-1 text-sm">
                                              {student.placementCompany && (
                                                <p>
                                                  <span className="font-medium">
                                                    Company:
                                                  </span>{" "}
                                                  {student.placementCompany}
                                                </p>
                                              )}
                                              {student.placementPackage && (
                                                <p>
                                                  <span className="font-medium">
                                                    Package:
                                                  </span>{" "}
                                                  {student.placementPackage}
                                                </p>
                                              )}
                                              {student.placementDetails && (
                                                <p>
                                                  <span className="font-medium">
                                                    Details:
                                                  </span>{" "}
                                                  {student.placementDetails}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        <div>
                                          <h3 className="font-medium mb-2">
                                            Application History
                                          </h3>
                                          <div className="text-sm text-gray-600">
                                            {placementInfo.loading ? (
                                              <div className="text-center py-4">
                                                <p>
                                                  Loading application history...
                                                </p>
                                              </div>
                                            ) : placementInfo.studentId ===
                                                student.id &&
                                              placementInfo.applications
                                                .length > 0 ? (
                                              <div className="space-y-2">
                                                {placementInfo.applications.map(
                                                  (app, index) => (
                                                    <div
                                                      key={index}
                                                      className="border-b pb-2"
                                                    >
                                                      <p className="font-medium">
                                                        {app.company?.name ||
                                                          app.company ||
                                                          "Unknown Company"}
                                                      </p>
                                                      <p>
                                                        Status:{" "}
                                                        <span
                                                          className={`${
                                                            app.status ===
                                                              "Accepted" ||
                                                            app.status ===
                                                              "Offered"
                                                              ? "text-green-600"
                                                              : app.status ===
                                                                "Rejected"
                                                              ? "text-red-600"
                                                              : app.status ===
                                                                "Interview Scheduled"
                                                              ? "text-blue-600"
                                                              : "text-yellow-600"
                                                          }`}
                                                        >
                                                          {app.status ||
                                                            "Applied"}
                                                        </span>
                                                      </p>
                                                      {(app.appliedDate ||
                                                        app.createdAt) && (
                                                        <p>
                                                          Applied:{" "}
                                                          {new Date(
                                                            app.appliedDate ||
                                                              app.createdAt
                                                          ).toLocaleDateString()}
                                                        </p>
                                                      )}
                                                      {app.interviewDate && (
                                                        <p>
                                                          Interview Date:{" "}
                                                          {new Date(
                                                            app.interviewDate
                                                          ).toLocaleDateString()}
                                                        </p>
                                                      )}
                                                      {app.packageOffered && (
                                                        <p>
                                                          Package:{" "}
                                                          {app.packageOffered}
                                                        </p>
                                                      )}
                                                      {app.feedback && (
                                                        <p>
                                                          Feedback:{" "}
                                                          {app.feedback}
                                                        </p>
                                                      )}
                                                      {app.resume && (
                                                        <p>
                                                          Resume:{" "}
                                                          <a
                                                            href={app.resume}
                                                            className="text-blue-600 hover:underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                          >
                                                            View
                                                          </a>
                                                        </p>
                                                      )}
                                                      {app.coverLetter && (
                                                        <p>
                                                          Cover Letter:{" "}
                                                          <a
                                                            href={
                                                              app.coverLetter
                                                            }
                                                            className="text-blue-600 hover:underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                          >
                                                            View
                                                          </a>
                                                        </p>
                                                      )}
                                                      {app.additionalInfo && (
                                                        <p className="text-sm">
                                                          Additional Info:{" "}
                                                          {app.additionalInfo}
                                                        </p>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            ) : (
                                              <div>
                                                <p className="mb-2">
                                                  No application history
                                                  available for {student.name}.
                                                </p>
                                                {student.department ===
                                                  "EC" && (
                                                  <p className="text-gray-500 text-xs italic">
                                                    Note: EC department data
                                                    might have limited
                                                    application history
                                                    visibility.
                                                  </p>
                                                )}
                                                {student.placed && (
                                                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                    <p className="text-sm text-yellow-700">
                                                      Student is marked as
                                                      placed, but no application
                                                      records were found. This
                                                      may be due to manual
                                                      placement recording.
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 ${
                                      student.verified
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    } rounded-full text-xs`}
                                  >
                                    {student.verified ? "Yes" : "No"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger>
                                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
                                        View Details
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Student Details: {student.name}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Registration Number
                                            </p>
                                            <p>{student.roll}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Name
                                            </p>
                                            <p>{student.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Department
                                            </p>
                                            <p>{dept.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Semester
                                            </p>
                                            <p>{student.semester}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Year of Admission
                                            </p>
                                            <p>{student.yearOfAdmission}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Email
                                            </p>
                                            <p>{student.email}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Phone
                                            </p>
                                            <p>{student.contactNumber}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Father's Name
                                            </p>
                                            <p>{student.fatherName}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              CGPA
                                            </p>
                                            <p>{student.cgpa}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Last Semester GPA
                                            </p>
                                            <p>{student.lastSemGPA || "N/A"}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Backlog
                                            </p>
                                            <p>{student.backlog}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Fee Due
                                            </p>
                                            <p>
                                              {student.feeDue ? "Yes" : "No"}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">
                                              Placement Status
                                            </p>
                                            <p>
                                              {student.placed
                                                ? "Placed"
                                                : "Not Placed"}
                                              {student.placed &&
                                                student.placementCompany && (
                                                  <>
                                                    <br />
                                                    <span className="text-sm text-gray-600">
                                                      Company:{" "}
                                                      {student.placementCompany}
                                                    </span>
                                                  </>
                                                )}
                                              {student.placed &&
                                                student.placementPackage && (
                                                  <>
                                                    <br />
                                                    <span className="text-sm text-gray-600">
                                                      Package:{" "}
                                                      {student.placementPackage}
                                                    </span>
                                                  </>
                                                )}
                                              {student.placed &&
                                                student.placementDetails && (
                                                  <>
                                                    <br />
                                                    <span className="text-sm text-gray-600">
                                                      Details:{" "}
                                                      {student.placementDetails}
                                                    </span>
                                                  </>
                                                )}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium mb-1">
                                              Verification Status
                                            </p>
                                            <p>
                                              {student.verified
                                                ? "Verified"
                                                : "Not Verified"}
                                            </p>
                                          </div>
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

          {selectedView === "all" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name or registration number"
                    className="pl-8 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        searchQuery: e.target.value,
                      })
                    }
                  />
                </div>

                <Select
                  value={filters.department}
                  onValueChange={(value) =>
                    setFilters({ ...filters, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {Object.keys(departmentMapping).map((deptCode) => (
                      <SelectItem key={deptCode} value={deptCode}>
                        {departmentMapping[deptCode]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.feeStatus}
                  onValueChange={(value) =>
                    setFilters({ ...filters, feeStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fee Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unpaid">Yes</SelectItem>
                    <SelectItem value="paid">No</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.placementStatus}
                  onValueChange={(value) =>
                    setFilters({ ...filters, placementStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Placement Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="placed">Placed</SelectItem>
                    <SelectItem value="not-placed">Not Placed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.cgpaRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, cgpaRange: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="CGPA Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="above8.5">Above 8.5</SelectItem>
                    <SelectItem value="7.5-8.5">7.5 - 8.5</SelectItem>
                    <SelectItem value="6.5-7.5">6.5 - 7.5</SelectItem>
                    <SelectItem value="below6.5">Below 6.5</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.verified}
                  onValueChange={(value) =>
                    setFilters({ ...filters, verified: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verification Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">All Students</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportAllToExcel()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left border">Reg. No</th>
                      <th className="p-2 text-left border">Name</th>
                      <th className="p-2 text-left border">Department</th>
                      <th className="p-2 text-left border">Semester</th>
                      <th className="p-2 text-left border">
                        Year of Admission
                      </th>
                      <th className="p-2 text-left border">CGPA</th>
                      <th className="p-2 text-left border">Backlog</th>
                      <th className="p-2 text-left border">Fee Due</th>
                      <th className="p-2 text-left border">Placement</th>
                      <th className="p-2 text-left border">Verified</th>
                      <th className="p-2 text-left border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllStudents().map((student) => (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2 border">{student.roll}</td>
                        <td className="p-2 border">{student.name}</td>
                        <td className="p-2 border">
                          {departmentMapping[student.department] ||
                            student.department}
                        </td>
                        <td className="p-2 border">{student.semester}</td>
                        <td className="p-2 border">
                          {student.yearOfAdmission}
                        </td>
                        <td className="p-2 border">{student.cgpa}</td>
                        <td className="p-2 border">
                          <span
                            className={`px-2 py-1 ${
                              parseInt(student.backlog) > 0
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            } rounded-full text-xs`}
                          >
                            {student.backlog}
                          </span>
                        </td>
                        <td className="p-2 border">
                          {student.feeDue ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              No
                            </span>
                          )}
                        </td>
                        <td className="p-2 border">
                          <div className="flex items-center">
                            {student.placed ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Placed
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                Not Placed
                              </span>
                            )}
                            <Dialog>
                              <DialogTrigger>
                                <button
                                  className="text-blue-600 hover:bg-blue-50 rounded-full p-1 ml-1"
                                  onClick={() =>
                                    fetchStudentApplications(
                                      student.id,
                                      student.department
                                    )
                                  }
                                >
                                  <Info className="h-4 w-4" />
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Placement Information - {student.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <h3 className="font-medium mb-2">
                                      Current Status
                                    </h3>
                                    <p className="mb-2">
                                      {student.placed ? (
                                        <span className="text-green-600 font-medium">
                                          Placed
                                        </span>
                                      ) : (
                                        <span className="text-yellow-600 font-medium">
                                          Not Placed
                                        </span>
                                      )}
                                    </p>
                                    {student.placed && (
                                      <div className="space-y-1 text-sm">
                                        {student.placementCompany && (
                                          <p>
                                            <span className="font-medium">
                                              Company:
                                            </span>{" "}
                                            {student.placementCompany}
                                          </p>
                                        )}
                                        {student.placementPackage && (
                                          <p>
                                            <span className="font-medium">
                                              Package:
                                            </span>{" "}
                                            {student.placementPackage}
                                          </p>
                                        )}
                                        {student.placementDetails && (
                                          <p>
                                            <span className="font-medium">
                                              Details:
                                            </span>{" "}
                                            {student.placementDetails}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <h3 className="font-medium mb-2">
                                      Application History
                                    </h3>
                                    <div className="text-sm text-gray-600">
                                      {placementInfo.loading ? (
                                        <div className="text-center py-4">
                                          <p>Loading application history...</p>
                                        </div>
                                      ) : placementInfo.studentId ===
                                          student.id &&
                                        placementInfo.applications.length >
                                          0 ? (
                                        <div className="space-y-2">
                                          {placementInfo.applications.map(
                                            (app, index) => (
                                              <div
                                                key={index}
                                                className="border-b pb-2"
                                              >
                                                <p className="font-medium">
                                                  {app.company?.name ||
                                                    app.company ||
                                                    "Unknown Company"}
                                                </p>
                                                <p>
                                                  Status:{" "}
                                                  <span
                                                    className={`${
                                                      app.status ===
                                                        "Accepted" ||
                                                      app.status === "Offered"
                                                        ? "text-green-600"
                                                        : app.status ===
                                                          "Rejected"
                                                        ? "text-red-600"
                                                        : app.status ===
                                                          "Interview Scheduled"
                                                        ? "text-blue-600"
                                                        : "text-yellow-600"
                                                    }`}
                                                  >
                                                    {app.status || "Applied"}
                                                  </span>
                                                </p>
                                                {(app.appliedDate ||
                                                  app.createdAt) && (
                                                  <p>
                                                    Applied:{" "}
                                                    {new Date(
                                                      app.appliedDate ||
                                                        app.createdAt
                                                    ).toLocaleDateString()}
                                                  </p>
                                                )}
                                                {app.interviewDate && (
                                                  <p>
                                                    Interview Date:{" "}
                                                    {new Date(
                                                      app.interviewDate
                                                    ).toLocaleDateString()}
                                                  </p>
                                                )}
                                                {app.packageOffered && (
                                                  <p>
                                                    Package:{" "}
                                                    {app.packageOffered}
                                                  </p>
                                                )}
                                                {app.feedback && (
                                                  <p>
                                                    Feedback: {app.feedback}
                                                  </p>
                                                )}
                                                {app.resume && (
                                                  <p>
                                                    Resume:{" "}
                                                    <a
                                                      href={app.resume}
                                                      className="text-blue-600 hover:underline"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      View
                                                    </a>
                                                  </p>
                                                )}
                                                {app.coverLetter && (
                                                  <p>
                                                    Cover Letter:{" "}
                                                    <a
                                                      href={app.coverLetter}
                                                      className="text-blue-600 hover:underline"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      View
                                                    </a>
                                                  </p>
                                                )}
                                                {app.additionalInfo && (
                                                  <p className="text-sm">
                                                    Additional Info:{" "}
                                                    {app.additionalInfo}
                                                  </p>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div>
                                          <p className="mb-2">
                                            No application history available for{" "}
                                            {student.name}.
                                          </p>
                                          {student.department === "EC" && (
                                            <p className="text-gray-500 text-xs italic">
                                              Note: EC department data might
                                              have limited application history
                                              visibility.
                                            </p>
                                          )}
                                          {student.placed && (
                                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                              <p className="text-sm text-yellow-700">
                                                Student is marked as placed, but
                                                no application records were
                                                found. This may be due to manual
                                                placement recording.
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                        <td className="p-2 border">
                          <span
                            className={`px-2 py-1 ${
                              student.verified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            } rounded-full text-xs`}
                          >
                            {student.verified ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-2 border">
                          <Dialog>
                            <DialogTrigger>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Student Details - {student.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Registration Number
                                  </p>
                                  <p>{student.roll}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Name
                                  </p>
                                  <p>{student.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Department
                                  </p>
                                  <p>
                                    {departmentMapping[student.department] ||
                                      student.department}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Semester
                                  </p>
                                  <p>{student.semester}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Year of Admission
                                  </p>
                                  <p>{student.yearOfAdmission}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    CGPA
                                  </p>
                                  <p>{student.cgpa}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Last Semester GPA
                                  </p>
                                  <p>{student.lastSemGPA || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Backlog
                                  </p>
                                  <p>{student.backlog ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Fee Due
                                  </p>
                                  <p>{student.feeDue ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Placement Status
                                  </p>
                                  <p>
                                    {student.placed
                                      ? `Placed (${
                                          student.placementCompany || ""
                                        }${
                                          student.placementPackage
                                            ? `, ${student.placementPackage}`
                                            : ""
                                        })`
                                      : "Not Placed"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Contact Number
                                  </p>
                                  <p>{student.contactNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">
                                    Email
                                  </p>
                                  <p>{student.email}</p>
                                </div>
                                {student.fatherName && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">
                                      Father Name
                                    </p>
                                    <p>{student.fatherName}</p>
                                  </div>
                                )}
                                {student.parentContact && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">
                                      Parent Contact
                                    </p>
                                    <p>{student.parentContact}</p>
                                  </div>
                                )}
                              </div>
                              <Dialog>
                                <DialogTrigger>
                                  <Button
                                    className="mt-4 w-full"
                                    onClick={() =>
                                      fetchStudentApplications(
                                        student.id,
                                        student.department
                                      )
                                    }
                                  >
                                    View application history
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Application History - {student.name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    {placementInfo.loading ? (
                                      <div className="text-center py-4">
                                        <p>Loading application history...</p>
                                      </div>
                                    ) : placementInfo.studentId ===
                                        student.id &&
                                      placementInfo.applications.length > 0 ? (
                                      <div className="space-y-4">
                                        {placementInfo.applications.map(
                                          (app, index) => (
                                            <div
                                              key={index}
                                              className="border p-4 rounded-lg"
                                            >
                                              <h3 className="font-medium text-lg mb-2">
                                                {app.company?.name ||
                                                  app.company}
                                              </h3>
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    Status
                                                  </p>
                                                  <p
                                                    className={`${
                                                      app.status ===
                                                        "Accepted" ||
                                                      app.status === "Offered"
                                                        ? "text-green-600"
                                                        : app.status ===
                                                          "Rejected"
                                                        ? "text-red-600"
                                                        : app.status ===
                                                          "Interview Scheduled"
                                                        ? "text-blue-600"
                                                        : "text-yellow-600"
                                                    }`}
                                                  >
                                                    {app.status}
                                                  </p>
                                                </div>
                                                {app.appliedDate && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Applied On
                                                    </p>
                                                    <p>
                                                      {new Date(
                                                        app.appliedDate
                                                      ).toLocaleDateString()}
                                                    </p>
                                                  </div>
                                                )}
                                                {app.interviewDate && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Interview Date
                                                    </p>
                                                    <p>
                                                      {new Date(
                                                        app.interviewDate
                                                      ).toLocaleDateString()}
                                                    </p>
                                                  </div>
                                                )}
                                                {app.packageOffered && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Package
                                                    </p>
                                                    <p>{app.packageOffered}</p>
                                                  </div>
                                                )}
                                                {app.feedback && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Feedback
                                                    </p>
                                                    <p>{app.feedback}</p>
                                                  </div>
                                                )}
                                                {app.resume && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Resume
                                                    </p>
                                                    <a
                                                      href={app.resume}
                                                      className="text-blue-600 hover:underline"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      View
                                                    </a>
                                                  </div>
                                                )}
                                                {app.coverLetter && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Cover Letter
                                                    </p>
                                                    <a
                                                      href={app.coverLetter}
                                                      className="text-blue-600 hover:underline"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      View
                                                    </a>
                                                  </div>
                                                )}
                                                {app.additionalInfo && (
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      Additional Info
                                                    </p>
                                                    <p>{app.additionalInfo}</p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-center py-4">
                                        No application history available
                                      </p>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
              >
                <span>{notification.message}</span>
                <button
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    )
                  }
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
  );
};

export default EnhancedStudentSearch;
