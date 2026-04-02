import { useEffect, useState } from "react";
import API from "../services/api";
import Profile from "../Profile";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import { set } from "mongoose";

export default function CustomerDashoard() {
  const [data, setData] = useState(null);
  const {logout}=useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState([]);

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

  if (!data) return <p>Loading...</p>;
  return (
    <div>
      <h2>Customer Dashboard</h2>
      <p>{data.message}</p>
      <h3>Create Ticket</h3>
      <input
        type="text"
        placeholder="Title" 
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description" 
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={createTicket}>Create Ticket</button>
      <h3>My Tickets</h3>
      
      {tickets.map(ticket => (
        <div key={ticket._id}>
          <h4>{ticket.title}</h4>
          <p>{ticket.description}</p>
          <span>Status:{ticket.status}</span>
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
      <Profile />
    </div>
  );
}