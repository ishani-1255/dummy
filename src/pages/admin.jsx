"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";



const Admin = () => {
  return (
   
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1">
        </div>
      </div>
 
  );
};

export default Admin;
