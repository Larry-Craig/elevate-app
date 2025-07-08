import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SeekerSetup from "./pages/SeekerSetup";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import JobDetail from "./pages/JobDetail";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import Notifications from "./pages/Notifications";
import Messaging from "./pages/Messaging";
import EmployerDashboard from "./pages/EmployerDashboard";

import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<OTP />} />
          <Route path="/setup/seeker" element={<SeekerSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/messaging" element={<Messaging />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
