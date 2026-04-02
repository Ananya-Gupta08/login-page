import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
export default function ManagerDashboard() {
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
        const res = await API.get("/manager/dashboard");
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
      const res = await API.get("/tickets/manager");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchTickets();
  },[]);
  const takeAction = async (id, action) => {
    try {
      await API.put(`/tickets/action/${id}`, { action });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };
  const statusColor = (status) => {
    if (status === "Closed") return "green";
    if (status === "Rejected") return "red";
    if (status === "In Progress") return "orange";
    return "blue";
  };



  return (
    <div>
      <h2>Manager Dashboard</h2>
      <p>{data.message}</p>
      {tickets.map((ticket) => (
        <div key={ticket._id}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p>Status:{" "}
            <span style={{ color: statusColor(ticket.status) }}>
              {ticket.status}
            </span>
          </p>
          <p>Current level:  {ticket.currentRole}</p>
          <button onClick={() => takeAction(ticket._id, "CLose")}>Close</button>
          <button onClick={() => takeAction(ticket._id, "Reject")}>Reject</button>
          <button onClick={() => takeAction(ticket._id, "Escalate")}>Escalate to Admin </button>

        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}