import React, { useState, useMemo, useRef, useEffect } from 'react';

import {
  Building2, User, Users, Briefcase, Search, Filter, X, Calendar,
  AlertTriangle, CheckCircle, MapPin, DollarSign, Award, BookOpen,
  Bell, Download, ChevronDown, FileText, ExternalLink, Clock, Bookmark,
  Info, AlertCircle, CheckSquare, XSquare, Mail
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../admin/UIComponents';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../admin/UIComponents';


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../admin/UIComponents';
import Sidebar from "./Sidebar";


// Initial job listings data
const initialJobs = [
  {
    id: 1,
    title: "Software Developer Intern",
    company: "Tech Solutions Inc",
    logo: "TS",
    location: "Bangalore",
    type: "Internship",
    salary: "₹25,000 - ₹30,000/month",
    deadline: "2025-04-15",
    postedDate: "2025-03-01",
    description: "We are looking for passionate software development interns to join our innovative team.",
    requirements: [
      "Currently pursuing B.Tech/B.E in Computer Science or related field",
      "Knowledge of JavaScript, React, and Node.js",
      "Good problem-solving skills",
      "Eager to learn new technologies"
    ],
    responsibilities: [
      "Assist in developing and maintaining web applications",
      "Debug and fix issues in existing codebase",
      "Participate in code reviews and team meetings",
      "Learn and implement best practices in software development"
    ],
    eligibilityCriteria: {
      departments: ["Computer Science", "Information Technology"],
      minCGPA: 7.5,
      activeBacklogs: 0,
      yearOfPassing: 2026
    },
    applicationProcess: [
      "Resume screening",
      "Online coding test",
      "Technical interview",
      "HR interview"
    ],
    applicationsCount: 45
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Global Analytics Ltd",
    logo: "GA",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹6,00,000 - ₹8,00,000/year",
    deadline: "2025-04-20",
    postedDate: "2025-03-05",
    description: "Join our data analytics team to help derive meaningful insights from complex datasets.",
    requirements: [
      "B.Tech/B.E in any engineering discipline",
      "Strong knowledge of SQL and Excel",
      "Familiarity with data visualization tools",
      "Basic understanding of statistical methods"
    ],
    responsibilities: [
      "Analyze large datasets to identify trends and patterns",
      "Create dashboards and reports for management",
      "Collaborate with cross-functional teams",
      "Present findings and recommendations"
    ],
    eligibilityCriteria: {
      departments: ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical"],
      minCGPA: 7.0,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Analytical assessment",
      "Technical interview",
      "HR interview"
    ],
    applicationsCount: 32
  },
  {
    id: 3,
    title: "Mechanical Design Engineer",
    company: "Innovation Engineering Co",
    logo: "IE",
    location: "Pune",
    type: "Full-time",
    salary: "₹5,50,000 - ₹7,00,000/year",
    deadline: "2025-04-25",
    postedDate: "2025-03-08",
    description: "Design and develop mechanical systems for our next-generation products.",
    requirements: [
      "B.Tech/B.E in Mechanical Engineering",
      "Proficiency in CAD software (AutoCAD, SolidWorks)",
      "Understanding of manufacturing processes",
      "Knowledge of GD&T principles"
    ],
    responsibilities: [
      "Create detailed 3D models and 2D drawings",
      "Perform design analysis and optimization",
      "Collaborate with manufacturing team for product development",
      "Document design specifications and changes"
    ],
    eligibilityCriteria: {
      departments: ["Mechanical"],
      minCGPA: 7.5,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Design portfolio review",
      "Technical interview",
      "HR interview"
    ],
    applicationsCount: 18
  },
  {
    id: 4,
    title: "Electrical Engineer",
    company: "Power Systems Co",
    logo: "PS",
    location: "Chennai",
    type: "Full-time",
    salary: "₹5,00,000 - ₹7,50,000/year",
    deadline: "2025-05-10",
    postedDate: "2025-03-10",
    description: "Design, develop, and test electrical systems and components for industrial applications.",
    requirements: [
      "B.Tech/B.E in Electrical Engineering",
      "Knowledge of electrical circuits and power systems",
      "Familiarity with electrical safety standards",
      "Basic understanding of control systems"
    ],
    responsibilities: [
      "Design electrical schematics and layouts",
      "Perform electrical calculations and analyses",
      "Assist in testing and troubleshooting electrical systems",
      "Prepare technical documentation"
    ],
    eligibilityCriteria: {
      departments: ["Electrical"],
      minCGPA: 7.0,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Technical assessment",
      "Panel interview",
      "HR discussion"
    ],
    applicationsCount: 22
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "Web Wizards",
    logo: "WW",
    location: "Remote",
    type: "Full-time",
    salary: "₹7,00,000 - ₹9,00,000/year",
    deadline: "2025-04-30",
    postedDate: "2025-03-12",
    description: "Create engaging user interfaces for our suite of web applications.",
    requirements: [
      "B.Tech/B.E in Computer Science or related field",
      "Strong proficiency in HTML, CSS, and JavaScript",
      "Experience with React.js or similar frameworks",
      "Understanding of responsive design principles"
    ],
    responsibilities: [
      "Develop and maintain user interfaces",
      "Ensure cross-browser compatibility",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with backend developers and UX designers"
    ],
    eligibilityCriteria: {
      departments: ["Computer Science", "Information Technology"],
      minCGPA: 8.0,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Coding assignment",
      "Technical interview",
      "Culture fit interview"
    ],
    applicationsCount: 38
  },
  {
    id: 6,
    title: "Civil Engineer Trainee",
    company: "Construct Solutions",
    logo: "CS",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹4,50,000 - ₹5,50,000/year",
    deadline: "2025-05-15",
    postedDate: "2025-03-15",
    description: "Join our construction projects team to gain hands-on experience in civil engineering.",
    requirements: [
      "B.Tech/B.E in Civil Engineering",
      "Knowledge of AutoCAD and structural analysis",
      "Understanding of construction materials and methods",
      "Familiarity with building codes and standards"
    ],
    responsibilities: [
      "Assist in preparing construction drawings",
      "Perform site inspections and quality checks",
      "Help with quantity estimation and material planning",
      "Support project management activities"
    ],
    eligibilityCriteria: {
      departments: ["Civil"],
      minCGPA: 7.0,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Technical assessment",
      "Interview with project manager",
      "HR discussion"
    ],
    applicationsCount: 15
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Cloud Services Inc",
    logo: "CS",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹8,00,000 - ₹12,00,000/year",
    deadline: "2025-04-18",
    postedDate: "2025-03-05",
    description: "Streamline our development and deployment processes through automation and CI/CD pipelines.",
    requirements: [
      "B.Tech/B.E in Computer Science or related field",
      "Experience with Linux/Unix systems",
      "Knowledge of containerization (Docker, Kubernetes)",
      "Understanding of CI/CD pipelines"
    ],
    responsibilities: [
      "Set up and maintain CI/CD pipelines",
      "Manage cloud infrastructure (AWS, Azure, or GCP)",
      "Automate deployment processes",
      "Monitor system performance and security"
    ],
    eligibilityCriteria: {
      departments: ["Computer Science", "Information Technology"],
      minCGPA: 7.5,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Technical assessment",
      "System design interview",
      "HR discussion"
    ],
    applicationsCount: 28
  },
  {
    id: 8,
    title: "Chemical Process Engineer",
    company: "Chem Industries",
    logo: "CI",
    location: "Vadodara",
    type: "Full-time",
    salary: "₹5,00,000 - ₹7,00,000/year",
    deadline: "2025-05-20",
    postedDate: "2025-03-18",
    description: "Design and optimize chemical processes for manufacturing facilities.",
    requirements: [
      "B.Tech/B.E in Chemical Engineering",
      "Knowledge of process simulation software",
      "Understanding of chemical unit operations",
      "Familiarity with safety and environmental regulations"
    ],
    responsibilities: [
      "Design and optimize chemical processes",
      "Perform material and energy balance calculations",
      "Develop process flow diagrams and P&IDs",
      "Ensure compliance with safety and environmental standards"
    ],
    eligibilityCriteria: {
      departments: ["Chemical"],
      minCGPA: 7.0,
      activeBacklogs: 0,
      yearOfPassing: 2025
    },
    applicationProcess: [
      "Resume screening",
      "Technical assessment",
      "Process design interview",
      "HR discussion"
    ],
    applicationsCount: 14
  }
];


// Alert Component
const Alert = ({ children, variant = 'success', onClose, icon }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }[variant];


  const IconComponent = icon || {
    success: () => <CheckCircle className="h-5 w-5" />,
    error: () => <AlertTriangle className="h-5 w-5" />,
    warning: () => <AlertCircle className="h-5 w-5" />,
    info: () => <Info className="h-5 w-5" />
  }[variant];


  return (
    <div className={`fixed bottom-4 right-4 w-96 p-4 rounded-lg border ${bgColor} shadow-lg animate-slide-up z-50`}>
      <div className="flex items-start gap-3">
        <IconComponent />
        <div className="flex-1">{children}</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


// Stats Component
const StatsOverview = ({ jobs, applications }) => {
  const openPositions = jobs.length;
  const companiesHiring = new Set(jobs.map(job => job.company)).size;
  const upcomingDeadlines = jobs.filter(job => {
    const deadline = new Date(job.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;
 
  const appliedJobs = applications.length;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Open Positions</p>
              <p className="text-2xl font-bold">{openPositions}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
     
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Companies Hiring</p>
              <p className="text-2xl font-bold">{companiesHiring}</p>
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
     
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Closing This Week</p>
              <p className="text-2xl font-bold">{upcomingDeadlines}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
     
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Applied Jobs</p>
              <p className="text-2xl font-bold">{appliedJobs}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


// Job Card Component
const JobCard = ({ job, studentProfile, onApply, hasApplied }) => {
  const [expanded, setExpanded] = useState(false);
 
  // Check if student is eligible for this job
  const isEligible = useMemo(() => {
    const { eligibilityCriteria } = job;
   
    const departmentMatch = eligibilityCriteria.departments.includes(studentProfile.department);
    const cgpaMatch = studentProfile.cgpa >= eligibilityCriteria.minCGPA;
    const backlogsMatch = studentProfile.activeBacklogs <= eligibilityCriteria.activeBacklogs;
    const yearMatch = studentProfile.yearOfPassing === eligibilityCriteria.yearOfPassing;
   
    return departmentMatch && cgpaMatch && backlogsMatch && yearMatch;
  }, [job, studentProfile]);


  // Calculate days remaining until deadline
  const daysRemaining = useMemo(() => {
    const deadline = new Date(job.deadline);
    const now = new Date();
    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  }, [job.deadline]);


  return (
    <Card className={`mb-4 border-l-4 ${isEligible ? 'border-l-green-500' : 'border-l-red-400'} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                {job.logo}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <div className="flex space-x-4 mt-1 text-sm">
                  <span className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" /> {job.location}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Briefcase className="h-4 w-4 mr-1" /> {job.type}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <DollarSign className="h-4 w-4 mr-1" /> {job.salary}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center">
                {isEligible ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Eligible
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                    <XSquare className="h-3 w-3 mr-1" /> Not Eligible
                  </span>
                )}
              </div>
              <div className={`px-2 py-1 text-xs rounded-full flex items-center ${
                daysRemaining <= 3 ? 'bg-red-100 text-red-800' :
                daysRemaining <= 7 ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="h-3 w-3 mr-1" />
                {daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`
                  : 'Deadline passed'}
              </div>
            </div>
          </div>
         
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              {expanded ? 'Show Less' : 'Show More'}
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
            </button>
           
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bookmark className="h-5 w-5" />
              </button>
             
              <button
                onClick={() => onApply(job)}
                disabled={!isEligible || hasApplied}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  hasApplied
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : isEligible
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {hasApplied ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
       
        {expanded && (
          <div className="border-t border-gray-200 p-4">
            <div className="mb-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 text-sm">{job.description}</p>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
             
              <div>
                <h4 className="font-medium mb-2">Responsibilities</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
           
            {!isEligible && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <h4 className="font-medium flex items-center text-red-800 mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Eligibility Criteria Not Met
                </h4>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {!job.eligibilityCriteria.departments.includes(studentProfile.department) && (
                    <li>Department requirement: {job.eligibilityCriteria.departments.join(', ')}</li>
                  )}
                  {studentProfile.cgpa < job.eligibilityCriteria.minCGPA && (
                    <li>Minimum CGPA required: {job.eligibilityCriteria.minCGPA} (Your CGPA: {studentProfile.cgpa})</li>
                  )}
                  {studentProfile.activeBacklogs > job.eligibilityCriteria.activeBacklogs && (
                    <li>Maximum active backlogs allowed: {job.eligibilityCriteria.activeBacklogs} (Your backlogs: {studentProfile.activeBacklogs})</li>
                  )}
                  {studentProfile.yearOfPassing !== job.eligibilityCriteria.yearOfPassing && (
                    <li>Year of passing requirement: {job.eligibilityCriteria.yearOfPassing} (Your year: {studentProfile.yearOfPassing})</li>
                  )}
                </ul>
              </div>
            )}
           
            <div className="mt-4">
              <h4 className="font-medium mb-2">Application Process</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                {job.applicationProcess.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
           
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
              <span>{job.applicationsCount} applications</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


// Application Modal Component
const ApplicationModal = ({ isOpen, onClose, onSubmit, job }) => {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply for {job.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
       
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            jobId: job.id,
            resume,
            coverLetter,
            additionalInfo,
            appliedDate: new Date().toISOString()
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Resume/CV</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                {resume ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span>{resume.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResume(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop your resume/CV here or</p>
                    <label className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
                      <span>Browse files</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setResume(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
           
            <div>
              <label className="block text-sm font-medium mb-1">Cover Letter</label>
              <textarea
                rows="5"
                placeholder="Tell us why you're interested in this position and why you would be a good fit..."
                className="w-full p-2 border rounded-lg resize-none"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium mb-1">Additional Information</label>
              <textarea
                rows="3"
                placeholder="Any other information you'd like us to know..."
                className="w-full p-2 border rounded-lg resize-none"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </div>
         
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!resume}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Filter Sidebar Component
const FilterSidebar = ({ filters, setFilters, onReset }) => {
  const jobTypes = ["Full-time", "Internship", "Part-time"];
  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Chemical"
  ];
 
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" /> Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset
        </button>
      </div>
     
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Eligibility</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showEligible}
                onChange={() => setFilters({...filters, showEligible: !filters.showEligible})}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-700">Show eligible jobs only</span>
            </label>
          </div>
        </div>
       
        <div>
          <h4 className="text-sm font-medium mb-2">Job Type</h4>
          <div className="space-y-2">
            {jobTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.jobTypes.includes(type)}
                  onChange={() => {
                    const newJobTypes = filters.jobTypes.includes(type)
                      ? filters.jobTypes.filter(t => t !== type)
                      : [...filters.jobTypes, type];
                    setFilters({...filters, jobTypes: newJobTypes});
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>
       
        <div>
          <h4 className="text-sm font-medium mb-2">Department</h4>
          <div className="space-y-2">
            {departments.map(dept => (
              <label key={dept} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(dept)}
                  onChange={() => {
                    const newDepartments = filters.departments.includes(dept)
                      ? filters.departments.filter(d => d !== dept)
                      : [...filters.departments, dept];
                    setFilters({...filters, departments: newDepartments});
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">{dept}</span>
              </label>
            ))}
          </div>
        </div>
       
        <div>
          <h4 className="text-sm font-medium mb-2">Location</h4>
          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full p-2 text-sm border rounded-lg"
          />
        </div>
       
        <div>
          <h4 className="text-sm font-medium mb-2">Salary Range</h4>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                placeholder="Min"
                value={filters.minSalary || ''}
                onChange={(e) => setFilters({...filters, minSalary: e.target.value ? parseInt(e.target.value) : ''})}
                className="pl-7 p-2 w-full text-sm border rounded-lg"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxSalary || ''}
                onChange={(e) => setFilters({...filters, maxSalary: e.target.value ? parseInt(e.target.value) : ''})}
                className="pl-7 p-2 w-full text-sm border rounded-lg"
              />
            </div>
          </div>
        </div>
       
        <div>
          <h4 className="text-sm font-medium mb-2">Deadline</h4>
          <select
            value={filters.deadline}
            onChange={(e) => setFilters({...filters, deadline: e.target.value})}
            className="w-full p-2 text-sm border rounded-lg"
          >
            <option value="">All deadlines</option>
            <option value="today">Today</option>
            <option value="this-week">This week</option>
            <option value="next-week">Next week</option>
            <option value="this-month">This month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const JobListing = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filters, setFilters] = useState({
    showEligible: false,
    jobTypes: [],
    departments: [],
    location: '',
    minSalary: '',
    maxSalary: '',
    deadline: ''
  });
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
 
  // Mock student profile
  const studentProfile = {
    name: "Rahul Sharma",
    rollNumber: "CS21B101",
    department: "Computer Science",
    yearOfPassing: 2025,
    cgpa: 8.2,
    activeBacklogs: 0
  };
 
  // Apply the filters to the jobs
  useEffect(() => {
    let result = [...jobs];
   
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        job => job.title.toLowerCase().includes(query) ||
              job.company.toLowerCase().includes(query) ||
              job.description.toLowerCase().includes(query)
      );
    }
   
    // Eligibility filter
    if (filters.showEligible) {
      result = result.filter(job => {
        const { eligibilityCriteria } = job;
       
        return eligibilityCriteria.departments.includes(studentProfile.department) &&
               studentProfile.cgpa >= eligibilityCriteria.minCGPA &&
               studentProfile.activeBacklogs <= eligibilityCriteria.activeBacklogs &&
               studentProfile.yearOfPassing === eligibilityCriteria.yearOfPassing;
      });
    }
   
    // Job type filter
    if (filters.jobTypes.length > 0) {
      result = result.filter(job => filters.jobTypes.includes(job.type));
    }
   
    // Department filter
    if (filters.departments.length > 0) {
      result = result.filter(job =>
        job.eligibilityCriteria.departments.some(dept =>
          filters.departments.includes(dept)
        )
      );
    }
   
    // Location filter
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      result = result.filter(job => job.location.toLowerCase().includes(locationQuery));
    }
   
    // Salary filter
    if (filters.minSalary) {
      result = result.filter(job => {
        const salaryMatch = job.salary.match(/₹([\d,]+)/);
        if (salaryMatch) {
          const minJobSalary = parseInt(salaryMatch[1].replace(/,/g, ''));
          return minJobSalary >= filters.minSalary;
        }
        return true;
      });
    }
   
    if (filters.maxSalary) {
      result = result.filter(job => {
        const salaryMatch = job.salary.match(/₹([\d,]+)/);
        if (salaryMatch) {
          const maxJobSalary = parseInt(salaryMatch[1].replace(/,/g, ''));
          return maxJobSalary <= filters.maxSalary;
        }
        return true;
      });
    }
   
    // Deadline filter
    if (filters.deadline) {
      const now = new Date();
      result = result.filter(job => {
        const deadline = new Date(job.deadline);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
       
        switch (filters.deadline) {
          case 'today':
            return diffDays === 0;
          case 'this-week':
            return diffDays >= 0 && diffDays <= 7;
          case 'next-week':
            return diffDays > 7 && diffDays <= 14;
          case 'this-month':
            return diffDays >= 0 && diffDays <= 30;
          default:
            return true;
        }
      });
    }
   
    setFilteredJobs(result);
  }, [jobs, searchQuery, filters, studentProfile]);
 
  // Handle job application
  const handleApplyJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };
 
  // Submit application
  const handleSubmitApplication = (applicationData) => {
    setApplications([...applications, applicationData]);
    setIsModalOpen(false);
   
    setAlert({
      type: 'success',
      message: `Your application for ${selectedJob.title} at ${selectedJob.company} has been submitted successfully!`
    });
   
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
 
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      showEligible: false,
      jobTypes: [],
      departments: [],
      location: '',
      minSalary: '',
      maxSalary: '',
      deadline: ''
    });
    setSearchQuery('');
  };
 
  // Check if user has applied to a job
  const hasAppliedToJob = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

return (
    <div className='flex'>
      <Sidebar/>
      <div className="flex-1 min-h-screen bg-gray-50 ">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Campus Placement Portal</h1>
         
          <StatsOverview jobs={jobs} applications={applications} />
         
          <div className="mb-6 relative">
            <div className="flex w-full">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 p-3 w-full border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleResetFilters}
                className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
         
          <div className="flex gap-6">
            <div className="w-1/4">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
            </div>
           
            <div className="w-3/4">
              {filteredJobs.length > 0 ? (
                <div>
                  {filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      studentProfile={studentProfile}
                      onApply={handleApplyJob}
                      hasApplied={hasAppliedToJob(job.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any jobs matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
     
      {selectedJob && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitApplication}
          job={selectedJob}
        />
      )}
     
      {alert && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
    </div>
  );
};


export default JobListing;