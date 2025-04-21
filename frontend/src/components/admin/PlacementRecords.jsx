import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Building2,
  Users,
  Printer,
  FileText,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle,
  X,
  BookOpen,
  Briefcase,
  Server,
  Search,
  Database,
  Ruler,
  Network,
  AlertCircle,
  FlaskConical,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Star,
  Filter,
} from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardHeader,
  CardHeader1,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Alert,
  AlertDescription,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  ScrollArea,
} from "./UIComponents";
import Sidebar from "./Sidebar";
// Enhanced dummy data with offer letter links and dream placement status
const departments = [
  {
    id: 1,
    name: "Computer Science",
    icon: <Server className="h-6 w-6" />,
    totalStudents: 120,
  },
  {
    id: 2,
    name: "Electronics",
    icon: <Network className="h-6 w-6" />,
    totalStudents: 100,
  },
  {
    id: 3,
    name: "Mechanical",
    icon: <Ruler className="h-6 w-6" />,
    totalStudents: 90,
  },
  {
    id: 4,
    name: "Safety Fire",
    icon: <BookOpen className="h-6 w-6" />,
    totalStudents: 80,
  },
  {
    id: 5,
    name: "Information Technology",
    icon: <Database className="h-6 w-6" />,
    totalStudents: 110,
  },
  {
    id: 6,
    name: "Civil",
    icon: <Building2 className="h-6 w-6" />,
    totalStudents: 85,
  },
];

// Sample companies data
const initialCompanies = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    departments: [1, 2, 5],
    logo: "TS",
    placements: [
      {
        id: 1,
        studentId: "CS001",
        name: "John Doe",
        department: 1,
        package: 1200000,
        role: "Software Engineer",
        joiningDate: "2024-07-01",
        location: "Bangalore",
        year: 2024,
        offerLetterLink: "https://example.com/offer/cs001.pdf",
        isDreamPlacement: true,
      },
      {
        id: 2,
        studentId: "IT002",
        name: "Alice Smith",
        department: 5,
        package: 1000000,
        role: "Frontend Developer",
        joiningDate: "2024-07-15",
        location: "Hyderabad",
        year: 2024,
        offerLetterLink: "https://example.com/offer/it002.pdf",
        isDreamPlacement: false,
      },
    ],
  },
  {
    id: 2,
    name: "InnovateX Pvt Ltd",
    departments: [1, 3, 6],
    logo: "IX",
    placements: [
      {
        id: 3,
        studentId: "ME003",
        name: "Robert Brown",
        department: 3,
        package: 800000,
        role: "Mechanical Design Engineer",
        joiningDate: "2024-08-01",
        location: "Pune",
        year: 2024,
        offerLetterLink: "https://example.com/offer/me003.pdf",
        isDreamPlacement: false,
      },
    ],
  },
  {
    id: 3,
    name: "CyberNet Global",
    departments: [2, 4, 5],
    logo: "CG",
    placements: [
      {
        id: 4,
        studentId: "EC004",
        name: "Emily Davis",
        department: 2,
        package: 1100000,
        role: "Embedded Systems Engineer",
        joiningDate: "2024-06-20",
        location: "Chennai",
        year: 2024,
        offerLetterLink: "https://example.com/offer/ec004.pdf",
        isDreamPlacement: true,
      },
      {
        id: 5,
        studentId: "SF005",
        name: "Daniel White",
        department: 4,
        package: 900000,
        role: "Fire Safety Consultant",
        joiningDate: "2024-07-10",
        location: "Mumbai",
        year: 2024,
        offerLetterLink: "https://example.com/offer/sf005.pdf",
        isDreamPlacement: false,
      },
    ],
  },
];

// Configure axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6400";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Define department mapping for consistency across components
const departmentMapping = {
  CSE: {
    id: 1,
    name: "Computer Science",
    icon: <Server className="h-6 w-6" />,
  },
  IT: {
    id: 5,
    name: "Information Technology",
    icon: <Database className="h-6 w-6" />,
  },
  EC: { id: 2, name: "Electronics", icon: <Network className="h-6 w-6" /> },
  ME: { id: 3, name: "Mechanical", icon: <Ruler className="h-6 w-6" /> },
  SFE: { id: 4, name: "Safety Fire", icon: <BookOpen className="h-6 w-6" /> },
  CE: { id: 6, name: "Civil", icon: <Building2 className="h-6 w-6" /> },
  EEE: {
    id: 7,
    name: "Electrical",
    icon: <FlaskConical className="h-6 w-6" />,
  },
};

// Notification component with different styles for success, error, and warning
const NotificationAlert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
  };

  const iconStyles = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  };

  return (
    <Alert
      className={`fixed top-4 right-4 w-96 border ${alertStyles[type]} animate-in slide-in-from-top-2 z-50`}
    >
      <div className="flex items-center space-x-3">
        {iconStyles[type]}
        <AlertDescription className="flex-1">{message}</AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};
const PrintableDepartmentStats = ({ department, companies, onClose }) => {
  const departmentPlacements = companies.flatMap((company) =>
    company.placements.filter((p) => p.department === department.id)
  );

  const metrics = {
    totalPlacements: departmentPlacements.length,
    dreamPlacements: departmentPlacements.filter((p) => p.isDreamPlacement)
      .length,
    averagePackage: departmentPlacements.length
      ? (
          departmentPlacements.reduce((acc, p) => acc + p.package, 0) /
          departmentPlacements.length /
          100000
        ).toFixed(2)
      : "0",
    highestPackage: departmentPlacements.length
      ? (
          Math.max(...departmentPlacements.map((p) => p.package)) / 100000
        ).toFixed(2)
      : "0",
  };

  const companyStats = companies
    .filter((company) =>
      company.placements.some((p) => p.department === department.id)
    )
    .map((company) => {
      const companyPlacements = company.placements.filter(
        (p) => p.department === department.id
      );
      return {
        name: company.name,
        totalStudents: companyPlacements.length,
        dreamPlacements: companyPlacements.filter((p) => p.isDreamPlacement)
          .length,
        averagePackage: (
          companyPlacements.reduce((acc, p) => acc + p.package, 0) /
          companyPlacements.length /
          100000
        ).toFixed(2),
        roles: [...new Set(companyPlacements.map((p) => p.role))],
      };
    });

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${department.name} Department - Placement Statistics</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { margin-bottom: 20px; }
          .department-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
          .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .metric-title { font-size: 14px; color: #666; }
          .metric-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
          .section-title { font-size: 18px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
          .roles { color: #666; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="department-name">${
            department.name
          } Department - Placement Statistics</div>
          <div>Generated on ${new Date().toLocaleDateString()}</div>
        </div>


        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-title">Total Placements</div>
            <div class="metric-value">${metrics.totalPlacements}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Dream Placements</div>
            <div class="metric-value">${metrics.dreamPlacements}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Average Package</div>
            <div class="metric-value">${metrics.averagePackage} LPA</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Highest Package</div>
            <div class="metric-value">${metrics.highestPackage} LPA</div>
          </div>
        </div>


        <div class="section-title">Company-wise Statistics</div>
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Students Placed</th>
              <th>Dream Placements</th>
              <th>Average Package (LPA)</th>
              <th>Roles Offered</th>
            </tr>
          </thead>
          <tbody>
            ${companyStats
              .map(
                (company) => `
              <tr>
                <td>${company.name}</td>
                <td>${company.totalStudents}</td>
                <td>${company.dreamPlacements}</td>
                <td>${company.averagePackage}</td>
                <td class="roles">${company.roles.join(", ")}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>


        <div class="footer">
          * Dream placement is considered for packages >= 7 LPA
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
  printWindow.onafterprint = onClose;
};

const DepartmentMetrics = ({ departmentId, companies }) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const metrics = useMemo(() => {
    const departmentPlacements = companies.flatMap((c) =>
      c.placements.filter((p) => p.department === departmentId)
    );

    const dreamPlacements = departmentPlacements.filter(
      (p) => p.isDreamPlacement
    ).length;
    const totalPlacements = departmentPlacements.length;
    const packages = departmentPlacements.map((p) => p.package);

    return {
      totalPlacements,
      dreamPlacements,
      averagePackage: packages.length
        ? (
            packages.reduce((a, b) => a + b, 0) /
            packages.length /
            100000
          ).toFixed(2)
        : "0",
      highestPackage: packages.length
        ? (Math.max(...packages) / 100000).toFixed(2)
        : "0",
    };
  }, [departmentId, companies]);

  const metricsData = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: metrics.totalPlacements,
      label: "Total Placements",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      value: metrics.dreamPlacements,
      label: "Dream Placements",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      value: `${metrics.averagePackage} LPA`,
      label: "Average Package",
    },
    {
      icon: <Award className="h-6 w-6 text-purple-500" />,
      value: `${metrics.highestPackage} LPA`,
      label: "Highest Package",
    },
  ];

  const handlePrint = () => {
    const department = departments.find((d) => d.id === departmentId);
    PrintableDepartmentStats({
      department,
      companies,
      onClose: () => setShowPrintDialog(false),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Department Statistics</h2>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print Department Statistics</span>
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                {metric.icon}
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Student form component for adding/editing students
const StudentForm = ({ student, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    student || {
      studentId: "",
      name: "",
      package: "",
      offerLetterLink: "",
      department: "",
      role: "",
      joiningDate: "",
      location: "",
      year: new Date().getFullYear(),
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const packageValue = parseFloat(formData.package);
    onSubmit({
      ...formData,
      package: packageValue,
      isDreamPlacement: packageValue >= 7,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Student ID</label>
          <Input
            placeholder="e.g., CS001"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Package (LPA)
          </label>
          <Input
            type="number"
            placeholder="e.g., 12.5"
            value={formData.package}
            onChange={(e) =>
              setFormData({ ...formData, package: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Role</label>
          <Input
            placeholder="e.g., Software Engineer"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Location</label>
          <Input
            placeholder="e.g., Bangalore"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Joining Date</label>
          <Input
            type="date"
            value={formData.joiningDate}
            onChange={(e) =>
              setFormData({ ...formData, joiningDate: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">
          Offer Letter Link
        </label>
        <Input
          placeholder="https://..."
          value={formData.offerLetterLink}
          onChange={(e) =>
            setFormData({ ...formData, offerLetterLink: e.target.value })
          }
          required
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

// Printable view component
const PrintableStudentList = ({ companyName, students }) => {
  return (
    <div className="hidden print:block p-8">
      <h1 className="text-2xl font-bold mb-6">
        {companyName} - Placed Students
      </h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Package (LPA)</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Location</th>
            <th className="border p-2 text-left">Joining Date</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border p-2">{student.studentId}</td>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">
                {(student.package / 100000).toFixed(2)}
              </td>
              <td className="border p-2">{student.role}</td>
              <td className="border p-2">{student.location}</td>
              <td className="border p-2">
                {new Date(student.joiningDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Company card component
const CompanyCard = ({ company, departmentId }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [placements, setPlacements] = useState(company.placements);
  const [showDetails, setShowDetails] = useState(false);

  const departmentPlacements = useMemo(
    () => company.placements.filter((p) => p.department === departmentId),
    [company, departmentId]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPlacements = departmentPlacements.length;
    const packages = departmentPlacements.map((p) => p.package);
    const avgPackage = packages.length
      ? packages.reduce((sum, val) => sum + val, 0) / packages.length
      : 0;
    const maxPackage = packages.length ? Math.max(...packages) : 0;
    const minPackage = packages.length ? Math.min(...packages) : 0;
    const roles = [...new Set(departmentPlacements.map((p) => p.role))];
    const dreamPlacements = departmentPlacements.filter(
      (p) => p.isDreamPlacement
    ).length;

    // Get placement years
    const years = [...new Set(departmentPlacements.map((p) => p.year))];

    // Get locations
    const locations = [...new Set(departmentPlacements.map((p) => p.location))];

    return {
      totalPlacements,
      avgPackage: (avgPackage / 100000).toFixed(2),
      maxPackage: (maxPackage / 100000).toFixed(2),
      minPackage: (minPackage / 100000).toFixed(2),
      roles,
      dreamPlacements,
      years,
      locations,
    };
  }, [departmentPlacements]);

  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now(),
      department: departmentId,
      isDreamPlacement: parseFloat(studentData.package) >= 7,
    };
    const updatedPlacements = [...placements, newStudent];
    setPlacements(updatedPlacements);
    company.placements = updatedPlacements; // Update company.placements as well

    setShowAddStudent(false);
    setNotification({
      type: "success",
      message: "Student added successfully!",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditStudent = (studentData) => {
    const updatedPlacements = placements.map((p) =>
      p.id === selectedStudent.id
        ? {
            ...studentData,
            id: selectedStudent.id,
            department: departmentId,
            isDreamPlacement: parseFloat(studentData.package) >= 7, // Compare with 7 LPA for dream placement
          }
        : p
    );

    setPlacements(updatedPlacements);
    company.placements = updatedPlacements; // Update company.placements as well

    setSelectedStudent(null);
    setNotification({
      type: "success",
      message: "Student details updated successfully!",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteStudent = () => {
    const updatedPlacements = placements.filter(
      (p) => p.id !== selectedStudent.id
    );
    setPlacements(updatedPlacements);
    company.placements = updatedPlacements; // Update company.placements as well

    setShowDeleteConfirm(false);
    setSelectedStudent(null);
    setNotification({
      type: "success",
      message: "Student record deleted successfully!",
    });
    setTimeout(() => setNotification(null), 1000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const studentRows = departmentPlacements
      .map(
        (student) => `
        <tr>
          <td class="border p-2">${student.studentId}</td>
          <td class="border p-2">${student.name}</td>
          <td class="border p-2">${(student.package / 100000).toFixed(2)}</td>
          <td class="border p-2">${student.role}</td>
          <td class="border p-2">${student.location}</td>
          <td class="border p-2">${new Date(
            student.joiningDate
          ).toLocaleDateString()}</td>
          <td class="border p-2">${
            student.isDreamPlacement ? "Dream" : "Regular"
          }</td>
        </tr>
      `
      )
      .join("");

    const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${company.name} - Placed Students</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .header { margin-bottom: 20px; }
              .company-name { font-size: 24px; font-weight: bold; }
              .department { color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">${company.name}</div>
              <div class="department">Department: ${
                departments.find((d) => d.id === departmentId)?.name
              }</div>
              <div>Total Students: ${departmentPlacements.length}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Package (LPA)</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${studentRows}
              </tbody>
            </table>
          </body>
        </html>
      `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="mb-6">
      <CardHeader1 className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>{company.name}</CardTitle>
            <p className="text-sm text-gray-500">
              {departmentPlacements.length} students placed • Average Package:{" "}
              {stats.avgPackage} LPA
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print student placement details</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog
            open={showAddStudent}
            onOpenChange={(open) => {
              setShowAddStudent(open);
              if (!open) setSelectedStudent(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <StudentForm
                onSubmit={handleAddStudent}
                onClose={() => setShowAddStudent(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader1>

      {showDetails && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-4 gap-6 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Total Placements
              </h4>
              <p className="text-lg font-semibold">{stats.totalPlacements}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Dream Placements
              </h4>
              <p className="text-lg font-semibold">
                {stats.dreamPlacements}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  (
                  {Math.round(
                    (stats.dreamPlacements / stats.totalPlacements) * 100
                  ) || 0}
                  %)
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Package Range
              </h4>
              <p className="text-lg font-semibold">
                {stats.minPackage} - {stats.maxPackage} LPA
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Years</h4>
              <p className="text-lg font-semibold">
                {stats.years.sort().join(", ")}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Roles Offered
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.roles.map((role, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.locations.map((location, index) => (
                <Badge
                  key={index}
                  className="bg-gray-100 text-gray-800 flex items-center"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <CardContent>
        <div className="print:hidden">
          <ScrollArea className="max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Package (LPA)</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Offer Letter</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentPlacements.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      {(student.package / 100000).toFixed(2)}
                    </TableCell>
                    <TableCell>{student.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {student.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {new Date(student.joiningDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.isDreamPlacement ? (
                        <Badge className="bg-green-100 text-green-800 flex items-center w-fit">
                          <Star className="h-3 w-3 mr-1" />
                          Dream
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={student.offerLetterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Edit student details
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Delete student record
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Edit Student Dialog */}
        <Dialog
          open={selectedStudent && !showDeleteConfirm}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedStudent(null);
              setShowDeleteConfirm(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Student Details</DialogTitle>
            </DialogHeader>
            <StudentForm
              student={selectedStudent}
              onSubmit={handleEditStudent}
              onClose={() => setSelectedStudent(null)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteConfirm}
          onOpenChange={(open) => {
            setShowDeleteConfirm(open);
            if (!open) setSelectedStudent(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete {selectedStudent?.name}'s
                record? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteStudent}>
                Delete Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Printable View */}
        <PrintableStudentList
          companyName={company.name}
          students={departmentPlacements}
        />

        {/* Notification */}
        {notification && (
          <NotificationAlert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Main component
const EnhancedDepartments = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Additional filter states
  const [packageFilter, setPackageFilter] = useState({ min: "", max: "" });
  const [roleFilter, setRoleFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Convert departmentMapping to an array for rendering
  const departments = Object.values(departmentMapping);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching placement records...");

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

        // Fetch students to get department information
        const studentsResponse = await axios
          .get("/api/admin/students", {
            withCredentials: true,
          })
          .catch((error) => {
            console.error("Failed to fetch students:", error);
            return { data: [] };
          });

        const companiesData = companiesResponse.data || [];
        const placementsData = placementsResponse.data || [];
        const studentsData = studentsResponse.data || [];

        console.log(
          `Fetched ${companiesData.length} companies, ${placementsData.length} placements, ${studentsData.length} students`
        );

        // Create a mapping of student IDs to departments
        const studentMap = new Map();
        studentsData.forEach((student) => {
          if (student._id && student.department) {
            studentMap.set(student._id, student);
          }
        });

        // Process the data to create company objects with placements
        const processedCompanies = companiesData
          .map((company) => {
            // Find placements for this company
            const companyPlacements = placementsData.filter(
              (placement) =>
                placement.company &&
                ((typeof placement.company === "object" &&
                  placement.company._id === company._id) ||
                  (typeof placement.company === "string" &&
                    placement.company === company._id))
            );

            // Process placements to include department info and other details
            const processedPlacements = companyPlacements
              .map((placement) => {
                const student = studentMap.get(placement.studentId);
                const deptCode = student ? student.department : null;
                // Map department code to department ID for display
                const department =
                  deptCode && departmentMapping[deptCode]
                    ? departmentMapping[deptCode].id
                    : null;

                return {
                  id: placement._id,
                  studentId: student
                    ? student.universityId || "Unknown"
                    : "Unknown",
                  name: student
                    ? `${student.firstName} ${student.lastName}`.trim()
                    : "Unknown Student",
                  department: department,
                  package: parseFloat(placement.package) || 0,
                  role: placement.role || "Not specified",
                  joiningDate:
                    placement.joiningDate ||
                    new Date().toISOString().split("T")[0],
                  location: placement.location || "Not specified",
                  year: new Date(
                    placement.createdAt || Date.now()
                  ).getFullYear(),
                  offerLetterLink: placement.offerLetterLink || "#",
                  isDreamPlacement: (parseFloat(placement.package) || 0) >= 7,
                };
              })
              .filter((p) => p.department !== null); // Only include placements where we know the department

            // Get the departments this company has hired from
            const departments = [
              ...new Set(processedPlacements.map((p) => p.department)),
            ];

            return {
              id: company._id,
              name: company.name,
              departments: departments,
              logo: company.name.substring(0, 2).toUpperCase(),
              placements: processedPlacements,
            };
          })
          .filter((company) => company.placements.length > 0); // Only include companies with placements

        console.log(
          `Processed ${processedCompanies.length} companies with placements`
        );

        if (processedCompanies.length > 0) {
          setCompanies(processedCompanies);

          // Select the first department by default if none is selected
          if (!selectedDepartment) {
            // Find the first department that has placements
            const firstDeptWithPlacements = Object.values(
              departmentMapping
            ).find((dept) =>
              processedCompanies.some((company) =>
                company.departments.includes(dept.id)
              )
            );

            if (firstDeptWithPlacements) {
              setSelectedDepartment(firstDeptWithPlacements);
            }
          }
        } else {
          // If no real data, fall back to sample data
          console.log("No placement data found, using sample data");
          setCompanies(initialCompanies);
          setSelectedDepartment(departments[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching placement data:", err);
        setError("Failed to fetch placement data");
        setLoading(false);

        // Fall back to sample data
        setCompanies(initialCompanies);
        setSelectedDepartment(departments[0]);
      }
    };

    fetchData();
  }, []);

  const filteredCompanies = useMemo(
    () =>
      companies.filter((company) => {
        // Basic filter - company must have placements in selected department
        if (!company.departments.includes(selectedDepartment?.id)) {
          return false;
        }

        // Company name search
        if (
          searchTerm &&
          !company.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        // Filter placements within each company
        const filteredPlacements = company.placements.filter((placement) => {
          // Department filter
          if (placement.department !== selectedDepartment?.id) {
            return false;
          }

          // Package filter (min and max)
          const packageValue = placement.package / 100000; // Convert to LPA
          if (
            packageFilter.min &&
            !isNaN(parseFloat(packageFilter.min)) &&
            packageValue < parseFloat(packageFilter.min)
          ) {
            return false;
          }
          if (
            packageFilter.max &&
            !isNaN(parseFloat(packageFilter.max)) &&
            packageValue > parseFloat(packageFilter.max)
          ) {
            return false;
          }

          // Role filter
          if (
            roleFilter &&
            !placement.role.toLowerCase().includes(roleFilter.toLowerCase())
          ) {
            return false;
          }

          // Year filter
          if (yearFilter && placement.year !== parseInt(yearFilter)) {
            return false;
          }

          // Location filter
          if (
            locationFilter &&
            !placement.location
              .toLowerCase()
              .includes(locationFilter.toLowerCase())
          ) {
            return false;
          }

          return true;
        });

        // Only include company if it has matching placements after all filters
        return filteredPlacements.length > 0;
      }),
    [
      companies,
      selectedDepartment,
      searchTerm,
      packageFilter,
      roleFilter,
      yearFilter,
      locationFilter,
    ]
  );

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading placement records...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex h-screen w-full items-center justify-center">
          <Alert className="max-w-md border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex h-screen bg-gray-100 w-full">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Current Placement Records
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>
            </div>

            {showFilters && (
              <Card className="p-4 mb-6">
                <h2 className="font-semibold mb-3">Advanced Filters</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Package Range (LPA)
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={packageFilter.min}
                        onChange={(e) =>
                          setPackageFilter({
                            ...packageFilter,
                            min: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={packageFilter.max}
                        onChange={(e) =>
                          setPackageFilter({
                            ...packageFilter,
                            max: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Role
                    </label>
                    <Input
                      placeholder="e.g. Software Engineer"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Placement Year
                    </label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Years</SelectItem>
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Location
                    </label>
                    <Input
                      placeholder="e.g. Bangalore"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setPackageFilter({ min: "", max: "" });
                        setRoleFilter("");
                        setYearFilter("");
                        setLocationFilter("");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-4 gap-4">
              {departments.map((dept) => (
                <Button
                  key={dept.id}
                  variant={
                    selectedDepartment?.id === dept.id ? "default" : "outline"
                  }
                  className={`h-24 ${
                    selectedDepartment?.id === dept.id
                      ? `bg-${dept.color}-600 hover:bg-${dept.color}-700`
                      : ""
                  }`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">{dept.icon}</div>
                    <span className="font-medium">{dept.name}</span>
                  </div>
                </Button>
              ))}
            </div>

            {selectedDepartment && (
              <>
                <DepartmentMetrics
                  departmentId={selectedDepartment.id}
                  companies={companies}
                />

                {filteredCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    departmentId={selectedDepartment.id}
                  />
                ))}

                {filteredCompanies.length === 0 && (
                  <Card className="p-8 text-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No companies found</p>
                    <p className="text-gray-500">
                      Try adjusting your search terms
                    </p>
                  </Card>
                )}
              </>
            )}

            {notification && (
              <NotificationAlert
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDepartments;
