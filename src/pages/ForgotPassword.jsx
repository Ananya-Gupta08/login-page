import { useState } from "react";

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
    <div className="bound">
      <h3>Forgot Password</h3>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>
    </div>
  );
}
