import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
export default function StaffDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
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

 
  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/staff");
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
      await API.put(`/tickets/action/${id}`, { action });
      setMessage("Ticket updated successfully.");
      fetchTickets();
    } catch (err) {
      console.error(err);
      setMessage("Ticket action failed. Please try again.");
    }
  };
 if (!data) return <p>Loading...</p>;
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", marginBottom: "10px" }}>Staff Dashboard</h2>
      {message && <p style={{ color: "#2d6a4f", marginBottom: "20px" }}>{message}</p>}
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
            <p style={{ margin: "8px 0", fontSize: "14px" }}>
              <strong>Status:</strong> <span style={{ color: "#2196F3", fontWeight: "bold" }}>{ticket.status}</span>
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button onClick={() => takeAction(ticket._id, "Open")} style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Open</button>
              <button onClick={() => takeAction(ticket._id, "Close")} style={{
                padding: "8px 16px",
                backgroundColor: "#FFC107",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Close</button>
              <button onClick={() => takeAction(ticket._id, "Escalate")} style={{
                padding: "8px 16px",
                backgroundColor: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Escalate</button>
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