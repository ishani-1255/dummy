import React, { useState } from "react";
import axios from "axios";
import {
  FileText,
  Search,
  ChevronDown,
  Clock,
  Calendar,
  Award,
  Trash2,
  ExternalLink,
  Plus,
  Upload,
  Loader2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";

// API URL
const API_URL = "http://localhost:6400/api";

// Card Components
const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`p-4 ${className || ""}`}>{children}</div>;
};

// Alert Component
const Alert = ({ children, variant = "error", onClose }) => {
  const bgColors = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg border ${bgColors[variant]}`}
    >
      {variant === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
      {variant === "success" && <Check className="h-5 w-5 mr-2" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:bg-white/20 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ score }) => {
  let color;
  let text;

  if (score >= 85) {
    color = "bg-green-100 text-green-800";
    text = "Excellent Match";
  } else if (score >= 70) {
    color = "bg-blue-100 text-blue-800";
    text = "Good Match";
  } else {
    color = "bg-yellow-100 text-yellow-800";
    text = "Needs Improvement";
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};

const ATSScoreAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [keywordMatches, setKeywordMatches] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [activeTab, setActiveTab] = useState("score");
  const [extractSuccess, setExtractSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (
      selectedFile.type !== "application/pdf" &&
      selectedFile.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setError("Invalid file type. Only PDF and DOCX files are allowed.");
      return;
    }

      setFile(selectedFile);
      setFileName(selectedFile.name);

    // Extract text from file immediately
    await extractTextFromFile(selectedFile);
  };

  const extractTextFromFile = async (fileToExtract) => {
    try {
      setIsExtracting(true);
      setError(null);
      setExtractSuccess(false);

      // Create form data
      const formData = new FormData();
      formData.append("file", fileToExtract);

      // Call API to extract text
      const response = await axios.post(`${API_URL}/resume/extract`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setResumeText(response.data.text);
        setExtractSuccess(true);
        // Auto-scroll to the job description textarea
      setTimeout(() => {
          const jobDescTextarea = document.getElementById(
            "job-description-textarea"
          );
          if (jobDescTextarea) {
            jobDescTextarea.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            jobDescTextarea.focus();
          }
        }, 500);
      } else {
        setError("Failed to extract text from the resume file.");
      }
    } catch (err) {
      console.error("Error extracting text:", err);
      if (err.response?.status === 400) {
        setError(
          err.response.data.message ||
            "Invalid file format. Please upload a PDF file."
        );
      } else if (err.response?.status === 422) {
        setError(
          "Could not extract text from the PDF. The file may be scanned or image-based. Try a text-based PDF."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to extract text from file"
        );
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Check file type
      if (
        droppedFile.type !== "application/pdf" &&
        droppedFile.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setError("Invalid file type. Only PDF and DOCX files are allowed.");
        return;
      }

      setFile(droppedFile);
      setFileName(droppedFile.name);

      // Extract text from file immediately
      await extractTextFromFile(droppedFile);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) return;

    try {
    setIsAnalyzing(true);
      setError(null);

      // Call API to analyze resume
      const response = await axios.post(`${API_URL}/resume/analyze`, {
        resumeText,
        jobDescription,
      });

      if (response.data.success) {
        const analysisData = response.data.analysis;

        setScore(analysisData.score);
        setFeedback(analysisData.feedback || []);
        setKeywordMatches(analysisData.keywordMatches || []);

        // Switch to score tab
        setActiveTab("score");
      } else {
        setError("Failed to analyze resume against job description.");
      }
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to analyze resume"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeResume();
  };

  // Stats (will be updated when we have real data)
  const stats = {
    analyzed: score !== null ? 1 : 0,
    average: score || 0,
    highest: score || 0,
    improved: 0,
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-72">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Resume ATS Score Analyzer
            </h1>

            {score !== null && (
              <div className="hidden md:flex items-center bg-blue-100 rounded-full px-4 py-1">
                <span className="text-blue-700 mr-2">Your Score:</span>
                <span className="text-blue-800 font-bold text-xl">{score}</span>
              </div>
            )}
          </div>

          {/* Error display */}
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Stats Overview - Only visible after analysis */}
          {score !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Your ATS Score
                      </p>
                      <p className="text-2xl font-bold">{score}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Resumes Analyzed
                      </p>
                      <p className="text-2xl font-bold">{stats.analyzed}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Keywords Matched
                      </p>
                      <p className="text-2xl font-bold">
                        {keywordMatches.filter((k) => k.found).length}/
                        {keywordMatches.length}
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Search className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Match Rating
                      </p>
                      <p className="text-2xl font-bold">
                        {score >= 85
                          ? "Excellent"
                          : score >= 70
                          ? "Good"
                          : "Fair"}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {score === null ? (
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Upload Your Resume & Job Description
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div
                    className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isExtracting}
                    />

                    <div className="flex flex-col items-center justify-center">
                      <div className="p-3 bg-blue-100 rounded-full mb-3">
                        {isExtracting ? (
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        ) : (
                        <Upload className="w-8 h-8 text-blue-600" />
                        )}
                      </div>

                      {fileName ? (
                        <div>
                          <p className="text-blue-600 font-medium text-lg">
                            {fileName}
                          </p>
                          <p className="text-gray-500 mt-1">
                            {isExtracting
                              ? "Extracting text..."
                              : "Click or drag to change file"}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-blue-600 font-medium text-lg">
                            Drag & Drop your resume here
                          </p>
                          <p className="text-gray-500 mt-1">
                            or click to browse your files
                          </p>
                          <p className="text-xs text-gray-400 mt-3">
                            Supported formats: PDF, DOCX
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {resumeText && (
                    <Card>
                      <CardContent className="bg-gray-50">
                        <h3 className="text-sm font-medium text-blue-700 mb-2">
                          Extracted Text:
                        </h3>
                        <div className="max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-600">{resumeText}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Job Description
                    </label>
                    <textarea
                      id="job-description-textarea"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here to compare with your resume..."
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      disabled={isAnalyzing}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !resumeText ||
                      !jobDescription ||
                      isAnalyzing ||
                      isExtracting
                    }
                    className={`w-full p-3 rounded-lg font-medium text-white transition-all duration-300 ${
                      !resumeText ||
                      !jobDescription ||
                      isAnalyzing ||
                      isExtracting
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow"
                    }`}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Analyzing Resume...
                      </div>
                    ) : (
                      "Analyze Resume"
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Analysis Results */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`p-4 text-center font-medium ${
                      activeTab === "score"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setActiveTab("score")}
                  >
                    Analysis
                  </button>
                  <button
                    className={`p-4 text-center font-medium ${
                      activeTab === "keywords"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setActiveTab("keywords")}
                  >
                    Keywords
                  </button>
                </div>
              </div>

              {activeTab === "score" ? (
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {feedback.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-100"
                        >
                          <div className="flex-shrink-0 w-6 h-6 mt-1 mr-3">
                            {item.type === "positive" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="#059669"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {item.type === "improvement" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="#2563EB"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {item.type === "critical" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="#DC2626"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <span
                              className={`text-gray-700 ${
                                item.type === "critical" ? "font-medium" : ""
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          setScore(null);
                          setFile(null);
                          setFileName("");
                          setJobDescription("");
                          setResumeText("");
                          setFeedback([]);
                          setKeywordMatches([]);
                        }}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={() => analyzeResume()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center">
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Analyzing...
                          </div>
                        ) : (
                          "Re-Analyze"
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Keyword Analysis
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Based on the job description, we've identified these
                      important keywords:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {keywordMatches.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-3 rounded-lg ${
                            item.found
                              ? "bg-green-50 border border-green-100"
                              : "bg-red-50 border border-red-100"
                          }`}
                        >
                          <div className="mr-3">
                            {item.found ? (
                              <svg
                                className="w-5 h-5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                          </div>
                          <div>
                            <span
                              className={`${
                                item.found ? "text-green-700" : "text-red-700"
                              } font-medium`}
                            >
                              {item.keyword}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <h4 className="font-medium text-blue-700">Pro Tip</h4>
                      </div>
                      <p className="text-blue-600 text-sm">
                        Adding missing keywords naturally throughout your resume
                        can significantly improve your ATS score. Focus on the
                        skills and qualifications that genuinely match your
                        experience.
                      </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          setScore(null);
                          setFile(null);
                          setFileName("");
                          setJobDescription("");
                          setResumeText("");
                          setFeedback([]);
                          setKeywordMatches([]);
                        }}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={() => analyzeResume()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center">
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Analyzing...
                          </div>
                        ) : (
                          "Re-Analyze"
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add a success message after text extraction */}
              {extractSuccess && resumeText && !error && (
                <Alert
                  variant="success"
                  onClose={() => setExtractSuccess(false)}
                >
                  Text successfully extracted! Now paste the job description to
                  analyze.
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSScoreAnalyzer;
