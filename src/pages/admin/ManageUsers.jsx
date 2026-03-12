import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  const deactivateUser = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) {
      return;
    }
    try {
      console.log("Deactivating user with ID:", id);
      await API.patch(`/admin/deactivate/${id}`);
      fetchUsers();
      console.log("User deactivated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update user status.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="content">
      <div className="dashboard manage-users">
        <h2>Manage Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="auth-message" style={{ color: "#e53e3e" }}>{error}</p>}

      {!loading && !error && (
        <>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td className={
                      user.accountStatus === "Active" ? "status-active" : "status-inactive"
                    }>
                      {user.accountStatus}
                    </td>
                    <td>
                      {user.accountStatus === "Active" && (
                        <button
                          className="btn-deactivate"
                          onClick={() => deactivateUser(user._id)}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
    </div>
  );
}