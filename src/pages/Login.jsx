import { useState } from "react";
// import ForgotFlow from "./ForgotFlow";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();


    const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
     
      alert("Login successful");
      navigate("/profile");
      
    } else {
      alert(data.message);
    }
    
  };

  //forgetpass 
  // if (showForgot) {
  //   return (
  //     <div>
  //       <ForgotFlow />
  //       <br />
  //       <button onClick={() => setShowForgot(false)}>
  //         Back to Login
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="bound">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">Login</button>
      </form>
      <p onClick={() => navigate("/signup")} className="auth-link">
         New user? Signup
      </p>

      

      <br />

       {/* forgot password btn  */}
      <button style={{ background: "none", color: "blue", border: "none" }}onClick={() => navigate("/forgot-password")}>
         Forgot Password?
      </button>

    </div>
  );
}
