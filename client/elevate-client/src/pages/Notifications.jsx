import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view notifications.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications);
      } catch (err) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      alert("Failed to mark notification as read.");
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <ul>
        {notifications.map(({ _id, message, read, createdAt }) => (
          <li
            key={_id}
            className={`p-4 mb-2 rounded border ${
              read ? "bg-gray-100 text-gray-600" : "bg-white font-semibold"
            }`}
          >
            <p>{message}</p>
            <small className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleString()}
            </small>
            {!read && (
              <button
                onClick={() => markAsRead(_id)}
                className="ml-4 text-blue-600 hover:underline"
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
