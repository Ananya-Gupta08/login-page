import { useState } from "react";
import "../index.css";

export default function VerifyOtp({ email, onVerified }) {
  const [otp, setOtp] = useState("");

  const verify = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) onVerified(otp);
    else alert(data.message);
  };

  return (
   
    <div className="auth-card">
      <h3>Verify OTP</h3>
       <p className="auth-subtext">
        Enter the 6-digit OTP sent to {email}
      </p>
      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <button onClick={verify}>Verify</button>
    </div>
 
  );
}
