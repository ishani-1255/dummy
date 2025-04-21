import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  PlusCircle,
  Search,
  Loader,
  CheckCircle,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../admin/UIComponents";
import * as XLSX from "xlsx";
import AdminLayout from "./AdminLayout";

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
const BatchCard = ({
  batch,
  showNotification,
  isSelected,
  toggleSelection,
}) => {
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
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden mb-6 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            {toggleSelection && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection();
                }}
                className={`w-5 h-5 mr-3 rounded border ${
                  isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                } flex items-center justify-center cursor-pointer`}
              >
                {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {batch.year} Batch
              </h3>
              <p className="text-sm text-gray-500">
                {batch.isCompleted ? "Completed" : "Ongoing Placements"}
              </p>
            </div>
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

  // Add state for batch comparison
  const [compareBatches, setCompareBatches] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [batchComparisonData, setBatchComparisonData] = useState(null);

  // Fetch batches data from database
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoDataFound(false);

        // Get batches data
        const response = await axios.get("/api/admin/batches", {
          withCredentials: true,
        });

        if (response.data && response.data.length === 0) {
          // If API returns empty array, create demo batches
          createDemoBatches();
        } else {
          setBatches(response.data);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to load batches data. Please try again.");

        // On error, create demo batches to allow interface testing
        createDemoBatches();
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  // Create demo batches when API fails
  const createDemoBatches = () => {
    const currentYear = new Date().getFullYear();
    const demoBatches = [];

    // Create 3 batches: current year and 2 previous years
    for (let i = 0; i < 3; i++) {
      const year = currentYear - i;
      const startYear = year - 4;
      const batchYear = `${startYear}-${year}`;

      demoBatches.push({
        year: batchYear,
        isCompleted: i > 0, // Only current batch is not completed
        departments: Object.keys(departmentMapping).map((deptCode) => ({
          name: deptCode,
          totalStudents: Math.floor(Math.random() * 80) + 40, // 40-120 students
          placed: Math.floor(Math.random() * 60) + 20, // 20-80 placements
          averagePackage: `${(Math.random() * 8 + 4).toFixed(2)} LPA`,
          highestPackage: `${(Math.random() * 30 + 10).toFixed(2)} LPA`,
          companies: ["TCS", "Infosys", "Wipro", "Microsoft", "Google"].slice(
            0,
            Math.floor(Math.random() * 4) + 2
          ), // 2-5 companies
        })),
      });
    }

    setBatches(demoBatches);
    showNotification("Using demo data. Connect to API for real data.");
  };

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Add a new batch
  const handleAddBatch = async (batchYear) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/admin/batches",
        { year: batchYear },
        { withCredentials: true }
      );

      setBatches([...batches, response.data]);
      setAddBatchModal(false);
      showNotification(`Batch ${batchYear} added successfully`);
    } catch (err) {
      console.error("Error adding batch:", err);
      showNotification(
        `Error: ${err.response?.data?.message || "Failed to add batch"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle batch comparison
  const toggleBatchComparison = () => {
    setCompareBatches(!compareBatches);
    if (!compareBatches) {
      setSelectedBatches([]);
      setBatchComparisonData(null);
    }
  };

  // Toggle batch selection for comparison
  const toggleBatchSelection = (batchYear) => {
    if (selectedBatches.includes(batchYear)) {
      setSelectedBatches(selectedBatches.filter((year) => year !== batchYear));
    } else {
      // Limit selection to 2-3 batches for meaningful comparison
      if (selectedBatches.length < 3) {
        setSelectedBatches([...selectedBatches, batchYear]);
      } else {
        showNotification("You can compare up to 3 batches at a time");
      }
    }
  };

  // Compare selected batches
  const compareBatchesData = async () => {
    if (selectedBatches.length < 2) {
      showNotification("Please select at least 2 batches to compare");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/admin/compare-batches",
        { batchYears: selectedBatches },
        { withCredentials: true }
      );

      setBatchComparisonData(response.data);
    } catch (err) {
      console.error("Error comparing batches:", err);
      showNotification("Failed to compare batches");
    } finally {
      setLoading(false);
    }
  };

  // Filter batches based on search and department selection
  const filteredBatches = batches.filter((batch) => {
    // Filter by search term (match batch year)
    const matchesSearch = batch.year.toString().includes(searchTerm);

    // Filter by department if not "All Departments"
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      batch.departments.some(
        (dept) =>
          departmentMapping[dept.name] === selectedDepartment ||
          dept.name === selectedDepartment
      );

    return matchesSearch && matchesDepartment;
  });

  // Render batch comparison component
  const BatchComparisonView = () => {
    if (!batchComparisonData) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Batch Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  {selectedBatches.map((batch) => (
                    <th
                      key={batch}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {batch} Batch
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Total Students
                  </td>
                  {selectedBatches.map((batch) => (
                    <td
                      key={batch}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {batchComparisonData[batch]?.totalStudents || 0}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Placed Students
                  </td>
                  {selectedBatches.map((batch) => (
                    <td
                      key={batch}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {batchComparisonData[batch]?.placedStudents || 0}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Placement Rate
                  </td>
                  {selectedBatches.map((batch) => {
                    const data = batchComparisonData[batch];
                    const rate =
                      data?.totalStudents > 0
                        ? (
                            (data.placedStudents / data.totalStudents) *
                            100
                          ).toFixed(1)
                        : "0.0";
                    return (
                      <td
                        key={batch}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {rate}%
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Average Package
                  </td>
                  {selectedBatches.map((batch) => (
                    <td
                      key={batch}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {batchComparisonData[batch]?.averagePackage || "0 LPA"}
                    </td>
                  ))}
                </tr>

                {/* Department-wise comparison */}
                <tr className="bg-gray-50">
                  <td
                    colSpan={selectedBatches.length + 1}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department-wise Placement Rate
                  </td>
                </tr>
                {Object.keys(departmentMapping).map((dept) => (
                  <tr key={dept}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {departmentMapping[dept]}
                    </td>
                    {selectedBatches.map((batch) => {
                      const deptData = batchComparisonData[
                        batch
                      ]?.departments.find((d) => d.name === dept);
                      const rate =
                        deptData && deptData.totalStudents > 0
                          ? (
                              (deptData.placed / deptData.totalStudents) *
                              100
                            ).toFixed(1)
                          : "0.0";
                      return (
                        <td
                          key={batch}
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {rate}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Placement Batches
          </h1>
          <div className="flex gap-2">
            <Button
              variant={compareBatches ? "default" : "outline"}
              onClick={toggleBatchComparison}
            >
              {compareBatches ? "Cancel Comparison" : "Compare Batches"}
            </Button>
            <Button onClick={() => setAddBatchModal(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Batch
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg md:w-64"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Batch comparison controls */}
        {compareBatches && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select batches to compare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {batches.map((batch) => (
                  <div
                    key={batch.year}
                    onClick={() => toggleBatchSelection(batch.year)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors
                      ${
                        selectedBatches.includes(batch.year)
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }
                    `}
                  >
                    {batch.year}
                  </div>
                ))}
              </div>
              <Button
                disabled={selectedBatches.length < 2}
                onClick={compareBatchesData}
              >
                Compare Selected Batches
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Batch comparison results */}
        {compareBatches && batchComparisonData && <BatchComparisonView />}

        {/* Loading state */}
        {loading && batches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading batch data...</p>
          </div>
        )}

        {/* Error state */}
        {error && batches.length === 0 && (
          <Card className="bg-red-50 border-red-100">
            <CardContent className="flex flex-col items-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg text-red-700 font-medium mb-2">
                Error Loading Batches
              </p>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No data state */}
        {noDataFound && (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Batch Data Found
              </h3>
              <p className="text-gray-500 mb-4">
                There are no batches in the system yet.
              </p>
              <Button onClick={() => setAddBatchModal(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add First Batch
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Batch cards */}
        <div className="space-y-6">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.year}
              batch={batch}
              showNotification={showNotification}
              isSelected={selectedBatches.includes(batch.year)}
              toggleSelection={
                compareBatches ? () => toggleBatchSelection(batch.year) : null
              }
            />
          ))}
        </div>

        {/* Add Batch Modal */}
        <AddBatchModal
          isOpen={addBatchModal}
          onClose={() => setAddBatchModal(false)}
          onAdd={handleAddBatch}
        />

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Batches;
