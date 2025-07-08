import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ApplyJob() {
  const { id: jobId } = useParams(); // get job id from URL
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setMessage("⚠️ Please upload your resume.");
      return;
    }
    if (!coverLetter.trim()) {
      setMessage("⚠️ Please enter a cover letter.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ You must be logged in to apply.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resume", resume); // multer expects field named 'resume'
    formData.append("coverLetter", coverLetter);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/jobs/apply/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Application submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Apply job error:", err);
      setMessage(
        err.response?.data?.msg || "❌ Failed to submit application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>

      {message && (
        <p
          className={`mb-4 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Resume (PDF, DOC, DOCX)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => e.target.files && setResume(e.target.files[0])}
            // removed required, manual validation instead
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={6}
            // removed required, manual validation instead
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
