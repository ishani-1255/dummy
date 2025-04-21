import React, { useState, useEffect } from "react";
import { Plus, Search, Download, ChevronDown } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
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
  Button,
} from "./UIComponents";
import * as XLSX from "xlsx";
import AdminLayout from "./AdminLayout";

// Configure axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6400";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Department code mapping
const departmentMapping = {
  CSE: "Computer Science",
  CE: "Civil Engineering",
  IT: "Information Technology",
  SFE: "Safety and Fire Engineering",
  ME: "Mechanical Engineering",
  EEE: "Electrical and Electronics Engineering",
  EC: "Electronics and Communication",
};

const departments = ["All Departments", ...Object.values(departmentMapping)];

// Inverse mapping for filtering
const departmentCodeFromName = {
  "Computer Science": "CSE",
  "Civil Engineering": "CE",
  "Information Technology": "IT",
  "Safety and Fire Engineering": "SFE",
  "Mechanical Engineering": "ME",
  "Electrical and Electronics Engineering": "EEE",
  "Electronics and Communication": "EC",
};

// Add Batch Modal Component
const AddBatchModal = ({ isOpen, onClose, onAdd }) => {
  const [batchYear, setBatchYear] = useState("");

  const handleInputChange = (e) => {
    setBatchYear(e.target.value);
  };

  const calculateEndYear = (startYear) => {
    const start = parseInt(startYear);
    return isNaN(start) ? "" : `${startYear}-${start + 4}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Enter Admission Year
            </label>
            <Input
              type="number"
              value={batchYear}
              onChange={handleInputChange}
              placeholder="e.g. 2022"
            />
            {batchYear && (
              <p className="mt-2 text-sm text-gray-600">
                Batch will be created as: {calculateEndYear(batchYear)}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (batchYear) {
                  onAdd(calculateEndYear(batchYear));
                  onClose();
                }
              }}
              disabled={!batchYear}
            >
              Add Batch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Department Row Component
const DepartmentRow = ({ department }) => {
  const totalStudents = parseInt(department.totalStudents) || 0;
  const placedStudents = parseInt(department.placed) || 0;
  const placementPercentage =
    totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;
  const departmentDisplayName =
    departmentMapping[department.name] || department.name;

  return (
    <div className="flex flex-col p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-lg text-gray-900">
          {departmentDisplayName}
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            placementPercentage >= 75
              ? "bg-green-100 text-green-800"
              : placementPercentage >= 50
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {placementPercentage.toFixed(1)}% Placed
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="font-medium text-lg">{totalStudents}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Placed Students</p>
          <p className="font-medium text-lg">{placedStudents}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Average Package</p>
          <p className="font-medium text-lg">
            {department.averagePackage || "0 LPA"}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Highest Package</p>
          <p className="font-medium text-lg">
            {department.highestPackage || "0 LPA"}
          </p>
        </div>
      </div>

      {department.companies && department.companies.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">Recruiting Companies</p>
          <div className="flex flex-wrap gap-2">
            {department.companies.map((company, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Batch Summary Component
const BatchSummary = ({ departments }) => {
  const totalStudents = departments.reduce(
    (sum, dept) => sum + (parseInt(dept.totalStudents) || 0),
    0
  );

  const totalPlaced = departments.reduce(
    (sum, dept) => sum + (parseInt(dept.placed) || 0),
    0
  );

  let avgPackage = 0;
  const departmentsWithPlacements = departments.filter(
    (dept) => (parseInt(dept.placed) || 0) > 0
  );

  if (departmentsWithPlacements.length > 0) {
    const totalPackageSum = departmentsWithPlacements.reduce((sum, dept) => {
      const pkgStr = dept.averagePackage || "0";
      const pkg = parseFloat(pkgStr.replace(/[^\d.]/g, ""));
      return sum + (isNaN(pkg) ? 0 : pkg);
    }, 0);

    avgPackage = totalPackageSum / departmentsWithPlacements.length;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
      <div>
        <p className="text-sm text-gray-500">Total Students</p>
        <p className="font-medium text-lg">{totalStudents}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Placed</p>
        <p className="font-medium text-lg">{totalPlaced}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Average Package</p>
        <p className="font-medium text-lg">{avgPackage.toFixed(2)} LPA</p>
      </div>
    </div>
  );
};

// Batch Card Component
const BatchCard = ({ batch, showNotification }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filteredDepartments = batch.departments || [];

  // Excel export function
  const handleDownload = (batchYear, exportType) => {
    try {
      const wb = XLSX.utils.book_new();

      if (exportType === "summary") {
        // Create summary worksheet with all departments
        const summaryData = [
          [
            "Department",
            "Total Students",
            "Placed Students",
            "Placement %",
            "Average Package",
            "Highest Package",
          ],
          ...filteredDepartments.map((dept) => {
            const totalStudents = parseInt(dept.totalStudents) || 0;
            const placedStudents = parseInt(dept.placed) || 0;
            const placementPercentage =
              totalStudents > 0
                ? ((placedStudents / totalStudents) * 100).toFixed(1) + "%"
                : "0%";

            return [
              departmentMapping[dept.name] || dept.name,
              totalStudents,
              placedStudents,
              placementPercentage,
              dept.averagePackage || "0 LPA",
              dept.highestPackage || "0 LPA",
            ];
          }),
        ];

        const ws = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws, "Batch Summary");
      } else {
        // Create individual worksheets for each department
        filteredDepartments.forEach((dept) => {
          const deptName = departmentMapping[dept.name] || dept.name;
          const safeDeptName = deptName.substring(0, 31);

          const departmentData = [
            ["Metric", "Value"],
            ["Total Students", parseInt(dept.totalStudents) || 0],
            ["Placed Students", parseInt(dept.placed) || 0],
            [
              "Placement %",
              parseInt(dept.totalStudents) > 0
                ? (
                    (parseInt(dept.placed) / parseInt(dept.totalStudents)) *
                    100
                  ).toFixed(1) + "%"
                : "0%",
            ],
            ["Average Package", dept.averagePackage || "0 LPA"],
            ["Highest Package", dept.highestPackage || "0 LPA"],
            ["Companies"],
          ];

          // Add companies as separate rows
          if (dept.companies && dept.companies.length) {
            dept.companies.forEach((company) => {
              departmentData.push(["", company]);
            });
          }

          const ws = XLSX.utils.aoa_to_sheet(departmentData);
          XLSX.utils.book_append_sheet(wb, ws, safeDeptName);
        });
      }

      // Generate filename with timestamp
      const fileName = `${batchYear}_Placement_Report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      showNotification(`${batchYear} report downloaded successfully`);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      showNotification("Failed to generate Excel file. Please try again.");
    }
  };

  // Calculate batch statistics
  const totalStudents = filteredDepartments.reduce(
    (sum, dept) => sum + (parseInt(dept.totalStudents) || 0),
    0
  );

  const placedStudents = filteredDepartments.reduce(
    (sum, dept) => sum + (parseInt(dept.placed) || 0),
    0
  );

  let avgBatchPackage = 0;
  const departmentsWithPlacements = filteredDepartments.filter(
    (dept) => (parseInt(dept.placed) || 0) > 0
  );

  if (departmentsWithPlacements.length > 0) {
    const totalPackageValue = departmentsWithPlacements.reduce((sum, dept) => {
      const pkgStr = dept.averagePackage || "0";
      const pkg = parseFloat(pkgStr.replace(/[^\d.]/g, ""));
      return sum + (isNaN(pkg) ? 0 : pkg);
    }, 0);

    avgBatchPackage = totalPackageValue / departmentsWithPlacements.length;
  }

  const placementPercentage =
    totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {batch.year} Batch
            </h3>
            <p className="text-sm text-gray-500">
              {batch.isCompleted ? "Completed" : "Ongoing Placements"}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDownload(batch.year, "summary")}
              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-sm flex items-center"
            >
              <span className="mr-1">Export Summary</span>
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDownload(batch.year, "detailed")}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center"
            >
              <span className="mr-1">Export Detailed</span>
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-gray-200">
          <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-200">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="font-medium text-lg">{totalStudents}</p>
          </div>
          <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-200">
            <p className="text-sm text-gray-500">Placed</p>
            <p className="font-medium text-lg">
              {placedStudents} ({placementPercentage}%)
            </p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500">Average Package</p>
            <p className="font-medium text-lg">
              {avgBatchPackage.toFixed(2)} LPA
            </p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div>
          <BatchSummary departments={filteredDepartments} />
          <div className="divide-y divide-gray-200">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department, index) => (
                <DepartmentRow
                  key={index}
                  department={department}
                  isCompleted={batch.isCompleted}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No department data available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Batches Component
const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [addBatchModal, setAddBatchModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);

  // Fetch batches data from database
  useEffect(() => {
    const fetchBatchesData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoDataFound(false);

        console.log("Fetching batch data from API...");

        // Get placement data
        const placementResponse = await axios.get("/api/admin/placements");
        const placementData = placementResponse.data || [];
        console.log(`Fetched ${placementData.length} placement records`);

        // Create a mapping from student ID to placement info
        const placementMap = new Map();
        placementData.forEach((placement) => {
          if (placement.studentId) {
            placementMap.set(placement.studentId, placement);
          }
        });

        // Fetch students from all departments
        const departmentCodes = Object.keys(departmentMapping);
        const departmentPromises = departmentCodes.map((code) =>
          axios.get(`/api/admin/students/${code}`)
        );

        const responses = await Promise.all(departmentPromises);
        const allStudents = responses.flatMap(
          (response) => response.data || []
        );
        console.log("Total students fetched:", allStudents.length);

        if (allStudents.length === 0) {
          console.log("No student data found in the database");
          setNoDataFound(true);

          // Create empty batches for the UI
          const currentYear = new Date().getFullYear();
          const emptyBatches = [];

          for (let i = 0; i < 5; i++) {
            const startYear = currentYear - i + 1;
            const endYear = startYear + 4;
            const batchYear = `${startYear}-${endYear}`;
            const isCompleted = endYear <= currentYear;

            emptyBatches.push({
              id: batchYear,
              year: batchYear,
              isCompleted,
              departments: Object.keys(departmentMapping).map((code) => ({
                name: code,
                totalStudents: 0,
                placed: 0,
                averagePackage: "0 LPA",
                highestPackage: "0 LPA",
                companies: [],
              })),
            });
          }

          setBatches(emptyBatches);
          setLoading(false);
          return;
        }

        // Group students by batch based on yearOfAdmission
        const batchesMap = new Map();

        // First identify all batches from student data
        allStudents.forEach((student) => {
          if (student.yearOfAdmission) {
            const admissionYear = parseInt(student.yearOfAdmission);
            const graduationYear = admissionYear + 4;
            const batchYear = `${admissionYear}-${graduationYear}`;

            if (!batchesMap.has(batchYear)) {
              // Create a new batch with the correct year format
              batchesMap.set(batchYear, {
                id: batchYear,
                year: batchYear,
                isCompleted: graduationYear <= new Date().getFullYear(),
                departments: departmentCodes.reduce((acc, code) => {
                  acc[code] = {
                    name: code,
                    totalStudents: 0,
                    placed: 0,
                    averagePackage: "0 LPA",
                    highestPackage: "0 LPA",
                    companies: [],
                  };
                  return acc;
                }, {}),
              });
            }
          }
        });

        // If no batch data found, create default batches for the last 5 years
        if (batchesMap.size === 0) {
          console.log(
            "No batch data found in students, creating default batches"
          );
          setNoDataFound(true);

          const currentYear = new Date().getFullYear();

          // Create batches for the last 5 years
          for (let i = 0; i < 5; i++) {
            const startYear = currentYear - i + 1;
            const endYear = startYear + 4;
            const batchYear = `${startYear}-${endYear}`;
            const isCompleted = endYear <= currentYear;

            batchesMap.set(batchYear, {
              id: batchYear,
              year: batchYear,
              isCompleted,
              departments: departmentCodes.reduce((acc, code) => {
                acc[code] = {
                  name: code,
                  totalStudents: 0,
                  placed: 0,
                  averagePackage: "0 LPA",
                  highestPackage: "0 LPA",
                  companies: [],
                };
                return acc;
              }, {}),
            });
          }
        }

        // Fill in student data for each batch
        allStudents.forEach((student) => {
          if (student && student.yearOfAdmission && student.department) {
            const admissionYear = parseInt(student.yearOfAdmission);
            const graduationYear = admissionYear + 4;
            const batchYear = `${admissionYear}-${graduationYear}`;
            const deptCode = student.department;

            if (
              batchesMap.has(batchYear) &&
              batchesMap.get(batchYear).departments[deptCode]
            ) {
              const batch = batchesMap.get(batchYear);
              const dept = batch.departments[deptCode];

              // Increment total students
              dept.totalStudents = (dept.totalStudents || 0) + 1;

              // Check if student is placed
              const placementInfo =
                placementMap.get(student._id) ||
                placementMap.get(student.id) ||
                placementMap.get(student.universityId);

              const isPlaced = student.isPlaced || placementInfo != null;

              if (isPlaced) {
                // Increment placed count
                dept.placed = (dept.placed || 0) + 1;

                // Get company name
                let companyName = "Unknown Company";
                if (placementInfo && placementInfo.company) {
                  companyName =
                    typeof placementInfo.company === "object"
                      ? placementInfo.company.name || "Unknown Company"
                      : placementInfo.company;
                } else if (student.placementCompany) {
                  companyName =
                    typeof student.placementCompany === "object"
                      ? student.placementCompany.name || "Unknown Company"
                      : student.placementCompany;
                }

                // Add company to list if not already present
                if (!dept.companies.includes(companyName)) {
                  dept.companies.push(companyName);
                }

                // Update package information
                let packageValue = 0;
                if (placementInfo && placementInfo.package) {
                  packageValue = parseFloat(placementInfo.package);
                } else if (student.placementPackage) {
                  packageValue = parseFloat(student.placementPackage);
                }

                if (!isNaN(packageValue) && packageValue > 0) {
                  // Calculate running average
                  const currentAvg = parseFloat(dept.averagePackage) || 0;
                  const currentPlaced = dept.placed;

                  if (currentPlaced === 1) {
                    dept.averagePackage = `${packageValue.toFixed(2)} LPA`;
                  } else {
                    const newAvg =
                      (currentAvg * (currentPlaced - 1) + packageValue) /
                      currentPlaced;
                    dept.averagePackage = `${newAvg.toFixed(2)} LPA`;
                  }

                  // Update highest package
                  const currentHighest = parseFloat(dept.highestPackage) || 0;
                  if (packageValue > currentHighest) {
                    dept.highestPackage = `${packageValue.toFixed(2)} LPA`;
                  }
                }
              }
            }
          }
        });

        // Convert map to array and format it for the UI
        const batchesArray = Array.from(batchesMap.values()).map((batch) => ({
          ...batch,
          departments: Object.values(batch.departments),
        }));

        // Sort batches by year (newest first)
        batchesArray.sort((a, b) => {
          const yearA = parseInt(a.year.split("-")[0]);
          const yearB = parseInt(b.year.split("-")[0]);
          return yearB - yearA;
        });

        console.log("Processed batch data:", batchesArray);
        setBatches(batchesArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching batch data:", err);
        setError("Failed to fetch batch data. Please try again later.");
        setLoading(false);
        setNoDataFound(true);

        // Create empty batches on error
        const currentYear = new Date().getFullYear();
        const emptyBatches = [];

        for (let i = 0; i < 5; i++) {
          const startYear = currentYear - i + 1;
          const endYear = startYear + 4;
          const batchYear = `${startYear}-${endYear}`;
          const isCompleted = endYear <= currentYear;

          emptyBatches.push({
            id: batchYear,
            year: batchYear,
            isCompleted,
            departments: Object.keys(departmentMapping).map((code) => ({
              name: code,
              totalStudents: 0,
              placed: 0,
              averagePackage: "0 LPA",
              highestPackage: "0 LPA",
              companies: [],
            })),
          });
        }

        setBatches(emptyBatches);
      }
    };

    fetchBatchesData();
  }, []);

  // Show notification
  const showNotification = (message) => {
    setNotification({ message, type: "success" });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add a new batch
  const handleAddBatch = (batchYear) => {
    try {
      // Parse year from format "YYYY-YYYY"
      const [startYear, endYear] = batchYear.split("-").map(Number);
      const isCompleted = endYear <= new Date().getFullYear();

      // Create a new batch with empty department data
      const newBatch = {
        id: batchYear,
        year: batchYear,
        isCompleted,
        departments: Object.keys(departmentMapping).map((deptCode) => ({
          name: deptCode,
          totalStudents: 0,
          placed: 0,
          averagePackage: "0 LPA",
          highestPackage: "0 LPA",
          companies: [],
        })),
      };

      // Add to state
      setBatches((prev) => [
        newBatch,
        ...prev.sort((a, b) => {
          const yearA = parseInt(a.year.split("-")[0]);
          const yearB = parseInt(b.year.split("-")[0]);
          return yearB - yearA;
        }),
      ]);

      showNotification(`Successfully added batch ${batchYear}`);
    } catch (error) {
      console.error("Error adding batch:", error);
      setNotification({ message: "Failed to add batch", type: "error" });
    }
  };

  // Filter batches based on search and department selection
  const filteredBatches = batches.filter((batch) => {
    // Filter by search term
    const matchesSearch = batch.year
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by department
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      batch.departments.some(
        (dept) =>
          dept.name === departmentCodeFromName[selectedDepartment] ||
          departmentMapping[dept.name] === selectedDepartment
      );

    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-xl text-gray-600">Loading batch data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error && batches.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 w-full">
        <div className="max-w-5xl mx-auto">
          {notification && (
            <Alert
              className={`mb-4 ${
                notification.type === "success"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          {noDataFound && (
            <Alert className="mb-4 border-yellow-500 bg-yellow-50">
              <AlertDescription>
                No student or placement data found in the database. Add students
                with admission years to see real data.
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
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  showNotification={showNotification}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No batches found</p>
              </div>
            )}
          </div>

          <AddBatchModal
            isOpen={addBatchModal}
            onClose={() => setAddBatchModal(false)}
            onAdd={handleAddBatch}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Batches;
