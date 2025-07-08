import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Messaging() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data.conversations);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    fetchConversations();
  }, [token]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (!selectedConv) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/conversations/${selectedConv._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };
    fetchMessages();
  }, [selectedConv, token]);

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a new message
  const handleSend = async () => {
    if (!newMsg.trim() || !selectedConv) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/messages/conversations/${selectedConv._id}/message`,
        { text: newMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data.message]);
      setNewMsg("");
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Conversations List */}
      <div className="w-1/4 border rounded p-2 overflow-y-auto">
        <h2 className="font-bold mb-2">Conversations</h2>
        {conversations.length === 0 ? (
          <p>No conversations found.</p>
        ) : (
          <ul>
            {conversations.map((conv) => (
              <li
                key={conv._id}
                onClick={() => setSelectedConv(conv)}
                className={`cursor-pointer p-2 rounded ${
                  selectedConv?._id === conv._id ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
              >
                {conv.participants
                  .filter((u) => u._id !== conv.currentUserId)
                  .map((u) => u.name || u.email)
                  .join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Messages Panel */}
      <div className="flex-1 flex flex-col border rounded p-4">
        <h2 className="font-bold mb-2">
          {selectedConv
            ? `Chat with ${selectedConv.participants
                .filter((u) => u._id !== selectedConv.currentUserId)
                .map((u) => u.name || u.email)
                .join(", ")}`
            : "Select a conversation"}
        </h2>
        <div
          className="flex-1 overflow-y-auto border p-2 mb-4 rounded bg-gray-50"
          style={{ minHeight: "300px" }}
        >
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 p-2 rounded max-w-xs ${
                  msg.sender === selectedConv.currentUserId
                    ? "bg-green-200 self-end"
                    : "bg-white self-start"
                }`}
                style={{ wordBreak: "break-word" }}
              >
                <p>{msg.text}</p>
                <small className="text-gray-600 text-xs">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedConv && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded px-3 py-2"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
