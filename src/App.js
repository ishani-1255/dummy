import './index.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentSignUpForm from './pages/signup-student';
import AdminSignUpForm from './pages/signup-admin';
import SignInForm from './pages/login';

import Admin from './pages/admin';
import ManageCompanies from "./components/admin/ManageCompanies";
import SearchStudent from "./components/admin/SearchStudent";
import Batches from "./components/admin/Batches";
import ManageInterviews from "./components/admin/ManageInterviews";
import PlacementRecords from "./components/admin/PlacementRecords";
import GeneralQueries from "./components/admin/GeneralQueries"
import CoordinatorManagement from "./components/admin/CoordinatorManagement";


import Profile from "./components/student/Profile";
import Resume from './components/student/resume';
import AskQueries from './components/student/askqueries';
import MyApplication from './components/student/myapplication';
import Resources from './components/student/learningresources';
import JobListing from './components/student/joblisting';
import Interview from './components/student/interview';


function App() {
  return (
    <BrowserRouter>

    <Routes>
      <Route path ='/' element = {  <SignInForm/>} />
      <Route path ='/Student-SignUp' element = {  <StudentSignUpForm/>} />
      <Route path ='/Admin-SignUp' element = {<AdminSignUpForm/>} />

      <Route path ='/Admin' element = {<Admin/>} />
      <Route path="/manage-companies" element={<ManageCompanies />} />
      <Route path="/search-student" element={<SearchStudent />} />
      <Route path="/batches" element={<Batches />} />
      <Route path="/manage-interviews" element={<ManageInterviews />} />
      <Route path="/placement-records" element={<PlacementRecords />} />
      <Route path="/coordinator-management" element={<CoordinatorManagement />} />
      <Route path="/queries" element={<GeneralQueries />} />
      
      <Route path="/profile" element={<Profile/>} />
      <Route path="/all-companies" element={<JobListing/>} />
      <Route path="/applications" element={<MyApplication/>} />
      <Route path="/resume-score" element={<Resume/>} />
      <Route path="/interviews" element={<Interview/>} />
      <Route path="/resources" element={<Resources/>} />
      <Route path="/ask-queries" element={<AskQueries/>} />
     
    </Routes>

    </BrowserRouter>
  
  );
}

export default App;
