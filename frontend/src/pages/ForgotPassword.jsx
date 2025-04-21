import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { AtSign, Lock, Shield, UserCircle, Loader } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification, 3: New password
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    role: "",
    branch: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("igGYMqVdtOpUhz0TQ");
  }, []);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyUser = async () => {
    setIsLoading(true);

    try {
      let response;
      let requestData = {
        email: formData.email,
        username: formData.username,
      };

      if (formData.role === "admin") {
        // Verify admin
        response = await axios.post("/api/admin/verify", requestData);
      } else if (formData.role === "student") {
        // Verify student based on branch
        response = await axios.post(
          `/api/student/${formData.branch}/verify`,
          requestData
        );
      } else {
        setError("Please select a role");
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return response.data.success;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("User not found. Please check your details.");
      }
      setIsLoading(false);
      return false;
    }
  };

  const updatePassword = async () => {
    setIsLoading(true);
    try {
      let response;

      if (formData.role === "admin") {
        // Update admin password
        response = await axios.post("/api/admin/update-password", {
          email: formData.email,
          username: formData.username,
          newPassword: formData.newPassword,
        });
      } else if (formData.role === "student") {
        // Update student password based on branch
        response = await axios.post(
          `/api/student/${formData.branch}/update-password`,
          {
            email: formData.email,
            username: formData.username,
            newPassword: formData.newPassword,
          }
        );
      }

      setIsLoading(false);
      return response.data.success;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update password. Please try again.");
      }
      setIsLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (step === 1) {
      // Validation
      if (!formData.role) {
        setError("Please select a role");
        return;
      }

      if (formData.role === "student" && !formData.branch) {
        setError("Please select a branch");
        return;
      }

      // Verify user exists in database
      const isUserValid = await verifyUser();

      if (!isUserValid) {
        return; // Error message already set in verifyUser function
      }

      const otp = generateOTP();
      setGeneratedOTP(otp);

      setIsLoading(true);
      const templateParams = {
        email: formData.email,
        passcode: otp,
        time: new Date().toLocaleTimeString(),
      };

      try {
        await emailjs.send(
          "service_f2im05s",
          "template_op2rcit",
          templateParams
        );
        setSuccess("OTP has been sent to your email");
        setIsLoading(false);
        setStep(2);
      } catch (err) {
        setError("Failed to send OTP. Please try again.");
        setIsLoading(false);
      }
    } else if (step === 2) {
      if (formData.otp === generatedOTP) {
        setStep(3);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } else if (step === 3) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.newPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      const success = await updatePassword();
      if (success) {
        setSuccess("Password updated successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transition-all duration-300 transform hover:shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1
              ? "Enter your details to receive OTP"
              : step === 2
              ? "Enter the OTP sent to your email"
              : "Set your new password"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center">
            <div className="mr-2 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100 flex items-center">
            <div className="mr-2 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 pl-1">
                  This is your registration/roll number or admin username
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 p-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === "student"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Student</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Admin</span>
                  </label>
                </div>
              </div>

              {formData.role === "student" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">
                        Computer Science and Engineering
                      </option>
                      <option value="EC">Electronics and Communication</option>
                      <option value="EEE">
                        Electrical and Electronics Engineering
                      </option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                      <option value="IT">Information Technology</option>
                      <option value="SFE">Safety & Fire Engineering</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="otp"
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 pl-1">
                Check your email for the OTP sent to {formData.email}
              </p>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 text-white font-medium rounded-lg 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-colors duration-200 shadow-lg flex items-center justify-center
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : step === 1 ? (
                "Send OTP"
              ) : step === 2 ? (
                "Verify OTP"
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-3 py-2.5 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium flex items-center justify-center"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
