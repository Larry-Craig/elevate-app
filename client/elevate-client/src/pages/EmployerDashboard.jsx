import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employer/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.jobs);
      } catch (err) {
        setMsg("⚠️ Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchJobs();
    else setLoading(false);
  }, [token]);

  if (loading) return <p>Loading jobs...</p>;

  if (msg) return <p className="text-red-600">{msg}</p>;

  if (jobs.length === 0)
    return <p>You haven’t posted any jobs yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Posted Jobs</h2>
      {jobs.map(({ job, applicants }) => (
        <div key={job._id} className="border p-4 mb-6 rounded shadow">
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p className="text-gray-700">{job.location} · {job.jobType}</p>
          <p className="mt-2">{job.description}</p>

          <h4 className="mt-4 font-semibold">Applicants ({applicants.length}):</h4>
          {applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {applicants.map((app) => (
                <li key={app._id}>
                  {app.applicant.name} ({app.applicant.email}) — Applied on{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployerDashboard;
