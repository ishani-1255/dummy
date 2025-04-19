import "./index.css";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./pages/UserContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import StudentSignUpForm from "./pages/signup-student";
import AdminSignUpForm from "./pages/signup-admin";
import SignInForm from "./pages/login";

import Admin from "./pages/admin";
import ManageCompanies from "./components/admin/ManageCompanies";
import SearchStudent from "./components/admin/SearchStudent";
import Batches from "./components/admin/Batches";
import ManageInterviews from "./components/admin/ManageInterviews";
import PlacementRecords from "./components/admin/PlacementRecords";
import GeneralQueries from "./components/admin/GeneralQueries";
import CoordinatorManagement from "./components/admin/CoordinatorManagement";
import DepartmentApplications from "./components/admin/DepartmentApplications";
import CompanyApplicationsPage from "./components/admin/CompanyApplicationsPage";
import ApplicationsView from "./components/admin/ApplicationsView";

import Profile from "./components/student/Profile";
import Resume from "./components/student/resume";
import AskQueries from "./components/student/askqueries";
import MyApplication from "./components/student/myapplication";
import Resources from "./components/student/learningresources";
import JobListing from "./components/student/joblisting";
import Interview from "./components/student/interview";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SignInForm />} />
          <Route path="/Student-SignUp" element={<StudentSignUpForm />} />
          <Route path="/Admin-SignUp" element={<AdminSignUpForm />} />

          {/* Admin routes */}
          <Route
            path="/Admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-companies"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageCompanies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-student"
            element={
              <ProtectedRoute requiredRole="admin">
                <SearchStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batches"
            element={
              <ProtectedRoute requiredRole="admin">
                <Batches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-interviews"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageInterviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placement-records"
            element={
              <ProtectedRoute requiredRole="admin">
                <PlacementRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <CoordinatorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queries"
            element={
              <ProtectedRoute requiredRole="admin">
                <GeneralQueries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/department-applications"
            element={
              <ProtectedRoute requiredRole="admin">
                <DepartmentApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/:companyId"
            element={
              <ProtectedRoute requiredRole="admin">
                <CompanyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/view/:companyId"
            element={
              <ProtectedRoute requiredRole="admin">
                <ApplicationsView />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="student">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-companies"
            element={
              <ProtectedRoute requiredRole="student">
                <JobListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute requiredRole="student">
                <MyApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-score"
            element={
              <ProtectedRoute requiredRole="student">
                <Resume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute requiredRole="student">
                <Interview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute requiredRole="student">
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask-queries"
            element={
              <ProtectedRoute requiredRole="student">
                <AskQueries />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
