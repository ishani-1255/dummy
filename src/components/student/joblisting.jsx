import React, { useState, useMemo, useRef, useEffect } from "react";

import {
  Building2,
  User,
  Users,
  Briefcase,
  Search,
  Filter,
  X,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MapPin,
  DollarSign,
  Award,
  BookOpen,
  Bell,
  Download,
  ChevronDown,
  FileText,
  ExternalLink,
  Clock,
  Bookmark,
  Info,
  AlertCircle,
  CheckSquare,
  XSquare,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../admin/UIComponents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../admin/UIComponents";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../admin/UIComponents";
import Sidebar from "./Sidebar";
import axios from "axios";

// Replace the initialJobs with empty array since we'll fetch from API
const initialJobs = [];

// Alert Component
const Alert = ({ children, variant = "success", onClose, icon }) => {
  const bgColor = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }[variant];

  const IconComponent =
    icon ||
    {
      success: () => <CheckCircle className="h-5 w-5" />,
      error: () => <AlertTriangle className="h-5 w-5" />,
      warning: () => <AlertCircle className="h-5 w-5" />,
      info: () => <Info className="h-5 w-5" />,
    }[variant];

  return (
    <div
      className={`fixed bottom-4 right-4 w-96 p-4 rounded-lg border ${bgColor} shadow-lg animate-slide-up z-50`}
    >
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
  const companiesHiring = new Set(jobs.map((job) => job.company)).size;
  const upcomingDeadlines = jobs.filter((job) => {
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
              <p className="text-sm font-medium text-gray-500">
                Open Positions
              </p>
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
              <p className="text-sm font-medium text-gray-500">
                Companies Hiring
              </p>
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
              <p className="text-sm font-medium text-gray-500">
                Closing This Week
              </p>
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

    console.log(`Checking eligibility for ${job.title}:`);
    console.log("Student department:", studentProfile.department);
    console.log("Student batch:", studentProfile.batch);
    console.log("Job eligible departments:", eligibilityCriteria.departments);
    console.log("Job eligible batches:", eligibilityCriteria.batch);

    // Case-insensitive department matching
    const studentDept = studentProfile.department.toUpperCase();
    const normalizedJobDepts = eligibilityCriteria.departments.map((dept) =>
      typeof dept === "string" ? dept.toUpperCase() : dept
    );

    // Check if student's batch is eligible
    let batchMatch = false;
    if (eligibilityCriteria.batch && eligibilityCriteria.batch.length > 0) {
      batchMatch = eligibilityCriteria.batch.includes(studentProfile.batch);
    } else {
      // If no batches are specified, consider it a match
      batchMatch = true;
    }

    console.log("Normalized student department:", studentDept);
    console.log("Normalized job departments:", normalizedJobDepts);
    console.log("Batch match:", batchMatch);

    const departmentMatch = normalizedJobDepts.includes(studentDept);
    const cgpaMatch = studentProfile.cgpa >= eligibilityCriteria.minCGPA;
    const backlogsMatch =
      studentProfile.activeBacklogs <= eligibilityCriteria.activeBacklogs;
    const yearMatch =
      studentProfile.yearOfPassing === eligibilityCriteria.yearOfPassing;

    console.log("Department match:", departmentMatch);
    console.log("CGPA match:", cgpaMatch);
    console.log("Backlogs match:", backlogsMatch);
    console.log("Year match:", yearMatch);

    return (
      departmentMatch && cgpaMatch && backlogsMatch && yearMatch && batchMatch
    );
  }, [job, studentProfile]);

  // Calculate days remaining until deadline
  const daysRemaining = useMemo(() => {
    const deadline = new Date(job.deadline);
    const now = new Date();
    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  }, [job.deadline]);

  // Check if deadline has passed
  const isDeadlinePassed = daysRemaining <= 0;

  return (
    <Card
      className={`mb-4 border-l-4 ${
        isEligible ? "border-l-green-500" : "border-l-red-400"
      } transition-all duration-200 hover:shadow-md`}
    >
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
              <div
                className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  daysRemaining <= 3
                    ? "bg-red-100 text-red-800"
                    : daysRemaining <= 7
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} left`
                  : "Deadline passed"}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              {expanded ? "Show Less" : "Show More"}
              <ChevronDown
                className={`h-4 w-4 ml-1 transition-transform ${
                  expanded ? "transform rotate-180" : ""
                }`}
              />
            </button>

            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bookmark className="h-5 w-5" />
              </button>

              <button
                onClick={() => onApply(job)}
                disabled={!isEligible || hasApplied || isDeadlinePassed}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  hasApplied
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : isDeadlinePassed
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : isEligible
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-red-500 text-white cursor-not-allowed"
                }`}
              >
                {hasApplied
                  ? "Applied"
                  : isDeadlinePassed
                  ? "Deadline Passed"
                  : isEligible
                  ? "Apply Now"
                  : "Not Eligible"}
              </button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-200 p-4">
            <div className="mb-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 text-sm">
                {job.description || "No description available"}
              </p>
            </div>

            {job.updates && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Updates</h4>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-gray-700 text-sm">{job.updates}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {job.requirements.length > 0 ? (
                    job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))
                  ) : (
                    <li>No specific requirements provided</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{job.email || "Not provided"}</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{job.phone || "Not provided"}</span>
                  </li>
                  {job.website && (
                    <li className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <a
                        href={job.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {job.website}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Eligibility Section */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Eligibility Criteria</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">
                      Eligible Departments
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {job.eligibilityCriteria.departments.join(", ")}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">
                      Eligible Batches
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {job.eligibilityCriteria.batch &&
                    job.eligibilityCriteria.batch.length > 0
                      ? job.eligibilityCriteria.batch.join(", ")
                      : "All batches eligible"}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Minimum CGPA</span>
                  </div>
                  <p className="text-sm mt-1">
                    {job.eligibilityCriteria.minCGPA}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">
                      Backlogs Allowed
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {job.eligibilityCriteria.activeBacklogs}
                  </p>
                </div>
              </div>
            </div>

            {!isEligible && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <h4 className="font-medium flex items-center text-red-800 mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Eligibility Criteria Not Met
                </h4>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {!job.eligibilityCriteria.departments.includes(
                    studentProfile.department
                  ) && (
                    <li>
                      Department requirement:{" "}
                      {job.eligibilityCriteria.departments.join(", ")}
                    </li>
                  )}
                  {job.eligibilityCriteria.batch &&
                    job.eligibilityCriteria.batch.length > 0 &&
                    !job.eligibilityCriteria.batch.includes(
                      studentProfile.batch
                    ) && (
                      <li>
                        Batch requirement:{" "}
                        {job.eligibilityCriteria.batch.join(", ")} (Your batch:{" "}
                        {studentProfile.batch})
                      </li>
                    )}
                  {studentProfile.cgpa < job.eligibilityCriteria.minCGPA && (
                    <li>
                      Minimum CGPA required: {job.eligibilityCriteria.minCGPA}{" "}
                      (Your CGPA: {studentProfile.cgpa})
                    </li>
                  )}
                  {studentProfile.activeBacklogs >
                    job.eligibilityCriteria.activeBacklogs && (
                    <li>
                      Maximum active backlogs allowed:{" "}
                      {job.eligibilityCriteria.activeBacklogs} (Your backlogs:{" "}
                      {studentProfile.activeBacklogs})
                    </li>
                  )}
                  {studentProfile.yearOfPassing !==
                    job.eligibilityCriteria.yearOfPassing && (
                    <li>
                      Year of passing requirement:{" "}
                      {job.eligibilityCriteria.yearOfPassing} (Your year:{" "}
                      {studentProfile.yearOfPassing})
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Visit Date Section */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Important Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md flex items-start">
                  <Calendar className="h-4 w-4 mt-0.5 mr-2 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium">
                      Company Visit Date
                    </span>
                    <p className="text-sm">
                      {new Date(job.deadline).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md flex items-start">
                  <Calendar className="h-4 w-4 mt-0.5 mr-2 text-green-600" />
                  <div>
                    <span className="text-sm font-medium">Posted Date</span>
                    <p className="text-sm">
                      {new Date(job.postedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Instructions */}
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-600" />
                Application Instructions
              </h4>
              <p className="text-sm text-gray-700">
                To apply for this position, click the "Apply Now" button above.
                You will need to upload your resume and may be asked to provide
                additional information.
              </p>
              {job.applicationProcess && job.applicationProcess.length > 0 && (
                <ol className="list-decimal list-inside text-sm text-gray-700 mt-2 space-y-1">
                  {job.applicationProcess.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              )}
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </span>
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
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply for {job.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              companyId: job.id,
              resume: resumeLink,
              coverLetter,
              additionalInfo,
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Resume/CV Link
              </label>
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">
                  Please provide a public link to your resume/CV document
                  (Google Drive, Dropbox, etc.)
                </p>
                <input
                  type="url"
                  placeholder="https://drive.google.com/your-resume-link"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cover Letter
              </label>
              <textarea
                rows="5"
                placeholder="Tell us why you're interested in this position and why you would be a good fit..."
                className="w-full p-2 border rounded-lg resize-none"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Information
              </label>
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
              disabled={!resumeLink}
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
    "Chemical",
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
                onChange={() =>
                  setFilters({
                    ...filters,
                    showEligible: !filters.showEligible,
                  })
                }
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-700">
                Show eligible jobs only
              </span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Job Type</h4>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.jobTypes.includes(type)}
                  onChange={() => {
                    const newJobTypes = filters.jobTypes.includes(type)
                      ? filters.jobTypes.filter((t) => t !== type)
                      : [...filters.jobTypes, type];
                    setFilters({ ...filters, jobTypes: newJobTypes });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
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
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
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
                value={filters.minSalary || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minSalary: e.target.value ? parseInt(e.target.value) : "",
                  })
                }
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
                value={filters.maxSalary || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxSalary: e.target.value ? parseInt(e.target.value) : "",
                  })
                }
                className="pl-7 p-2 w-full text-sm border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Deadline</h4>
          <div className="space-y-2">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={filters.hideExpired}
                onChange={() =>
                  setFilters({
                    ...filters,
                    hideExpired: !filters.hideExpired,
                  })
                }
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-700">
                Hide jobs with passed deadlines
              </span>
            </label>
            <select
              value={filters.deadline}
              onChange={(e) =>
                setFilters({ ...filters, deadline: e.target.value })
              }
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
    </div>
  );
};

const JobListing = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filters, setFilters] = useState({
    showEligible: false,
    jobTypes: [],
    departments: [],
    location: "",
    minSalary: "",
    maxSalary: "",
    deadline: "",
    hideExpired: false,
  });
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Student profile will be fetched from current user session
  const [studentProfile, setStudentProfile] = useState({
    name: "",
    registrationNumber: "",
    department: "",
    yearOfPassing: 0,
    cgpa: 0,
    activeBacklogs: 0,
  });

  // Fetch student profile and companies data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch current user profile
        const userResponse = await axios.get(
          "http://localhost:6400/current-user",
          {
            withCredentials: true,
          }
        );

        if (userResponse.data.success && userResponse.data.user) {
          const userData = userResponse.data.user;

          setStudentProfile({
            name: userData.name,
            registrationNumber: userData.registrationNumber,
            department: userData.branch,
            yearOfPassing: parseInt(userData.yearOfAdmission) + 4, // Estimate graduation year
            yearOfAdmission: parseInt(userData.yearOfAdmission),
            batch: `${userData.yearOfAdmission}-${
              parseInt(userData.yearOfAdmission) + 4
            }`, // Add batch
            cgpa: userData.cgpa,
            activeBacklogs: userData.backlog || 0,
          });

          // Fetch companies based on student's department
          const companiesResponse = await axios.get(
            `http://localhost:6400/api/companies?department=${userData.branch}`,
            {
              withCredentials: true,
            }
          );

          console.log("Student department:", userData.branch);
          console.log("All companies:", companiesResponse.data);

          // We can directly use the filtered companies from the server
          const filteredCompanies = companiesResponse.data;
          console.log("Filtered companies:", filteredCompanies);

          // Transform the company data to match our job structure
          const transformedJobs = filteredCompanies.map((company) => {
            console.log(
              `Transforming company ${company.name} with department:`,
              company.department
            );

            // Ensure department is always an array
            const departments = Array.isArray(company.department)
              ? company.department
              : company.department
              ? [company.department]
              : [];

            // Ensure batch is always an array
            const batches = Array.isArray(company.batch)
              ? company.batch
              : company.batch
              ? [company.batch]
              : [];

            console.log(
              `Normalized departments for ${company.name}:`,
              departments
            );
            console.log(`Normalized batches for ${company.name}:`, batches);

            return {
              id: company._id,
              title: company.name,
              company: company.industry,
              logo: company.name.substring(0, 2).toUpperCase(),
              location: company.location,
              type: "Full-time", // Could be more dynamic based on company data
              salary: company.package,
              deadline: new Date(company.visitingDate)
                .toISOString()
                .split("T")[0],
              postedDate: new Date(company.createdAt)
                .toISOString()
                .split("T")[0],
              description: company.description || "",
              updates: company.updates || "",
              email: company.email,
              phone: company.phone || "",
              website: company.website || "",
              requirements: company.requirements
                ? company.requirements.split("\n").filter((line) => line.trim())
                : [],
              responsibilities: [],
              eligibilityCriteria: {
                departments: departments,
                batch: batches,
                minCGPA: company.minimumCgpa,
                activeBacklogs: company.backlogsAllowed,
                yearOfPassing: parseInt(userData.yearOfAdmission) + 4, // Assuming 4-year program
              },
              applicationProcess: [],
              applicationsCount: 0,
            };
          });

          setJobs(transformedJobs);

          // Fetch student's applications
          const applicationsResponse = await axios.get(
            "http://localhost:6400/api/applications",
            {
              withCredentials: true,
            }
          );

          if (applicationsResponse.data) {
            // Transform applications to include company IDs
            const transformedApplications = applicationsResponse.data.map(
              (app) => {
                // Check if company exists and is a valid object with an ID
                const companyExists =
                  app.company &&
                  typeof app.company === "object" &&
                  app.company._id;

                return {
                  ...app,
                  company: companyExists ? app.company._id : null,
                  // Add a flag to indicate deleted companies
                  companyDeleted: !companyExists,
                };
              }
            );
            setApplications(transformedApplications);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply the filters to the jobs
  useEffect(() => {
    let result = [...jobs];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    // Filter out expired jobs if the hideExpired filter is active
    if (filters.hideExpired) {
      const now = new Date();
      result = result.filter((job) => {
        const deadline = new Date(job.deadline);
        return deadline >= now;
      });
    }

    // Eligibility filter
    if (filters.showEligible) {
      result = result.filter((job) => {
        const { eligibilityCriteria } = job;
        const deadline = new Date(job.deadline);
        const now = new Date();
        const deadlineNotPassed = deadline >= now;

        // Check if student's batch is eligible
        let batchMatch = true;
        if (eligibilityCriteria.batch && eligibilityCriteria.batch.length > 0) {
          batchMatch = eligibilityCriteria.batch.includes(studentProfile.batch);
        }

        return (
          deadlineNotPassed &&
          eligibilityCriteria.departments.includes(studentProfile.department) &&
          studentProfile.cgpa >= eligibilityCriteria.minCGPA &&
          studentProfile.activeBacklogs <= eligibilityCriteria.activeBacklogs &&
          studentProfile.yearOfPassing === eligibilityCriteria.yearOfPassing &&
          batchMatch
        );
      });
    }

    // Job type filter
    if (filters.jobTypes.length > 0) {
      result = result.filter((job) => filters.jobTypes.includes(job.type));
    }

    // Department filter
    if (filters.departments.length > 0) {
      result = result.filter((job) =>
        job.eligibilityCriteria.departments.some((dept) =>
          filters.departments.includes(dept)
        )
      );
    }

    // Location filter
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      result = result.filter((job) =>
        job.location.toLowerCase().includes(locationQuery)
      );
    }

    // Salary filter
    if (filters.minSalary) {
      result = result.filter((job) => {
        const salaryMatch = job.salary.match(/₹([\d,]+)/);
        if (salaryMatch) {
          const minJobSalary = parseInt(salaryMatch[1].replace(/,/g, ""));
          return minJobSalary >= filters.minSalary;
        }
        return true;
      });
    }

    if (filters.maxSalary) {
      result = result.filter((job) => {
        const salaryMatch = job.salary.match(/₹([\d,]+)/);
        if (salaryMatch) {
          const maxJobSalary = parseInt(salaryMatch[1].replace(/,/g, ""));
          return maxJobSalary <= filters.maxSalary;
        }
        return true;
      });
    }

    // Deadline filter
    if (filters.deadline) {
      const now = new Date();
      result = result.filter((job) => {
        const deadline = new Date(job.deadline);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        switch (filters.deadline) {
          case "today":
            return diffDays === 0;
          case "this-week":
            return diffDays >= 0 && diffDays <= 7;
          case "next-week":
            return diffDays > 7 && diffDays <= 14;
          case "this-month":
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
  const handleSubmitApplication = async (applicationData) => {
    try {
      const response = await axios.post(
        "http://localhost:6400/api/applications",
        {
          companyId: selectedJob.id,
          resume: applicationData.resume,
          coverLetter: applicationData.coverLetter,
          additionalInfo: applicationData.additionalInfo,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        // Add the new application to the applications state
        const newApplication = {
          ...response.data,
          company: selectedJob.id, // Set company to the ID for consistency with hasAppliedToJob
        };

        // Update applications state immediately to reflect the change
        setApplications((prevApplications) => [
          ...prevApplications,
          newApplication,
        ]);

        // Close the modal
        setIsModalOpen(false);

        // Show success message
        setAlert({
          type: "success",
          message: `Your application for ${selectedJob.title} has been submitted successfully!`,
        });

        // Optional: Refresh applications from server to ensure data consistency
        fetchApplications();
      }
    } catch (err) {
      console.error("Error submitting application:", err);

      // Check if the error is due to already having applied
      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "You have already applied for this job"
      ) {
        setAlert({
          type: "warning",
          message: "You have already applied for this job.",
        });

        // Even if there's an error because user already applied, refresh the applications list
        // to make sure our UI shows the correct state
        fetchApplications();
      } else {
        setAlert({
          type: "error",
          message:
            err.response?.data?.message ||
            "Failed to submit application. Please try again.",
        });
      }
    }

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Add a separate function to fetch applications that can be called after submission
  const fetchApplications = async () => {
    try {
      const applicationsResponse = await axios.get(
        "http://localhost:6400/api/applications",
        {
          withCredentials: true,
        }
      );

      if (applicationsResponse.data) {
        // Transform applications to include company IDs
        const transformedApplications = applicationsResponse.data.map((app) => {
          // Check if company exists and is a valid object with an ID
          const companyExists =
            app.company && typeof app.company === "object" && app.company._id;

          return {
            ...app,
            company: companyExists ? app.company._id : null,
            // Add a flag to indicate deleted companies
            companyDeleted: !companyExists,
          };
        });
        setApplications(transformedApplications);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // Check if user has applied to a job
  const hasAppliedToJob = (jobId) => {
    return applications.some((app) => {
      // Skip applications where the company has been deleted
      if (app.companyDeleted || !app.company) {
        return false;
      }

      // Handle case where company might be an object or string
      const companyId =
        typeof app.company === "object" ? app.company._id : app.company;

      return (
        companyId === jobId &&
        app.status !== "Rejected" &&
        app.status !== "Declined"
      );
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      showEligible: false,
      jobTypes: [],
      departments: [],
      location: "",
      minSalary: "",
      maxSalary: "",
      deadline: "",
      hideExpired: false,
    });
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 max-w-md">
            <h3 className="font-bold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error
            </h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 ml-72">
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
                  {filteredJobs.map((job) => (
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any jobs matching your criteria. Try
                    adjusting your filters or search query.
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
        <Alert variant={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
    </div>
  );
};

export default JobListing;
