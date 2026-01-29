import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // not logged in → go to login
    return <Navigate to="/login" />;
  }

  // logged in → allow access
  return children;
}
