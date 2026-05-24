import { createBrowserRouter, Navigate } from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { AppLayout } from "../layouts/AppLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AnalysisPage } from "../pages/AnalysisPage";
import { AdminLogsPage } from "../pages/admin/AdminLogsPage";
import { AdminMessagesPage } from "../pages/admin/AdminMessagesPage";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";
import { AdminReportDetailPage } from "../pages/admin/AdminReportDetailPage";
import { AdminReportsPage } from "../pages/admin/AdminReportsPage";
import { AdminResumesPage } from "../pages/admin/AdminResumesPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ReportDetailPage } from "../pages/ReportDetailPage";
import { ReportsPage } from "../pages/ReportsPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { SignupPage } from "../pages/SignupPage";
import { UploadResumePage } from "../pages/UploadResumePage";
import { AboutPage } from "../pages/public/AboutPage";
import { ContactPage } from "../pages/public/ContactPage";
import { FeaturesPage } from "../pages/public/FeaturesPage";
import { HomePage } from "../pages/public/HomePage";
import { HowItWorksPage } from "../pages/public/HowItWorksPage";
import { AdminRoute } from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/features", element: <FeaturesPage /> },
      { path: "/how-it-works", element: <HowItWorksPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/upload", element: <UploadResumePage /> },
          { path: "/analysis/:resumeId", element: <AnalysisPage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/reports/:reportId", element: <ReportDetailPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminOverviewPage /> },
          { path: "/admin/users", element: <AdminUsersPage /> },
          { path: "/admin/resumes", element: <AdminResumesPage /> },
          { path: "/admin/reports", element: <AdminReportsPage /> },
          { path: "/admin/reports/:reportId", element: <AdminReportDetailPage /> },
          { path: "/admin/logs", element: <AdminLogsPage /> },
          { path: "/admin/messages", element: <AdminMessagesPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
