// elevate-client/src/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);

      setMsg("Login successful!");

      setTimeout(() => {
  if (user.role === "seeker") {
    navigate("/dashboard");
  } else if (user.role === "employer") {
    navigate("/employer/dashboard");  // <-- new route to employer dashboard
  } else {
    navigate("/");
  }
}, 1000);

    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
