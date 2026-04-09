import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / usersPerPage));
  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/create-user", newUser);
      setNewUser({ name: "", email: "", password: "", role: "customer" });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Failed to create user.");
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      await API.patch(`/admin/update-role/${id}`, { role: newRole });
      fetchUsers();
      setEditingUserId(null);
      setSelectedRole("customer");
    } catch (err) {
      console.error(err);
      setError("Failed to update user role.");
    }
  };

  const startEditingRole = (user) => {
    setEditingUserId(user._id);
    setSelectedRole(user.role);
  };

  const cancelEditingRole = () => {
    setEditingUserId(null);
    setSelectedRole("customer");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await API.delete(`/admin/delete-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
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

        <button
          className="btn-create"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create New User"}
        </button>

        {showCreateForm && (
          <form onSubmit={createUser} className="create-user-form">
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Role:</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit">Create User</button>
          </form>
        )}

      {loading && <p>Loading users...</p>}
      {error && <p className="auth-message" style={{ color: "#e53e3e" }}>{error}</p>}

      {!loading && !error && (
        <>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <>
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
                  {currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td className={
                        user.accountStatus === "Active" ? "status-active" : "status-inactive"
                      }>
                        {user.accountStatus}
                      </td>
                      <td>
                        {editingUserId === user._id ? (
                          <div className="role-update-controls">
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="role-select"
                            >
                              <option value="customer">Customer</option>
                              <option value="staff">Staff</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              className="btn-save"
                              onClick={() => updateUserRole(user._id, selectedRole)}
                            >
                              Save
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={cancelEditingRole}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn-update"
                              onClick={() => startEditingRole(user)}
                            >
                              Update
                            </button>
                            {user.accountStatus === "Active" && (
                              <button
                                className="btn-deactivate"
                                onClick={() => deactivateUser(user._id)}
                              >
                                Deactivate
                              </button>
                            )}
                            <button
                              className="btn-delete"
                              onClick={() => deleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination-controls" style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
                  <button
                    className="btn-pagination"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    className="btn-pagination"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
    </div>
  );
}