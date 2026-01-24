import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
export default function ForgotPassword({ onNext }) {
  const [email, setEmail] = useState("");

  const sendOtp = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    alert(data.message);
    onNext(email);
  };

  return (
   
    <div className="auth-card">
      <h3>Forgot Password</h3>
      <p className="auth-subtext">
        Enter your registered email to receive an OTP
      </p>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>
    </div>
   
  );
}
