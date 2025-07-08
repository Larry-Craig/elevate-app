import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SeekerSetup() {
  const [form, setForm] = useState({
    email: "", // You can auto-fill this later from login context
    name: "",
    location: "",
    phone: "",
    summary: "",
    resume: null,
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/seeker/setup", data);
      setMsg("Profile completed. Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Profile update failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
        {msg && <div className="mb-4 text-center text-red-600">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full px-4 py-2 border rounded"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border rounded"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="summary"
            placeholder="Professional Summary (max 500 chars)"
            className="w-full px-4 py-2 border rounded"
            value={form.summary}
            onChange={handleChange}
            maxLength={500}
            required
          />
          <input
            type="file"
            name="resume"
            accept=".pdf,.docx"
            onChange={handleFile}
            required
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
