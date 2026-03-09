import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  const deactivateUser = async (id) => {
    await API.patch(`/admin/deactivate/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Manage Users</h2>

      {users.map((user) => (
        <div key={user._id} style={{ marginBottom: "10px" }}>
          {user.name} - {user.role} - {user.accountStatus}

          {user.accountStatus === "Active" && (
            <button
              onClick={() => deactivateUser(user._id)}
              style={{ marginLeft: "10px" }}
            >
              Deactivate
            </button>
          )}
        </div>
      ))}
    </div>
  );
}