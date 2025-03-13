import React, { useState } from 'react';

const ATSScoreAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [keywordMatches, setKeywordMatches] = useState([]);
  const [resumeText, setResumeText] = useState('');
  const [activeTab, setActiveTab] = useState('score');
  
  // Mock keywords from job description
  const mockKeywords = [
    'React', 'JavaScript', 'UI/UX', 'Frontend', 'CSS', 'HTML', 
    'API integration', 'responsive design', 'TypeScript', 'Redux'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Simulate reading resume content
      setTimeout(() => {
        setResumeText("This is simulated resume text that would be extracted from the uploaded document. In a real implementation, this would contain the actual text from the resume file.");
      }, 500);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
      
      // Simulate reading resume content
      setTimeout(() => {
        setResumeText("This is simulated resume text that would be extracted from the dropped document file. In a real implementation, this would contain the actual text from the resume file.");
      }, 500);
    }
  };

  const analyzeResume = () => {
    // In a real app, you would send the file and job description to your backend
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a random score between 60-100
      const mockScore = Math.floor(Math.random() * 41) + 60;
      setScore(mockScore);
      
      // Generate keyword matches (simulate what would come from backend)
      const matches = [];
      const foundKeywords = new Set();
      mockKeywords.forEach(keyword => {
        // Randomly determine if keyword was found
        const found = Math.random() > 0.3;
        if (found) {
          foundKeywords.add(keyword);
        }
        matches.push({ keyword, found });
      });
      
      setKeywordMatches(matches);
      
      // Generate feedback based on score and keyword matches
      const mockFeedback = [];
      
      if (mockScore < 70) {
        mockFeedback.push({
          type: "critical",
          text: "Add more relevant keywords from the job description"
        });
        mockFeedback.push({
          type: "critical",
          text: "Quantify your achievements with specific metrics"
        });
        mockFeedback.push({
          type: "improvement",
          text: "Use more industry-standard terminology"
        });
      } else if (mockScore < 85) {
        mockFeedback.push({
          type: "improvement",
          text: "Good keyword matching, but consider adding more action verbs"
        });
        mockFeedback.push({
          type: "improvement",
          text: "Strengthen the skills section with more technical terms"
        });
        mockFeedback.push({
          type: "positive",
          text: "Formatting is ATS-friendly"
        });
      } else {
        mockFeedback.push({
          type: "positive",
          text: "Excellent keyword matching with the job description"
        });
        mockFeedback.push({
          type: "positive",
          text: "Strong action verbs and quantifiable achievements"
        });
        mockFeedback.push({
          type: "positive",
          text: "Well-structured format that's highly ATS-friendly"
        });
      }
      
      // Add feedback based on missing keywords
      const missingKeywords = mockKeywords.filter(k => !foundKeywords.has(k));
      if (missingKeywords.length > 0) {
        mockFeedback.push({
          type: "critical",
          text: `Consider adding these keywords: ${missingKeywords.join(', ')}`
        });
      }
      
      setFeedback(mockFeedback);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeResume();
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Resume ATS Score Analyzer</h1>
          {score !== null && (
            <div className="hidden md:flex items-center bg-white bg-opacity-20 rounded-full px-4 py-1">
              <span className="text-white mr-2">Your Score:</span>
              <span className="text-white font-bold text-xl">{score}</span>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto p-6 max-w-5xl flex-grow">
        {score === null ? (
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-800 mb-6">Upload Your Resume & Job Description</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  
                  {fileName ? (
                    <div>
                      <p className="text-blue-600 font-medium text-lg">{fileName}</p>
                      <p className="text-gray-500 mt-1">Click or drag to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-blue-600 font-medium text-lg">Drag & Drop your resume here</p>
                      <p className="text-gray-500 mt-1">or click to browse your files</p>
                      <p className="text-xs text-gray-400 mt-3">Supported formats: PDF, DOCX</p>
                    </div>
                  )}
                </div>
              </div>
              
              {resumeText && (
                <div className="bg-gray-50 border border-blue-100 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <h3 className="text-sm font-medium text-blue-700 mb-2">Resume Preview:</h3>
                  <p className="text-sm text-gray-600">{resumeText}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-blue-700 font-medium">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to compare with your resume..."
                  className="w-full h-40 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <button
                type="submit"
                disabled={!file || !jobDescription || isAnalyzing}
                className={`w-full p-3 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-[1.01] ${
                  !file || !jobDescription || isAnalyzing
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resume...
                  </div>
                ) : "Analyze Resume"}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white border border-blue-200 rounded-xl shadow-md overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Your ATS Score</h2>
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-white">{score}</span>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="white"
                          strokeWidth="10"
                          strokeDasharray={`${(score / 100) * 283} 283`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium bg-white ${
                      score >= 85 ? "text-green-600" : 
                      score >= 70 ? "text-blue-600" : 
                      "text-yellow-600"
                    }`}>
                      {score >= 85 ? "Excellent Match" : score >= 70 ? "Good Match" : "Needs Improvement"}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <button 
                    onClick={() => analyzeResume()}
                    className="w-full p-2 rounded-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors duration-300"
                  >
                    Re-Analyze
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white border border-blue-200 rounded-xl shadow-md overflow-hidden">
                <div className="flex border-b border-blue-100">
                  <button 
                    className={`flex-1 p-4 text-center font-medium ${activeTab === 'score' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('score')}
                  >
                    Analysis
                  </button>
                  <button 
                    className={`flex-1 p-4 text-center font-medium ${activeTab === 'keywords' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('keywords')}
                  >
                    Keywords
                  </button>
                </div>
                
                <div className="p-6">
                  {activeTab === 'score' ? (
                    <div>
                      <h3 className="text-lg font-medium text-blue-800 mb-4">Recommendations</h3>
                      <ul className="space-y-4">
                        {feedback.map((item, index) => (
                          <li key={index} className="flex items-start p-3 rounded-lg bg-blue-50">
                            <div className="flex-shrink-0 w-6 h-6 mt-1 mr-3">
                              {item.type === 'positive' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#059669">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              {item.type === 'improvement' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#2563EB">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                              )}
                              {item.type === 'critical' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#DC2626">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <span className={`text-gray-700 ${item.type === 'critical' ? 'font-medium' : ''}`}>{item.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-blue-800 mb-4">Keyword Analysis</h3>
                      <p className="text-gray-600 mb-4">Based on the job description, we've identified these important keywords:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {keywordMatches.map((item, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center p-3 rounded-lg ${item.found ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}
                          >
                            <div className="mr-3">
                              {item.found ? (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                </svg>
                              )}
                            </div>
                            <div>
                              <span className={`${item.found ? 'text-green-700' : 'text-red-700'} font-medium`}>{item.keyword}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                          </svg>
                          <h4 className="font-medium text-blue-700">Pro Tip</h4>
                        </div>
                        <p className="text-blue-600 text-sm">
                          Adding missing keywords naturally throughout your resume can significantly improve your ATS score. Focus on the skills and qualifications that genuinely match your experience.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-auto bg-gradient-to-r from-blue-50 to-blue-100 py-6 border-t border-blue-200">
        <div className="container mx-auto text-center text-blue-600">
          <p className="font-medium">ATS Score Analyzer</p>
          <p className="text-sm mt-1">Optimize your resume to get past Applicant Tracking Systems</p>
        </div>
      </footer>
    </div>
  );
};

export default ATSScoreAnalyzer;
