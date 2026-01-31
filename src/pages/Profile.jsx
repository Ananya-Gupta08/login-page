import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      logout();
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        logout();
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="auth-card" style={{ padding: "20px" }}>
      <h2>Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <br />

      <button onClick={() => setShowChangePassword(!showChangePassword)}>
        {showChangePassword ? "Close Change Password" : "Change Password"}
      </button>

      <br /><br />

      {showChangePassword && <ChangePassword />}

      <br /><br />

      <button
        style={{ marginTop: "10px", background: "#dc2626" }}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
