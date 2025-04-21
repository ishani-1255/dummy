import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const ManageInterviews = () => {
  // Static hardcoded interview data
  const [interviews] = useState([
    {
      id: "int-001",
      company: "TechCorp Inc.",
      date: "2023-12-15",
      time: "10:00 AM",
      location: "Online (Zoom)",
      status: "Scheduled",
    },
    {
      id: "int-002",
      company: "WebSolutions Ltd.",
      date: "2023-12-18",
      time: "2:30 PM",
      location: "Main Campus, Room 302",
      status: "Open",
    },
    {
      id: "int-003",
      company: "DataMinds Analytics",
      date: "2023-12-20",
      time: "11:00 AM",
      location: "Online (Teams)",
      status: "Scheduled",
    },
    {
      id: "int-004",
      company: "NetConnect Systems",
      date: "2024-01-05",
      time: "9:00 AM",
      location: "Corporate Office, Building B",
      status: "Upcoming",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed h-full z-30 shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content - with increased left margin to prevent overlap */}
      <div className="flex-1 ml-72 p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Interviews
            </h1>
            <p className="text-gray-600">View and manage campus interviews</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <span className="mr-2">+</span>
            Add New Interview
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Company
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Time
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {interview.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {interview.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {interview.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {interview.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full
                      ${
                        interview.status === "Scheduled"
                          ? "bg-green-100 text-green-800"
                          : interview.status === "Open"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        View
                      </a>
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        Edit
                      </a>
                      <a href="#" className="text-red-600 hover:text-red-800">
                        Delete
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end items-center">
              <div className="space-x-1">
                <button className="px-4 py-1 border border-gray-300 rounded bg-white text-gray-600">
                  Previous
                </button>
                <button className="px-4 py-1 border border-gray-300 rounded bg-white text-gray-600">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInterviews;
