import { useState } from "react";

export default function ResetPassword({ email, otp }) {
  const [newPassword, setNewPassword] = useState("");

  const reset = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h3>Reset Password</h3>
      <input
        type="password"
        placeholder="New Password"
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={reset}>Update Password</button>
    </div>
  );
}
