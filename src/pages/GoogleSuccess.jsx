import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      alert("Google login failed. No token received.");
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);
    navigate("/profile");
  }, []);

  return <p>Logging you in...</p>;
}
