"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const InputField = ({
  label,
  type = "text",
  placeholder,
  required = true,
  className = "",
  name,
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name} // Fix: Ensure the input field has a name
      placeholder={placeholder}
      required={required}
      className="px-3 py-2 rounded-md border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-700 text-sm"
    />
  </div>
);


const SignUpForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    try {
      const formData = new FormData(e.target); // Collect form data
      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        roll: formData.get("roll"),
        branch: formData.get("branch"),
        username: formData.get("username"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };
  
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
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
        alert(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again later.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <GraduationCap className="mx-auto mb-4 text-blue-600" size={48} />
          <h1 className="text-2xl font-semibold text-gray-900">
            Student Registration
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in the information below
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Grid layout for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-sm font-medium text-gray-700">
                  Personal Information
                </h2>
              </div>
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
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-sm font-medium text-gray-700">
                  Academic Information
                </h2>
              </div>
              <InputField
                label="College Roll Number / Student ID"
                name="roll"
                placeholder="e.g., 2021CS1001"
              />
              <InputField
                label="Branch / Department"
                name="branch"
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          {/* Password Section - Full Width */}
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h2 className="text-sm font-medium text-gray-700">Security</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="username"
                type="text"
                name="username"
                placeholder="johndoe"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
              />
              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full md:w-auto md:self-end px-8 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Account
            </button>
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
      </div>
    </div>
  );
};

export default SignUpForm;