import React, { useState } from "react";
import axios from "axios";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    requirements: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // adjust if you use context or cookies

    try {
      const res = await axios.post(
        "http://localhost:5000/api/employer/jobs",
        {
          ...form,
          requirements: form.requirements.split(",").map((req) => req.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Job posted successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        jobType: "Full-time",
        salary: "",
        requirements: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to post job.");
    }
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title:</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div>
          <label>Location:</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} required />
        </div>

        <div>
          <label>Job Type:</label>
          <select name="jobType" value={form.jobType} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
          </select>
        </div>

        <div>
          <label>Salary:</label>
          <input type="text" name="salary" value={form.salary} onChange={handleChange} />
        </div>

        <div>
          <label>Requirements (comma-separated):</label>
          <input
            type="text"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Post Job</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default PostJob;
