"use client";

import React, { useState } from 'react';
import { Shield, AtSign, Phone, User, Building, Key, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  icon: Icon, 
  required = true,
  className = "",
  name,
  value,
  onChange,
  children
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      {type === "select" ? (
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <select
            name={name}
            required={required}
            className={`w-full rounded-md border border-gray-300 shadow-sm py-2 
              ${Icon ? 'pl-10 pr-3' : 'px-3'}
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
              text-gray-900 text-sm`}
            value={value}
            onChange={onChange}
          >
            {children}
          </select>
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-md border border-gray-300 shadow-sm py-2 
            ${Icon ? 'pl-10 pr-3' : 'px-3'}
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
            text-gray-900 text-sm placeholder-gray-400`}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  </div>
);

const AdminSignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    designation: '',
    department: '',
    accessCode: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      const response = await fetch('http://localhost:6400/signup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json(); // Parse the response JSON

      if (response.ok) {
        // If the backend sends a success response
        navigate('/admin'); // Redirect to admin page
      } else {
        // If the backend sends an error response with a message
        setError(responseData.message || 'An error occurred during registration.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Registration Header */}
          <div className="p-6 text-center border-b">
            <Shield className="mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Admin Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your administrative account
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <InputField 
                  label="Full Name"
                  placeholder="Dr. Jane Smith"
                  name="name"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                />
                <InputField 
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  name="phone"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <InputField 
                  label="Official Email ID"
                  type="email"
                  placeholder="jane.smith@institution.edu"
                  name="email"
                  icon={AtSign}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-5 pt-4">
              <div className="border-b pb-2">
                <h2 className="text-base font-medium text-gray-800">
                  Professional Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <InputField 
                  label="Designation"
                  type="select"
                  name="designation"
                  icon={Building}
                  value={formData.designation}
                  onChange={handleChange}
                  required={true}
                >
                  <option value="">Select designation</option>
                  <option value="Placement Officer">Placement Officer</option>
                  <option value="HOD">HOD</option>
                  <option value="Other">Other</option>
                </InputField>
                <InputField 
                  label="Department"
                  type="select"
                  name="department"
                  icon={Building}
                  value={formData.department}
                  onChange={handleChange}
                  required={true}
                >
                  <option value="">Select department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="SFE">SFE</option>
                  <option value="CE">CE</option>
                  <option value="ME">ME</option>
                  <option value="EEE">EEE</option>
                  <option value="EC">EC</option>
                </InputField>
                <InputField 
                  label="Admin Access Code"
                  type="text"
                  name="accessCode"
                  placeholder="Enter access code if provided"
                  icon={Key}
                  required={false}
                  value={formData.accessCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-5 pt-4">
              <div className="border-b pb-2">
                <h2 className="text-base font-medium text-gray-800">
                  Security
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  icon={User}
                  value={formData.username}
                  onChange={handleChange}
                />
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col space-y-4 pt-4 border-t">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-md 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  transition-colors"
                >
                  Create Admin Account
                </button>
              </div>
              <div className="text-center text-sm text-gray-600">
                Already have an admin account?{' '}
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
            <p>This is a secure administrator registration portal. All actions are logged for security purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUpForm;