import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [msg, setMsg] = useState("");

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const token = localStorage.getItem("token");

  // Fetch jobs with optional filters
  const fetchJobs = async (filters = {}) => {
    setLoadingJobs(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `http://localhost:5000/api/jobs${params ? `?${params}` : ""}`;
      const res = await axios.get(url);
      setJobs(res.data.jobs);
      setMsg("");
    } catch (err) {
      setMsg("⚠️ Could not load jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    const fetchSavedJobs = async () => {
      setLoadingSaved(true);
      try {
        const res = await axios.get("http://localhost:5000/api/saved-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(res.data.jobs);
      } catch {
        setMsg("⚠️ Could not load saved jobs.");
      } finally {
        setLoadingSaved(false);
      }
    };

    const fetchUnreadNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const res = await axios.get("http://localhost:5000/api/notifications/unread-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.unreadCount || 0);
      } catch {
        setMsg("⚠️ Failed to fetch unread notifications count.");
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (token) {
      fetchSavedJobs();
      fetchUnreadNotifications();
    } else {
      setLoadingSaved(false);
      setLoadingNotifications(false);
    }
  }, [token]);

  // Handle form submit for search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ keyword, location });
  };

  return (
    <div className="min-h-screen p-6">
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Elevate</h1>
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="cursor-pointer">Find Jobs</li>
            <li className="cursor-pointer">My Jobs</li>
            <li className="cursor-pointer relative">
              Saved
              {!loadingSaved && savedJobs.length > 0 && (
                <span className="ml-1 inline-block bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {savedJobs.length}
                </span>
              )}
            </li>
            <li className="cursor-pointer relative">
              Notifications
              {!loadingNotifications && unreadCount > 0 && (
                <span className="ml-1 inline-block bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </li>
            <li className="cursor-pointer">Profile</li>
          </ul>
        </nav>
      </header>

      {/* Search */}
      <section className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border px-4 py-2 w-1/2"
          />
          <input
            type="text"
            placeholder="City, state, or region"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border px-4 py-2 w-1/2"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2">
            Search
          </button>
        </form>
      </section>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Recommended Jobs */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Recommended Jobs</h2>
            {loadingJobs ? (
              <p>Loading...</p>
            ) : msg ? (
              <p className="text-red-500">{msg}</p>
            ) : jobs.length === 0 ? (
              <p>No job recommendations yet.</p>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <Link to={`/jobs/${job._id}`} key={job._id}>
                    <li className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer">
                      <h3 className="font-bold">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {job.location} · {job.jobType}
                      </p>
                      <p className="mt-2">{job.description?.slice(0, 100)}...</p>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </section>

          {/* Saved Jobs */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Saved Jobs</h2>
            {loadingSaved ? (
              <p>Loading saved jobs...</p>
            ) : savedJobs.length === 0 ? (
              <p>You haven’t saved any jobs yet.</p>
            ) : (
              <ul className="space-y-4">
                {savedJobs.map((job) => (
                  <Link to={`/jobs/${job._id}`} key={job._id}>
                    <li className="border p-3 rounded shadow hover:bg-gray-100 cursor-pointer">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {job.location} · {job.jobType}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Recent Applications</h2>
            <p>You haven’t applied to any jobs yet.</p>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p>
              {loadingNotifications
                ? "Loading notifications..."
                : unreadCount > 0
                ? `You have ${unreadCount} unread notification(s).`
                : "No notifications at this time."}
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Elevate Inc. · Terms · Privacy
      </footer>
    </div>
  );
};

export default Dashboard;
