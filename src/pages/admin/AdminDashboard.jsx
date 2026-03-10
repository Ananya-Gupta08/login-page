import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {useAuth} from "../context/AuthContext";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  return (
    <div className="content">
      <div className="dashboard admin-dashboard">
        <h2>Admin Dashboard</h2>
      {error && <p className="auth-message" style={{ color: "#e53e3e" }}>{error}</p>}
      {!error && data && (
        <div className="stats">
          <div className="stat">
            <span>Total Users </span> 
            <strong>{data.totalUsers}</strong>
          </div>
          <div className="stat">
            <span>Total Staff </span>
            <strong>{data.totalStaff}</strong>
          </div>
          <div className="stat">
            <span>Total Managers </span>
            <strong>{data.totalManagers}</strong>
          </div>
          <div className="stat">
            <span>Total Customers </span>
            <strong>{data.totalCustomers}</strong>
          </div>
        </div>
      )}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </div>
  );
}