import { useEffect, useState } from "react";
import API from "../services/api";
import Profile from "../Profile";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/authContext";

export default function ManagerDashboard() {
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
        const res = await API.get("/manager/dashboard");
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
      <h2>Manager Dashboard</h2>
      <p>{data.message}</p>
      <button onClick={handleLogout}>Logout</button>
      <Profile />
    </div>
  );
}