import { Link } from "react-router-dom";
import { useAuth } from "./context/authContext";

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <div style={{
      width: "220px",
      background: "#1e1e2f",
      color: "white",
      padding: "20px",
      minHeight: "100vh"
    }}>
      <h3>Admin Panel</h3>

      <div style={{ marginTop: "20px" }}>
        <Link to="/admin" style={{ display: "block", color: "white", marginBottom: "10px" }}>
          Dashboard
        </Link>

        <Link to="/admin/users" style={{ display: "block", color: "white", marginBottom: "10px" }}>
          Manage Users
        </Link>

        <button
          onClick={logout}
          style={{ marginTop: "20px", background: "red", color: "white" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}