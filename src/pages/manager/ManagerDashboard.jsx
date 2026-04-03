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


  if (!data) return <p>Loading...</p>;
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", marginBottom: "10px" }}>Manager Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>{data.message}</p>
      
      <h3 style={{ color: "#333", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>Tickets</h3>
      
      {tickets.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>No tickets assigned</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket._id} style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>{ticket.title}</h4>
            <p style={{ color: "#666", margin: "8px 0" }}>{ticket.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Status:</strong> <span style={{ color: statusColor(ticket.status), fontWeight: "bold" }}>
                  {ticket.status}
                </span>
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Current Level:</strong> {ticket.currentRole}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button onClick={() => takeAction(ticket._id, "CLose")} style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Close</button>
              <button onClick={() => takeAction(ticket._id, "Reject")} style={{
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Reject</button>
              <button onClick={() => takeAction(ticket._id, "Escalate")} style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Escalate to Admin</button>
            </div>
          </div>
        ))
      )}

      <button onClick={handleLogout} style={{
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        marginTop: "20px"
      }}>Logout</button>
    </div>
  );
}