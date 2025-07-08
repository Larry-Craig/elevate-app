// client/elevate-client/src/pages/MyApplications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/application/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications);
      } catch (err) {
        console.error(err);
        setMsg("⚠️ Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : msg ? (
        <p className="text-red-500">{msg}</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{app.job.title}</h3>
              <p className="text-sm text-gray-600">
                {app.job.location} · {app.job.jobType}
              </p>
              <p className="mt-1">Status: <span className="font-medium">{app.status}</span></p>
              <Link to={`/jobs/${app.job._id}`} className="text-blue-600 underline mt-2 inline-block">
                View Job Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyApplications;
