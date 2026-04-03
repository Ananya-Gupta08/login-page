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
  const[tickets,setTickets]=useState([]);

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
  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/admin");
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

      <div className="tickets-section" style={{ marginTop: "30px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>Tickets</h3>
        
        {tickets.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>No tickets available</p>
        ) : (
          tickets.map((ticket) => (
            <div className="ticket" key={ticket._id} style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              padding: "15px", 
              marginBottom: "15px",
              backgroundColor: "#f9f9f9"
            }}>
              <div className="ticket-header" style={{ marginBottom: "12px" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>{ticket.title}</h4>
              </div>

              <p style={{ color: "#555", marginBottom: "10px" }}>{ticket.description}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Status:</strong> <span style={{ color: statusColor(ticket.status), fontWeight: "bold" }}>
                      {ticket.status}
                    </span>
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Current Level:</strong> {ticket.currentRole}
                  </p>
                </div>
              </div>
              
              <div className="ticket-actions" style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => takeAction(ticket._id, "Close")} style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}>
                  Close
                </button>
                <button onClick={() => takeAction(ticket._id, "Reject")} style={{
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </div>
  );
}