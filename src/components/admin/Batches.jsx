import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Download,
  FileText,
  Building2,
  ChevronDown,
  X,
} from "lucide-react";
import axios from "axios";
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
  Button,
} from "./UIComponents";
import Sidebar from "./Sidebar";
import * as XLSX from "xlsx";

// Configure axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6400";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add department code mapping
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

const generateBatchYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = -4; i < 5; i++) {
    // Show past 4 years and future 4 years
    const startYear = currentYear + i;
    const endYear = startYear + 4;
    years.push(`${startYear}-${endYear}`);
  }
  return years;
};

const batchYears = generateBatchYears();

// Update the departmentMapping with inverse mapping for filtering
const departmentCodeFromName = {
  "Computer Science": "CSE",
  "Civil Engineering": "CE",
  "Information Technology": "IT",
  "Safety and Fire Engineering": "SFE",
  "Mechanical Engineering": "ME",
  "Electrical and Electronics Engineering": "EEE",
  "Electronics and Communication": "EC",
};

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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle download logic here
                onClose();
              }}
            >
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
            <label className="text-sm font-medium mb-1 block">
              Select Batch Year
            </label>
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (batchYear) {
                  onAdd(batchYear);
                  onClose();
                }
              }}
            >
              Add Batch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BatchSummary = ({ departments }) => {
  const totalStudents = departments.reduce(
    (sum, dept) => sum + (parseInt(dept.totalStudents) || 0),
    0
  );

  const totalPlaced = departments.reduce(
    (sum, dept) => sum + (parseInt(dept.placed) || 0),
    0
  );

  // Safely calculate average package
  let avgPackage = 0;
  if (departments.length > 0) {
    // Only consider departments with actual placement data
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

const DepartmentRow = ({ department, isCompleted }) => {
  // Safely parse numeric values with fallbacks
  const totalStudents = parseInt(department.totalStudents) || 0;
  const placedStudents = parseInt(department.placed) || 0;

  // Safely calculate placement percentage, avoid division by zero
  const placementPercentage =
    totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;

  // Get proper department display name
  const departmentDisplayName =
    departmentMapping[department.name] || department.name;

  // Safely parse package values
  const averagePackage = department.averagePackage || "0 LPA";
  const highestPackage = department.highestPackage || "0 LPA";

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
          <p className="font-medium text-lg">{averagePackage}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Highest Package</p>
          <p className="font-medium text-lg">{highestPackage}</p>
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

const BatchCard = ({ batch, showNotification }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get departments that have data
  const getFilteredDepartments = () => {
    if (!batch || !batch.departments) return [];
    return batch.departments;
  };

  const filteredDepartments = getFilteredDepartments();

  // Safe export function with better error handling
  const handleDownload = (batchYear, exportType) => {
    try {
      const wb = XLSX.utils.book_new();
      console.log("Creating Excel file for batch", batchYear);

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
          // Safely get the department name for sheet name
          const deptName = departmentMapping[dept.name] || dept.name;
          // Excel sheet names must be <= 31 chars
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

      // Show success notification
      if (showNotification) {
        showNotification(`${batchYear} report downloaded successfully`);
      }
    } catch (error) {
      console.error("Error generating Excel file:", error);
      if (showNotification) {
        showNotification("Failed to generate Excel file. Please try again.");
      }
    }
  };

  // Calculate totals for the batch summary
  const totalStudents = filteredDepartments.reduce(
    (sum, dept) => sum + (parseInt(dept.totalStudents) || 0),
    0
  );

  const placedStudents = filteredDepartments.reduce(
    (sum, dept) => sum + (parseInt(dept.placed) || 0),
    0
  );

  // Calculate average package with proper handling of string LPA values
  const departmentsWithPlacements = filteredDepartments.filter(
    (dept) => (parseInt(dept.placed) || 0) > 0
  );

  // Safely calculate average package
  let avgBatchPackage = 0;
  if (departmentsWithPlacements.length > 0) {
    const totalPackageValue = departmentsWithPlacements.reduce((sum, dept) => {
      const pkgStr = dept.averagePackage || "0";
      const pkg = parseFloat(pkgStr.replace(/[^\d.]/g, ""));
      return sum + (isNaN(pkg) ? 0 : pkg);
    }, 0);

    avgBatchPackage = totalPackageValue / departmentsWithPlacements.length;
  }

  // Calculate placement percentage
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
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500 transform rotate-180" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
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

// Add a function to create mock data for demo purposes if real data is missing
const createSampleData = () => {
  const currentYear = new Date().getFullYear();
  return [
    {
      id: `${currentYear - 4}-${currentYear}`,
      year: `${currentYear - 4}-${currentYear}`,
      isCompleted: true,
      departments: Object.keys(departmentMapping).map((code) => ({
        name: code,
        totalStudents: Math.floor(Math.random() * 50) + 30, // 30-80 students
        placed: Math.floor(Math.random() * 30) + 15, // 15-45 placed students
        placedSoFar: Math.floor(Math.random() * 30) + 15,
        averagePackage: (Math.random() * 5 + 5).toFixed(2) + " LPA", // 5-10 LPA
        highestPackage: (Math.random() * 15 + 10).toFixed(2) + " LPA", // 10-25 LPA
        companies: ["TCS", "Infosys", "Wipro", "Accenture", "IBM"].slice(
          0,
          Math.floor(Math.random() * 3) + 2
        ),
        ongoingPlacements: false,
      })),
    },
    {
      id: `${currentYear - 3}-${currentYear + 1}`,
      year: `${currentYear - 3}-${currentYear + 1}`,
      isCompleted: false,
      departments: Object.keys(departmentMapping).map((code) => ({
        name: code,
        totalStudents: Math.floor(Math.random() * 50) + 30, // 30-80 students
        placed: Math.floor(Math.random() * 20) + 10, // 10-30 placed students (ongoing)
        placedSoFar: Math.floor(Math.random() * 20) + 10,
        averagePackage: (Math.random() * 4 + 4).toFixed(2) + " LPA", // 4-8 LPA
        highestPackage: (Math.random() * 10 + 8).toFixed(2) + " LPA", // 8-18 LPA
        companies: ["Google", "Microsoft", "Amazon", "Meta"].slice(
          0,
          Math.floor(Math.random() * 2) + 1
        ),
        ongoingPlacements: true,
      })),
    },
  ];
};

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [downloadModal, setDownloadModal] = useState({
    open: false,
    type: null,
    department: null,
  });
  const [addBatchModal, setAddBatchModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch batches data
  useEffect(() => {
    const fetchBatchesData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching batch data from API...");

        // First, fetch placement data to get company and package information
        const placementResponse = await axios
          .get("/api/admin/placements", {
            withCredentials: true,
          })
          .catch((error) => {
            console.error("Failed to fetch placement data:", error);
            return { data: [] };
          });

        const placementData = placementResponse.data || [];
        console.log(`Fetched ${placementData.length} placement records`);

        // Create a mapping from student ID to placement info for quick lookup
        const placementMap = new Map();
        placementData.forEach((placement) => {
          if (placement.studentId) {
            placementMap.set(placement.studentId, placement);
          }
        });

        // Fetch students from all departments
        const departmentCodes = Object.keys(departmentMapping);
        const departmentPromises = departmentCodes.map((code) =>
          axios
            .get(`/api/admin/students/${code}`, {
              withCredentials: true,
            })
            .catch((error) => {
              console.warn(
                `Failed to fetch ${code} department data:`,
                error.message
              );
              return { data: [] };
            })
        );

        const responses = await Promise.all(departmentPromises);
        console.log("All department API calls completed");

        // Log the responses to debug
        responses.forEach((response, index) => {
          console.log(
            `Department ${departmentCodes[index]} data:`,
            response.data ? response.data.length : 0,
            "students"
          );
        });

        const allStudents = responses.flatMap(
          (response) => response.data || []
        );

        console.log("Total students fetched:", allStudents.length);

        // If we have no real data, fall back to sample data
        if (allStudents.length === 0) {
          console.log("No student data found, using sample data");
          const sampleData = createSampleData();
          setBatches(sampleData);
          setLoading(false);
          return;
        }

        // Group students by batch
        const batchesMap = new Map();

        // First identify all the batches from student data
        let batchYears = new Set();
        allStudents.forEach((student) => {
          if (student.yearOfAdmission) {
            const batchYear = `${student.yearOfAdmission}-${
              parseInt(student.yearOfAdmission) + 4
            }`;
            batchYears.add(batchYear);
          }
        });

        // If no batches found, just create the current batch with real (empty) data
        if (batchYears.size === 0) {
          const currentYear = new Date().getFullYear();
          batchYears.add(`${currentYear - 4}-${currentYear}`);
        }

        // Initialize all batches with all departments
        batchYears.forEach((batchYear) => {
          batchesMap.set(batchYear, {
            id: batchYear,
            year: batchYear,
            isCompleted:
              parseInt(batchYear.split("-")[0]) + 4 <= new Date().getFullYear(),
            departments: new Map(),
          });

          // Initialize all departments for this batch
          const batch = batchesMap.get(batchYear);
          departmentCodes.forEach((deptCode) => {
            batch.departments.set(deptCode, {
              name: deptCode,
              totalStudents: 0,
              placed: 0,
              placedSoFar: 0,
              averagePackage: 0,
              highestPackage: 0,
              companies: new Set(),
              ongoingPlacements: !batch.isCompleted,
            });
          });
        });

        // Now populate with actual student data
        allStudents.forEach((student) => {
          if (student && student.yearOfAdmission && student.department) {
            const batchYear = `${student.yearOfAdmission}-${
              parseInt(student.yearOfAdmission) + 4
            }`;

            const batch = batchesMap.get(batchYear);
            const deptName = student.department;

            if (batch && batch.departments.has(deptName)) {
              const deptStats = batch.departments.get(deptName);
              deptStats.totalStudents++;

              // Check if student is placed using either the isPlaced property
              // or looking up in the placement data
              const placementInfo =
                placementMap.get(student._id) ||
                placementMap.get(student.id) ||
                placementMap.get(student.universityId);

              const isPlaced = student.isPlaced || placementInfo != null;

              if (isPlaced) {
                deptStats.placed++;
                deptStats.placedSoFar++;

                // Extract company name
                let companyName = "Unknown Company";

                // Try to get company from placement map first
                if (placementInfo && placementInfo.company) {
                  if (typeof placementInfo.company === "object") {
                    companyName =
                      placementInfo.company.name || "Unknown Company";
                  } else {
                    companyName = placementInfo.company;
                  }
                }
                // Fall back to student's placement company if available
                else if (student.placementCompany) {
                  if (typeof student.placementCompany === "object") {
                    companyName =
                      student.placementCompany.name || "Unknown Company";
                  } else {
                    companyName = student.placementCompany;
                  }
                }

                deptStats.companies.add(companyName);

                // Get package information
                let packageValue = 0;
                if (placementInfo && placementInfo.package) {
                  packageValue = parseFloat(placementInfo.package);
                } else if (student.placementPackage) {
                  packageValue = parseFloat(student.placementPackage);
                }

                if (!isNaN(packageValue) && packageValue > 0) {
                  // Update department statistics
                  if (deptStats.placed === 1) {
                    deptStats.averagePackage = packageValue;
                  } else {
                    deptStats.averagePackage =
                      (deptStats.averagePackage * (deptStats.placed - 1) +
                        packageValue) /
                      deptStats.placed;
                  }

                  deptStats.highestPackage = Math.max(
                    deptStats.highestPackage,
                    packageValue
                  );
                }
              }
            }
          }
        });

        // Convert Maps to arrays and format the data
        const formattedBatches = Array.from(batchesMap.values()).map(
          (batch) => ({
            ...batch,
            departments: Array.from(batch.departments.values()).map((dept) => ({
              ...dept,
              companies: Array.from(dept.companies),
              averagePackage:
                dept.averagePackage > 0
                  ? dept.averagePackage.toFixed(2) + " LPA"
                  : "0 LPA",
              highestPackage:
                dept.highestPackage > 0
                  ? dept.highestPackage.toFixed(2) + " LPA"
                  : "0 LPA",
            })),
          })
        );

        // Sort batches by year (newest first)
        formattedBatches.sort((a, b) => {
          const yearA = parseInt(a.year.split("-")[0]);
          const yearB = parseInt(b.year.split("-")[0]);
          return yearB - yearA;
        });

        console.log("Processed batch data:", formattedBatches);
        setBatches(formattedBatches);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching batch data:", err);
        setError("Failed to fetch batch data. Please try again later.");
        setLoading(false);

        // Fall back to sample data if API failed
        console.log("Falling back to sample data due to error");
        const sampleData = createSampleData();
        setBatches(sampleData);
      }
    };

    fetchBatchesData();
  }, []);

  const showNotification = (message, type = "success") => {
    // Handle both old (message, type) and new (message only) formats
    const notificationType = typeof type === "string" ? type : "success";
    setNotification({ message, type: notificationType });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownload = (type, department) => {
    if (type === "excel") {
      // Export to Excel
      const workbook = XLSX.utils.book_new();

      // Create worksheet data
      const wsData = [
        ["Department Statistics Report"],
        ["Department Name", department.name],
        ["Total Students", department.totalStudents],
        ["Placed Students", department.placed],
        ["Average Package", department.averagePackage],
        ["Highest Package", department.highestPackage],
        [],
        ["Companies"],
        ...(department.companies || []).map((company) => [company]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(workbook, ws, department.name);

      // Generate Excel file
      XLSX.writeFile(workbook, `${department.name}_Statistics.xlsx`);
      showNotification(
        `Successfully exported ${department.name} statistics to Excel`
      );
    } else if (type === "report") {
      // Generate PDF report
      // For now, we'll just show a notification
      showNotification("PDF report generation will be implemented soon");
    }
  };

  const handleAddBatch = async (batchYear) => {
    try {
      const [startYear] = batchYear.split("-");
      const isCompleted = parseInt(startYear) + 4 <= new Date().getFullYear();

      // Create with department codes, not full names
      const newBatch = {
        id: batchYear,
        year: batchYear,
        isCompleted,
        departments: Object.keys(departmentMapping).map((deptCode) => ({
          name: deptCode,
          totalStudents: 0,
          placed: 0,
          placedSoFar: 0,
          averagePackage: "0 LPA",
          highestPackage: "0 LPA",
          companies: [],
          ongoingPlacements: !isCompleted,
        })),
      };

      setBatches((prev) => [...prev, newBatch]);
      showNotification(`Successfully added batch ${batchYear}`);
    } catch (error) {
      showNotification("Failed to add batch. Please try again.", "error");
    }
  };

  const filteredBatches = batches
    .filter(
      (batch) =>
        batch.year.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDepartment === "All Departments" ||
          batch.departments.some(
            (dept) =>
              dept.name === selectedDepartment ||
              dept.name === departmentCodeFromName[selectedDepartment] ||
              departmentMapping[dept.name] === selectedDepartment
          ))
    )
    .sort((a, b) => b.year.localeCompare(a.year));

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
          <div className="text-xl text-gray-600">Loading batch data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen bg-gray-50 p-6 w-full">
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
                  onDownload={handleDownload}
                  selectedDepartment={selectedDepartment}
                  showNotification={showNotification}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No batches found</p>
              </div>
            )}
          </div>

          <DownloadModal
            isOpen={downloadModal.open}
            onClose={() =>
              setDownloadModal({ open: false, type: null, department: null })
            }
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
