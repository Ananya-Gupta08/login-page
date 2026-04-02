import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
export default function StaffDashboard() {
  const [data, setData] = useState(null);
  const {logout}=useAuth();
  const navigate = useNavigate();
  const[tickets,setTickets]=useState([]);
  
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
  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    fetchTickets();
  }, []);

  const takeAction = async (id, action) => {
    try {
      await API.put(`/tickets/${id}/action`, { action });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Staff Dashboard</h2>
      <p>{data.message}</p>
      {tickets.map((ticket) => (
        <div key={ticket._id}>
          <p>{ticket.title}</p>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
          <button onClick={() => takeAction(ticket._id, "Open")}>Open</button>
          <button onClick={() => takeAction(ticket._id, "Close")}>Close</button>
          <button onClick={() => takeAction(ticket._id, "Escalate")}>Escalate</button>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}