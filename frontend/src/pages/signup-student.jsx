import React from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InputField = ({
  label,
  type = "text",
  placeholder,
  required = true,
  className = "",
  name,
  children, // For select options
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "select" ? (
      <select
        name={name}
        required={required}
        className="px-3 py-2 rounded-md border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-700 text-sm"
      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 rounded-md border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-700 text-sm"
      />
    )}
  </div>
);

const SignUpForm = () => {
  const navigate = useNavigate();

  // Function to generate year options dynamically
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const formData = new FormData(e.target); // Collect form data
      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        registrationNumber: formData.get("registrationNumber"),
        branch: formData.get("branch"),
        semester: formData.get("semester"),
        yearOfAdmission: formData.get("yearOfAdmission"),
        lastSemGPA: formData.get("lastSemGPA"),
        cgpa: formData.get("cgpa"),
        feeDue: formData.get("feeDue"),
        fatherName: formData.get("fatherName"),
        backlog: formData.get("backlog"),
      };

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:6400/signup-student",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        alert("Account created successfully!");
        navigate("/");
      } else {
        alert(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with College Logo */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-4 pt-10 sm:px-6 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {/* College Logo */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/6/6f/Cochin_University_of_Science_and_Technology_Logo.png" 
              alt="College Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Cochin University of Science and Technology</h1>
            </div>
          </div>
           {/*
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
           */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Registration Header */}
          <div className=" p-6 text-center border-b">
            <GraduationCap className="mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Student Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please fill in the information below
            </p>
          </div>

          <form className="p-6 space-y-8" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="space-y-5">
              <div className="border-b pb-2">
                <h2 className="text-base font-medium text-gray-800">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                />
                <InputField
                  label="Email ID"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                />
                <InputField
                  label="Phone Number"
                  type="number"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                />
                <InputField
                  label="Father's Name"
                  name="fatherName"
                  placeholder="John Doe Sr."
                />
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-5 pt-4">
              <div className="border-b pb-2">
                <h2 className="text-base font-medium text-gray-800">
                  Academic Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <InputField
                  label="Registration Number"
                  name="registrationNumber"
                  placeholder="e.g., 20211001"
                />
                <InputField
                  label="Branch / Department"
                  type="select"
                  name="branch"
                >
                  <option value="CSE">
                    Computer Science and Engineering (CSE)
                  </option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="SFE">Safety and Fire (SFE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="EEE">
                    Electrical and Electronics Engineering (EEE)
                  </option>
                  <option value="EC">Electronics and Communication (EC)</option>
                </InputField>
                <InputField label="Semester" type="select" name="semester">
                  {[...Array(8).keys()].map((sem) => (
                    <option key={sem + 1} value={sem + 1}>
                      Semester {sem + 1}
                    </option>
                  ))}
                </InputField>
                <InputField
                  label="Year of Admission"
                  type="select"
                  name="yearOfAdmission"
                >
                  {generateYearOptions()}
                </InputField>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <InputField
                  label="Last Semester GPA"
                  type="text"
                  name="lastSemGPA"
                  placeholder="e.g., 8.5"
                  pattern="^\d*(\.\d+)?$"
                />
                <InputField
                  label="CGPA"
                  type="text"
                  name="cgpa"
                  placeholder="e.g., 8.5"
                  pattern="^\d*(\.\d+)?$"
                />
                <InputField
                  label="Number of Backlogs"
                  type="number"
                  name="backlog"
                  placeholder="e.g., 0"
                  min="0"
                />
                <InputField label="Fee Due" type="select" name="feeDue">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </InputField>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col space-y-4 pt-4 border-t">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create Account
                </button>
              </div>
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
            <p>© 2025 Cochin University of Science and Technology. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;