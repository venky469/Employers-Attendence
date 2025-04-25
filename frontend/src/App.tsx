"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { CircularProgress, Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Layouts
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import TeamLeads from "./pages/admin/TeamLeads"
import AdminFarmers from "./pages/admin/Farmers"
import AdminProjects from "./pages/admin/Projects"
import AdminReports from "./pages/admin/Reports"

// Team Lead Pages
import TeamLeadDashboard from "./pages/teamLead/Dashboard"
import Labours from "./pages/teamLead/Labours"
import Attendance from "./pages/teamLead/Attendance"
import TeamLeadFarmers from "./pages/teamLead/Farmers"
import TeamLeadProjects from "./pages/teamLead/Projects"
import TeamLeadReports from "./pages/teamLead/Reports"

// Common Pages
import Profile from "./pages/common/Profile"
import Settings from "./pages/common/Settings"
import NotFound from "./pages/common/NotFound"
import PendingApproval from "./pages/common/PendingApproval"

// Protected Route Component
const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check if team lead is approved
  if (user && user.role === "teamLead" && !user.isApproved) {
    return <Navigate to="/pending-approval" replace />
  }

  return children
}

function App() {
  const { checkAuth } = useAuth()
  const { i18n } = useTranslation()

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.dir = i18n.dir()
  }, [i18n, i18n.language])

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="team-leads" element={<TeamLeads />} />
          <Route path="farmers" element={<AdminFarmers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Team Lead Routes */}
        <Route
          path="/team-lead"
          element={
            <ProtectedRoute roles={["teamLead"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeamLeadDashboard />} />
          <Route path="labours" element={<Labours />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="farmers" element={<TeamLeadFarmers />} />
          <Route path="projects" element={<TeamLeadProjects />} />
          <Route path="reports" element={<TeamLeadReports />} />
        </Route>

        {/* Common Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Settings />} />
        </Route>

        <Route path="/unauthorized" element={<NotFound />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Redirect root to appropriate dashboard based on role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/login" replace />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
