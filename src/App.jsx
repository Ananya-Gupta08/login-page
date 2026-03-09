import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ForgotFlow from "./pages/ForgotFlow";

import GoogleSuccess from "./pages/GoogleSuccess";
import ProtectedRoute from "./components/ProtectedRoute";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";

function App() {
  console.log(import.meta.env.VITE_API_URL);
  return (
    <BrowserRouter>
      <Routes>
        {/* default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotFlow />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* protected route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
