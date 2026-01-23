import { useState } from "react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="bound">
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="Old password"
        onChange={e => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New password"
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={submit}>Update</button>
    </div>
  );
}
