import { useState } from "react";
import "../index.css";
export default function ResetPassword({ email, onNext  }) {
  const [newPassword, setNewPassword] = useState("");

  const reset = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    alert(data.message);

    if(res.ok){
      onNext();
    }
  };

  return (
    
    <div className="auth-card">
      <h3>Reset Password</h3>
      <p className="auth-subtext">
        Choose a strong new password
      </p>
      <input
        type="password"
        placeholder="New Password" 
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={reset}>Update Password</button>
    </div>
   
  );
}
