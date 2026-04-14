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
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const fetchUserProfile = async (id) => {
    try {
      setError("");
      setProfileLoading(true);
      const res = await API.get(`/admin/users/${id}`);
      setSelectedUser(res.data.user);
      setUserTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load user profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserTickets([]);
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

        <div className="search-controls" style={{ margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Search employees by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ padding: "8px 12px", width: "100%", maxWidth: "360px" }}
          />
        </div>

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
          {filteredUsers.length === 0 ? (
            <p>No matching employees found.</p>
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
                              className="btn-view"
                              onClick={() => fetchUserProfile(user._id)}
                            >
                              View
                            </button>
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
      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Profile</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            {profileLoading ? (
              <p>Loading profile...</p>
            ) : (
              <>
                <div className="profile-details">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <p><strong>Status:</strong> {selectedUser.accountStatus}</p>
                  <p><strong>Provider:</strong> {selectedUser.authProvider || "local"}</p>
                </div>
                <div className="ticket-history-section">
                  <h4>Ticket History</h4>
                  {userTickets.length === 0 ? (
                    <p>No tickets found for this employee.</p>
                  ) : (
                    <table className="users-table ticket-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Assigned Role</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTickets.map((ticket) => (
                          <tr key={ticket._id}>
                            <td>{ticket.title}</td>
                            <td>{ticket.status}</td>
                            <td>{ticket.currentRole}</td>
                            <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {userTickets.length > 0 && (
                    <div className="ticket-history-details">
                      <h5>Ticket Events</h5>
                      {userTickets.map((ticket) => (
                        <div key={`history-${ticket._id}`} className="ticket-history-card">
                          <h6>{ticket.title}</h6>
                          {ticket.history?.length ? (
                            <ul>
                              {ticket.history.map((event, idx) => (
                                <li key={idx}>
                                  <strong>{event.action}</strong> ({event.role}) - {new Date(event.timestamp).toLocaleString()}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No event history available.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}