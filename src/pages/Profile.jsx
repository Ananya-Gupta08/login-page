console.log("PROFILE COMPONENT LOADED");

import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    // window.location.reload();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => logout());  
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bound" style={{ padding: "20px" }}>
      <h2>Profile</h2>

      {/* User info */}
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <br />

      {/* Change password toggle */}
      <button onClick={() => setShowChangePassword(!showChangePassword)}>
        {showChangePassword ? "Close Change Password" : "Change Password"}
      </button>

      <br /><br />

      
      {showChangePassword && <ChangePassword />}

      <br /><br />

      {/* Logout */}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
