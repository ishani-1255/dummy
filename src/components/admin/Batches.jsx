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
    (sum, dept) => sum + dept.totalStudents,
    0
  );
  const totalPlaced = departments.reduce((sum, dept) => sum + dept.placed, 0);
  const avgPackage =
    departments.reduce((sum, dept) => {
      const pkg = parseFloat(dept.averagePackage);
      return sum + (isNaN(pkg) ? 0 : pkg);
    }, 0) / departments.length;

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
  const placementPercentage =
    (department.placed / department.totalStudents) * 100 || 0;
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
          <p className="font-medium text-lg">{department.totalStudents}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Placed Students</p>
          <p className="font-medium text-lg">{department.placed}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Average Package</p>
          <p className="font-medium text-lg">{department.averagePackage}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Highest Package</p>
          <p className="font-medium text-lg">{department.highestPackage}</p>
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

const BatchCard = ({
  batch,
  onDownload,
  selectedDepartment,
  showNotification,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter departments based on selection and map department codes
  const filteredDepartments =
    selectedDepartment === "All Departments"
      ? batch.departments
      : batch.departments.filter(
          (dept) =>
            departmentMapping[dept.name] === selectedDepartment ||
            dept.name === selectedDepartment
        );

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Batch {batch.year}</CardTitle>
            {!batch.isCompleted && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Ongoing
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronDown
              className={`h-5 w-5 transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <BatchSummary departments={filteredDepartments} />

          <div className="divide-y border rounded-lg bg-white">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept, index) => (
                <DepartmentRow
                  key={index}
                  department={dept}
                  isCompleted={batch.isCompleted}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No departments found for the selected filter
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="outline"
              className="text-green-600 hover:bg-green-50"
              onClick={() => {
                const workbook = XLSX.utils.book_new();

                // Create summary worksheet
                const summaryData = [
                  ["Batch Summary Report - " + batch.year],
                  [
                    "Total Students",
                    filteredDepartments.reduce(
                      (sum, dept) => sum + dept.totalStudents,
                      0
                    ),
                  ],
                  [
                    "Total Placed",
                    filteredDepartments.reduce(
                      (sum, dept) => sum + dept.placed,
                      0
                    ),
                  ],
                  [],
                  ["Department-wise Statistics"],
                  [
                    "Department",
                    "Total Students",
                    "Placed",
                    "Placement %",
                    "Average Package",
                    "Highest Package",
                    "Companies",
                  ],
                  ...filteredDepartments.map((dept) => [
                    departmentMapping[dept.name] || dept.name,
                    dept.totalStudents,
                    dept.placed,
                    ((dept.placed / dept.totalStudents) * 100).toFixed(1) + "%",
                    dept.averagePackage,
                    dept.highestPackage,
                    (dept.companies || []).join(", "),
                  ]),
                ];

                const ws = XLSX.utils.aoa_to_sheet(summaryData);
                XLSX.utils.book_append_sheet(workbook, ws, "Batch Summary");

                // Generate Excel file
                XLSX.writeFile(workbook, `Batch_${batch.year}_Report.xlsx`);
                showNotification(
                  `Successfully exported batch ${batch.year} report`
                );
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Batch Report
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
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

        // Fetch students from all departments
        const departmentCodes = Object.keys(departmentMapping);
        const departmentPromises = departmentCodes.map((code) =>
          axios.get(`/api/admin/students/${code}`)
        );

        const responses = await Promise.all(departmentPromises);
        const allStudents = responses.flatMap((response) => response.data);

        // Group students by batch
        const batchesMap = new Map();

        allStudents.forEach((student) => {
          if (student.yearOfAdmission) {
            const batchYear = `${student.yearOfAdmission}-${
              parseInt(student.yearOfAdmission) + 4
            }`;
            if (!batchesMap.has(batchYear)) {
              batchesMap.set(batchYear, {
                id: batchYear,
                year: batchYear,
                isCompleted:
                  parseInt(student.yearOfAdmission) + 4 <=
                  new Date().getFullYear(),
                departments: new Map(),
              });
            }

            const batch = batchesMap.get(batchYear);
            const deptName = student.department;

            if (!batch.departments.has(deptName)) {
              batch.departments.set(deptName, {
                name: deptName,
                totalStudents: 0,
                placed: 0,
                placedSoFar: 0,
                averagePackage: 0,
                highestPackage: 0,
                companies: new Set(),
                ongoingPlacements: !batch.isCompleted,
              });
            }

            const deptStats = batch.departments.get(deptName);
            deptStats.totalStudents++;

            if (student.isPlaced) {
              deptStats.placed++;
              deptStats.placedSoFar++;
              if (student.placementCompany) {
                deptStats.companies.add(
                  typeof student.placementCompany === "object"
                    ? student.placementCompany.name
                    : student.placementCompany
                );
              }
              if (student.placementPackage) {
                const package_value = parseFloat(student.placementPackage);
                if (!isNaN(package_value)) {
                  deptStats.averagePackage =
                    (deptStats.averagePackage * (deptStats.placed - 1) +
                      package_value) /
                    deptStats.placed;
                  deptStats.highestPackage = Math.max(
                    deptStats.highestPackage,
                    package_value
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
              averagePackage: dept.averagePackage.toFixed(2) + " LPA",
              highestPackage: dept.highestPackage.toFixed(2) + " LPA",
            })),
          })
        );

        setBatches(formattedBatches);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching batch data:", err);
        setError("Failed to fetch batch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchBatchesData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
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
      // Here you would typically make an API call to add the batch
      // For now, we'll just update the local state
      const [startYear] = batchYear.split("-");
      const newBatch = {
        id: batchYear,
        year: batchYear,
        isCompleted: parseInt(startYear) + 4 <= new Date().getFullYear(),
        departments: departments.slice(1).map((dept) => ({
          name: dept,
          totalStudents: 0,
          placed: 0,
          placedSoFar: 0,
          averagePackage: "0 LPA",
          highestPackage: "0 LPA",
          companies: [],
          ongoingPlacements: true,
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
          batch.departments.some((dept) => dept.name === selectedDepartment))
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
