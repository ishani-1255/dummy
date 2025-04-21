import React from "react";
import InterviewManagement from "./InterviewManagement";

/**
 * This component serves as a wrapper for InterviewManagement
 * to maintain backward compatibility if both filenames are used in the system
 */
const ManageInterviews = () => {
  return <InterviewManagement />;
};

export default ManageInterviews;
