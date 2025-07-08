 import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "seeker",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg("Signup successful. OTP sent to your email.");
      setTimeout(() => navigate("/verify"), 1500);
    } catch (err) {
      console.error(err); 
      setMsg(err.response?.data?.msg || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        {msg && (
          <div className="mb-4 text-sm text-center text-red-600">{msg}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="seeker"
                checked={form.role === "seeker"}
                onChange={handleChange}
              />
              Job Seeker
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="employer"
                checked={form.role === "employer"}
                onChange={handleChange}
              />
              Employer
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

