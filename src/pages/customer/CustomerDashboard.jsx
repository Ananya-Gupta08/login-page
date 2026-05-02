import { useEffect, useState } from "react";
import API from "../services/api";
import Profile from "../Profile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CustomerDashoard() {
  const [data, setData] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/customer/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);


  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async () => {
    try {
      await API.post("/tickets/create", { title, description });
      setTitle("");
      setDescription("");
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize));
  const pagedTickets = tickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (!data) return <p>Loading...</p>;
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", marginBottom: "10px" }}>Customer Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>{data.message}</p>
      
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h3 style={{ color: "#333", marginTop: "0", marginBottom: "15px" }}>Create Ticket</h3>
        <input
          type="text"
          placeholder="Title" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontSize: "14px"
          }}
        />
        <textarea
          placeholder="Description" 
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontSize: "14px",
            minHeight: "80px",
            fontFamily: "Arial, sans-serif"
          }}
        />
        <button onClick={createTicket} style={{
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}>Create Ticket</button>
      </div>

      <h3 style={{ color: "#333", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>My Tickets</h3>
      
      {tickets.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>No tickets yet</p>
      ) : (
        <>
          {pagedTickets.map((ticket) => (
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
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 14px",
                backgroundColor: currentPage === 1 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: "14px", color: "#333" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 14px",
                backgroundColor: currentPage === totalPages ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        </>
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
      
      <div style={{ marginTop: "30px" }}>
        <Profile />
      </div>
    </div>
  );
}