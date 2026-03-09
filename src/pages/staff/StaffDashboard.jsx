import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
export default function StaffDashboard() {
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
        const res = await API.get("/staff/dashboard");
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
      <h2>Staff Dashboard</h2>
      <p>{data.message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}