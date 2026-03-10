import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>

      <div className="sidebar-links">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Manage Users</Link>
      </div>
    </div>
  );
}