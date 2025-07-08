import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams(); // job ID
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        setMsg("⚠️ Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    const checkIfSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/saved-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(res.data.jobs.some((j) => j._id === id));
      } catch {
        // silently fail or handle error if desired
      }
    };

    fetchJob();
    checkIfSaved();
  }, [id]);

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("⚠️ You must be logged in to save jobs.");
      return;
    }

    try {
      if (saved) {
        await axios.delete(`http://localhost:5000/api/saved-jobs/unsave/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(false);
        setMsg("Job removed from saved jobs.");
      } else {
        await axios.post(`http://localhost:5000/api/saved-jobs/save/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(true);
        setMsg("Job saved successfully.");
      }
    } catch {
      setMsg("❌ Failed to update saved jobs.");
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">{job.title}</h2>
      <p className="mb-2 text-gray-600">
        {job.location} · {job.jobType}
      </p>
      <p className="mb-4">{job.description}</p>
      <h3 className="font-semibold">Requirements:</h3>
      <ul className="list-disc list-inside mb-6">
        {job.requirements && job.requirements.length > 0 ? (
          job.requirements.map((req, i) => <li key={i}>{req}</li>)
        ) : (
          <li>No specific requirements listed.</li>
        )}
      </ul>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/jobs/${id}/apply`)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Apply Now
        </button>

        <button
          onClick={handleSaveToggle}
          className={`px-6 py-2 rounded text-white ${
            saved ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saved ? "Unsave Job" : "Save Job"}
        </button>
      </div>

      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
};

export default JobDetails;
