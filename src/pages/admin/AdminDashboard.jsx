import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {useAuth} from "../context/authContext";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const {logout}=useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Users: {data.totalUsers}</p>
      <p>Total Staff: {data.totalStaff}</p>
      <p>Total Managers: {data.totalManagers}</p>
      <p>Total Customers: {data.totalCustomers}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}